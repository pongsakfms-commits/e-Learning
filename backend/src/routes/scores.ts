import { Router } from 'express';
import db from '../db/database.js';
import { AttemptSummary, AttemptDetail } from '../types.js';
import { z } from 'zod';

const router = Router();

router.get('/attempts', (req, res) => {
  const { studentId, quizId, startDate, endDate, search } = req.query;

  let query = `
    SELECT 
      a.id, a.student_id as studentId, s.name as studentName, s.email as studentEmail,
      a.quiz_id as quizId, q.title as quizTitle,
      a.started_at as startedAt, a.completed_at as completedAt,
      a.score, a.max_score as maxScore, a.status,
      COUNT(*) OVER (PARTITION BY a.student_id, a.quiz_id) as attemptCount,
      (SELECT note FROM audit_logs WHERE attempt_id = a.id ORDER BY created_at DESC LIMIT 1) as lastAuditNote,
      (SELECT created_at FROM audit_logs WHERE attempt_id = a.id ORDER BY created_at DESC LIMIT 1) as lastAuditAt
    FROM attempts a
    JOIN students s ON a.student_id = s.id
    JOIN quizzes q ON a.quiz_id = q.id
    WHERE 1=1
  `;

  const params: any[] = [];

  if (studentId) {
    query += ' AND a.student_id = ?';
    params.push(studentId);
  }

  if (quizId) {
    query += ' AND a.quiz_id = ?';
    params.push(quizId);
  }

  if (startDate) {
    query += ' AND a.started_at >= ?';
    params.push(startDate);
  }

  if (endDate) {
    query += ' AND a.started_at <= ?';
    params.push(endDate);
  }

  if (search) {
    query += ' AND (s.name LIKE ? OR s.email LIKE ? OR q.title LIKE ?)';
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern);
  }

  query += ' ORDER BY a.started_at DESC';

  const attempts = db.prepare(query).all(...params) as any[];

  const results: AttemptSummary[] = attempts.map(a => ({
    id: a.id,
    studentId: a.studentId,
    studentName: a.studentName,
    studentEmail: a.studentEmail,
    quizId: a.quizId,
    quizTitle: a.quizTitle,
    startedAt: a.startedAt,
    completedAt: a.completedAt,
    score: a.score,
    maxScore: a.maxScore,
    percentage: (a.score / a.maxScore) * 100,
    status: a.status,
    attemptCount: a.attemptCount,
    lastAuditNote: a.lastAuditNote,
    lastAuditAt: a.lastAuditAt
  }));

  res.json(results);
});

router.get('/attempts/:id', (req, res) => {
  const { id } = req.params;

  const attempt = db.prepare(`
    SELECT 
      a.id, a.student_id, a.quiz_id, a.started_at, a.completed_at,
      a.score, a.max_score, a.status,
      s.name as student_name, s.email as student_email,
      q.title as quiz_title
    FROM attempts a
    JOIN students s ON a.student_id = s.id
    JOIN quizzes q ON a.quiz_id = q.id
    WHERE a.id = ?
  `).get(id) as any;

  if (!attempt) {
    return res.status(404).json({ error: 'Attempt not found' });
  }

  const answers = db.prepare(`
    SELECT id, question, learner_answer, correct_answer, is_correct, points, max_points
    FROM attempt_answers
    WHERE attempt_id = ?
  `).all(id) as any[];

  const auditLog = db.prepare(`
    SELECT id, action, note, previous_score, new_score, actor, created_at
    FROM audit_logs
    WHERE attempt_id = ?
    ORDER BY created_at DESC
  `).all(id) as any[];

  const result: AttemptDetail = {
    id: attempt.id,
    student: {
      id: attempt.student_id,
      name: attempt.student_name,
      email: attempt.student_email
    },
    quiz: {
      id: attempt.quiz_id,
      title: attempt.quiz_title
    },
    startedAt: attempt.started_at,
    completedAt: attempt.completed_at,
    score: attempt.score,
    maxScore: attempt.max_score,
    percentage: (attempt.score / attempt.max_score) * 100,
    status: attempt.status,
    answers: answers.map(a => ({
      id: a.id,
      question: a.question,
      learnerAnswer: a.learner_answer,
      correctAnswer: a.correct_answer,
      isCorrect: Boolean(a.is_correct),
      points: a.points,
      maxPoints: a.max_points
    })),
    auditLog: auditLog.map(log => ({
      id: log.id,
      action: log.action,
      note: log.note,
      previousScore: log.previous_score,
      newScore: log.new_score,
      actor: log.actor,
      createdAt: log.created_at
    }))
  };

  res.json(result);
});

