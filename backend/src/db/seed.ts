import db from './database.js';
import { migrate } from './migrate.js';

migrate();

const students = [
  { name: 'สมชาย ใจดี', email: 'somchai@example.com' },
  { name: 'สมหญิง รักเรียน', email: 'somying@example.com' },
  { name: 'นภาพร วิทยา', email: 'napaporn@example.com' },
  { name: 'วิชัย เก่งคณิต', email: 'wichai@example.com' }
];

const quizzes = [
  { title: 'แบบทดสอบคณิตศาสตร์ บทที่ 1', description: 'ทดสอบความรู้พื้นฐานคณิตศาสตร์' },
  { title: 'แบบทดสอบภาษาอังกฤษ', description: 'ทดสอบทักษะภาษาอังกฤษพื้นฐาน' },
  { title: 'แบบทดสอบวิทยาศาสตร์', description: 'ทดสอบความรู้เรื่องวิทยาศาสตร์' }
];

const insertStudent = db.prepare('INSERT INTO students (name, email) VALUES (?, ?)');
const insertQuiz = db.prepare('INSERT INTO quizzes (title, description) VALUES (?, ?)');
const insertAttempt = db.prepare(`
  INSERT INTO attempts (student_id, quiz_id, started_at, completed_at, score, max_score, status)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);
const insertAnswer = db.prepare(`
  INSERT INTO attempt_answers (attempt_id, question, learner_answer, correct_answer, is_correct, points, max_points)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);
