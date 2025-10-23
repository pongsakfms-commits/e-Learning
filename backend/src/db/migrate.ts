import db from './database.js';

const migrations = [
  `
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS quizzes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    quiz_id INTEGER NOT NULL,
    started_at TEXT NOT NULL,
    completed_at TEXT,
    score REAL NOT NULL,
    max_score REAL NOT NULL,
    status TEXT DEFAULT 'completed',
    FOREIGN KEY(student_id) REFERENCES students(id),
    FOREIGN KEY(quiz_id) REFERENCES quizzes(id)
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS attempt_answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    attempt_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    learner_answer TEXT,
    correct_answer TEXT,
    is_correct INTEGER NOT NULL DEFAULT 0,
    points REAL NOT NULL DEFAULT 0,
    max_points REAL NOT NULL DEFAULT 0,
    FOREIGN KEY(attempt_id) REFERENCES attempts(id)
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    attempt_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    note TEXT,
    previous_score REAL,
    new_score REAL,
    created_at TEXT NOT NULL,
    actor TEXT DEFAULT 'admin',
    FOREIGN KEY(attempt_id) REFERENCES attempts(id)
  );
  `
];

export function migrate() {
  const transaction = db.transaction((statements: string[]) => {
    for (const statement of statements) {
      db.prepare(statement).run();
    }
  });

  transaction(migrations);
}

if (process.env.NODE_ENV !== 'test') {
  migrate();
}