const updateScoreSchema = z.object({
  score: z.number().min(0),
  note: z.string().optional()
});

router.patch('/attempts/:id/score', (req, res) => {
  try {
    const { id } = req.params;
    const { score, note } = updateScoreSchema.parse(req.body);

    const attempt = db.prepare('SELECT score, max_score FROM attempts WHERE id = ?').get(id) as any;

    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found' });
    }

    if (score > attempt.max_score) {
      return res.status(400).json({ error: 'Score cannot exceed max score' });
    }

    const previousScore = attempt.score;

    const transaction = db.transaction(() => {
      db.prepare('UPDATE attempts SET score = ? WHERE id = ?').run(score, id);

      db.prepare(`
        INSERT INTO audit_logs (attempt_id, action, note, previous_score, new_score, created_at, actor)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(id, 'score_updated', note || null, previousScore, score, new Date().toISOString(), 'admin');
    });

    transaction();

    res.json({ success: true, previousScore, newScore: score });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    throw error;
  }
});

const addNoteSchema = z.object({
  note: z.string().min(1)
});

router.post('/attempts/:id/note', (req, res) => {
  try {
    const { id } = req.params;
    const { note } = addNoteSchema.parse(req.body);

    const attempt = db.prepare('SELECT id FROM attempts WHERE id = ?').get(id);

    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found' });
    }

    db.prepare(`
      INSERT INTO audit_logs (attempt_id, action, note, created_at, actor)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, 'note_added', note, new Date().toISOString(), 'admin');

    res.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    throw error;
  }
});

router.get('/students', (req, res) => {
  const students = db.prepare('SELECT id, name, email FROM students ORDER BY name').all();
  res.json(students);
});

router.get('/quizzes', (req, res) => {
  const quizzes = db.prepare('SELECT id, title, description FROM quizzes ORDER BY title').all();
  res.json(quizzes);
});

router.get('/report/:studentId', (req, res) => {
  const { studentId } = req.params;

  const student = db.prepare('SELECT name, email FROM students WHERE id = ?').get(studentId) as any;

  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const attempts = db.prepare(`
    SELECT 
      a.id, q.title as quiz_title,
      a.started_at, a.completed_at,
      a.score, a.max_score, a.status
    FROM attempts a
    JOIN quizzes q ON a.quiz_id = q.id
    WHERE a.student_id = ?
    ORDER BY a.started_at DESC
  `).all(studentId) as any[];

  const report = {
    student: {
      name: student.name,
      email: student.email
    },
    attempts: attempts.map(a => ({
      id: a.id,
      quizTitle: a.quiz_title,
      startedAt: a.started_at,
      completedAt: a.completed_at,
      score: a.score,
      maxScore: a.max_score,
      percentage: (a.score / a.max_score) * 100,
      status: a.status
    })),
    summary: {
      totalAttempts: attempts.length,
      averageScore: attempts.reduce((sum, a) => sum + (a.score / a.max_score) * 100, 0) / attempts.length || 0
    }
  };

  res.json(report);
});

router.get('/report/:studentId/export', (req, res) => {
  const { studentId } = req.params;

  const student = db.prepare('SELECT name, email FROM students WHERE id = ?').get(studentId) as any;

  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const attempts = db.prepare(`
    SELECT 
      a.id, q.title as quiz_title,
      a.started_at, a.completed_at,
      a.score, a.max_score, a.status
    FROM attempts a
    JOIN quizzes q ON a.quiz_id = q.id
    WHERE a.student_id = ?
    ORDER BY a.started_at DESC
  `).all(studentId) as any[];

  const header = ['Attempt ID', 'Quiz Title', 'Started At', 'Completed At', 'Score', 'Max Score', 'Percentage', 'Status'];
  const rows = attempts.map(a => [
    a.id,
    a.quiz_title,
    a.started_at,
    a.completed_at ?? '',
    a.score,
    a.max_score,
    ((a.score / a.max_score) * 100).toFixed(2),
    a.status
  ]);

  const csvLines = [header, ...rows].map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
  const filename = `${student.name.replace(/[^a-zA-Z0-9\u0E00-\u0E7F]+/g, '-')}-report.csv`;

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(`\ufeff${csvLines}`);
});

export default router;