const insertAudit = db.prepare(`
  INSERT INTO audit_logs (attempt_id, action, note, previous_score, new_score, created_at, actor)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const transaction = db.transaction(() => {
  db.prepare('DELETE FROM attempt_answers').run();
  db.prepare('DELETE FROM audit_logs').run();
  db.prepare('DELETE FROM attempts').run();
  db.prepare('DELETE FROM quizzes').run();
  db.prepare('DELETE FROM students').run();
  db.prepare("DELETE FROM sqlite_sequence WHERE name IN ('students','quizzes','attempts','attempt_answers','audit_logs')").run();

  const studentIds = students.map(student => Number(insertStudent.run(student.name, student.email).lastInsertRowid));
  const quizIds = quizzes.map(quiz => Number(insertQuiz.run(quiz.title, quiz.description).lastInsertRowid));

  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const attempt1 = Number(insertAttempt.run(studentIds[0], quizIds[0], twoWeeksAgo.toISOString(), twoWeeksAgo.toISOString(), 78, 100, 'completed').lastInsertRowid);
  insertAnswer.run(attempt1, '1 + 1 = ?', '2', '2', 1, 10, 10);
  insertAnswer.run(attempt1, '5 * 5 = ?', '25', '25', 1, 10, 10);
  insertAnswer.run(attempt1, '10 - 3 = ?', '7', '7', 1, 10, 10);
  insertAnswer.run(attempt1, '20 / 4 = ?', '5', '5', 1, 10, 10);
  insertAnswer.run(attempt1, 'ค่าเฉลี่ยของ 2, 4, 6 เท่ากับเท่าไร?', '4', '4', 1, 20, 20);
  insertAnswer.run(attempt1, 'ผลรวมของ 3 + 7 + 10 เท่ากับ?', '20', '20', 0, 8, 15);
  insertAudit.run(attempt1, 'note_added', 'ตรวจสอบแล้ว คะแนนรวมตรงตามการให้คะแนนอัตโนมัติ', null, null, twoWeeksAgo.toISOString(), 'ครูสมศรี');

  const attempt2 = Number(insertAttempt.run(studentIds[0], quizIds[1], lastWeek.toISOString(), lastWeek.toISOString(), 70, 100, 'completed').lastInsertRowid);
  insertAnswer.run(attempt2, 'What is "hello" in Thai?', 'สวัสดี', 'สวัสดี', 1, 20, 20);
  insertAnswer.run(attempt2, 'Translate "apple" to Thai.', 'แอปเปิ้ล', 'แอปเปิ้ล', 1, 20, 20);
  insertAnswer.run(attempt2, 'Choose the correct verb: "She ___ to school."', 'goes', 'goes', 1, 20, 20);
  insertAnswer.run(attempt2, 'Write a short sentence using the word "beautiful".', 'The flower is beautiful.', 'The flower is beautiful.', 1, 10, 10);
  insertAnswer.run(attempt2, 'What is the opposite of "hot"?', 'cold', 'cold', 1, 20, 20);
  insertAudit.run(attempt2, 'score_updated', 'ให้คะแนนเพิ่มเติมสำหรับการใช้ไวยากรณ์ถูกต้อง', 65, 70, lastWeek.toISOString(), 'ครูนารี');

  const attempt3 = Number(insertAttempt.run(studentIds[1], quizIds[0], yesterday.toISOString(), yesterday.toISOString(), 92, 100, 'completed').lastInsertRowid);
  insertAnswer.run(attempt3, '1 + 1 = ?', '2', '2', 1, 10, 10);
  insertAnswer.run(attempt3, '5 * 5 = ?', '25', '25', 1, 10, 10);
  insertAnswer.run(attempt3, '10 - 3 = ?', '7', '7', 1, 10, 10);
  insertAnswer.run(attempt3, 'ผลคูณของ 12 x 3 เท่ากับ?', '36', '36', 1, 20, 20);
  insertAnswer.run(attempt3, '12/3 = ?', '4', '4', 1, 10, 10);
  insertAnswer.run(attempt3, 'ค่าเฉลี่ยของ 8, 12, 20 เท่ากับ?', '13.3', '13.3', 1, 20, 20);
  insertAnswer.run(attempt3, '20 + 35 = ?', '55', '55', 1, 12, 12);

  const attempt4 = Number(insertAttempt.run(studentIds[2], quizIds[2], now.toISOString(), now.toISOString(), 60, 100, 'completed').lastInsertRowid);
  insertAnswer.run(attempt4, 'What is H2O?', 'Water', 'Water', 1, 30, 30);
  insertAnswer.run(attempt4, 'What is CO2?', 'Oxygen', 'Carbon Dioxide', 0, 0, 30);
  insertAnswer.run(attempt4, 'What planet is known as the Red Planet?', 'Mars', 'Mars', 1, 30, 30);
  insertAnswer.run(attempt4, 'What force keeps us on the ground?', 'Gravity', 'Gravity', 1, 20, 20);
  insertAudit.run(attempt4, 'note_added', 'ตรวจพบคำตอบผิดที่ข้อ 2 แจ้งให้ผู้เรียนทบทวน', null, null, now.toISOString(), 'ครูมนตรี');

  const attempt5 = Number(insertAttempt.run(studentIds[3], quizIds[1], now.toISOString(), now.toISOString(), 55, 100, 'completed').lastInsertRowid);
  insertAnswer.run(attempt5, 'What is "good morning" in Thai?', 'อรุณสวัสดิ์', 'อรุณสวัสดิ์', 1, 20, 20);
  insertAnswer.run(attempt5, 'Select the correct article: "___ apple"', 'An', 'An', 1, 10, 10);
  insertAnswer.run(attempt5, 'Rewrite in plural: "The child is playing"', 'The children are playing', 'The children are playing', 1, 15, 20);
  insertAnswer.run(attempt5, 'Choose the correct preposition: "She sat ___ the chair"', 'on', 'on', 1, 10, 20);
  insertAnswer.run(attempt5, 'Fill in the blank: "He ___ to the store yesterday"', 'went', 'went', 1, 0, 20);
  insertAudit.run(attempt5, 'note_added', 'มีข้อผิดพลาดในเรื่อง Tense เล็กน้อย', null, null, now.toISOString(), 'ครูนารี');
});

transaction();

console.log('Database seeded successfully!');
