const fs = require('fs');
const path = require('path');
const { randomUUID, randomBytes, createHash } = require('crypto');

const DATA_FILE = path.join(__dirname, '..', 'data', 'students.json');

const EXAM_STATUSES = [
  { value: 'not_started', label: 'ยังไม่เริ่มสอบ' },
  { value: 'in_progress', label: 'กำลังทำข้อสอบ' },
  { value: 'passed', label: 'ผ่านการสอบ' },
  { value: 'failed', label: 'ไม่ผ่านการสอบ' },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ensureDataFile() {
  const directory = path.dirname(DATA_FILE);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }
}

function readStudents() {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, 'utf8');

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('ไม่สามารถอ่านไฟล์ students.json ได้', error);
    return [];
  }
}

function writeStudents(students) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2));
}

function sanitizeStudent(student) {
  if (!student) {
    return null;
  }

  const { passwordHash, ...rest } = student;
  return { ...rest };
}

function normalizeEmail(email) {
  return (email || '').trim().toLowerCase();
}

function hashPassword(password) {
  return createHash('sha256').update(String(password)).digest('hex');
}

function generateReadablePassword(length = 10) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  const bytes = randomBytes(length);
  let result = '';

  for (let i = 0; i < length; i += 1) {
    const index = bytes[i] % alphabet.length;
    result += alphabet[index];
  }

  return result;
}

function getExamStatusValues() {
  return EXAM_STATUSES.map((status) => status.value);
}

function clampPerPage(perPage) {
  const parsed = parseInt(perPage, 10);

  if (Number.isNaN(parsed) || parsed <= 0) {
    return 10;
  }

  if (parsed > 100) {
    return 100;
  }

  return parsed;
}

function sortByCreatedAtDesc(a, b) {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

function emailExists(email, ignoreId = null) {
  const normalized = normalizeEmail(email);
  if (!normalized) {
    return false;
  }

  const students = readStudents();

  return students.some((student) => {
    if (ignoreId && student.id === ignoreId) {
      return false;
    }

    return normalizeEmail(student.email) === normalized;
  });
}

function findStudentIndex(students, id) {
  return students.findIndex((student) => student.id === id);
}

function list({ searchTerm = '', examStatus = 'all', page = 1, perPage = 10 } = {}) {
  const students = readStudents();
  const normalizedSearch = (searchTerm || '').trim().toLowerCase();
  const normalizedStatus = (examStatus || '').trim();
  const normalizedPage = Math.max(parseInt(page, 10) || 1, 1);
  const normalizedPerPage = clampPerPage(perPage);

  let filtered = [...students];

  if (normalizedSearch) {
    filtered = filtered.filter((student) => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      const email = normalizeEmail(student.email);
      return fullName.includes(normalizedSearch) || email.includes(normalizedSearch);
    });
  }

  if (normalizedStatus && normalizedStatus !== 'all') {
    filtered = filtered.filter((student) => student.examStatus === normalizedStatus);
  }

  filtered.sort(sortByCreatedAtDesc);

  const totalItems = filtered.length;
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / normalizedPerPage);
  const currentPage = totalPages === 0 ? 1 : Math.min(normalizedPage, totalPages);
  const offset = (currentPage - 1) * normalizedPerPage;
  const pageItems = filtered.slice(offset, offset + normalizedPerPage);
  const from = totalItems === 0 ? 0 : offset + 1;
  const to = offset + pageItems.length;

  return {
    data: pageItems.map(sanitizeStudent),
    pagination: {
      totalItems,
      totalPages,
      currentPage,
      perPage: normalizedPerPage,
      hasNext: totalPages > 0 && currentPage < totalPages,
      hasPrev: totalPages > 0 && currentPage > 1,
      nextPage: totalPages > 0 && currentPage < totalPages ? currentPage + 1 : null,
      prevPage: totalPages > 0 && currentPage > 1 ? currentPage - 1 : null,
      from,
      to,
      pageItems: pageItems.length,
    },
  };
}

function listAll({ searchTerm = '', examStatus = 'all' } = {}) {
  const students = readStudents();
  const normalizedSearch = (searchTerm || '').trim().toLowerCase();
  const normalizedStatus = (examStatus || '').trim();

  let filtered = [...students];

  if (normalizedSearch) {
    filtered = filtered.filter((student) => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      const email = normalizeEmail(student.email);
      return fullName.includes(normalizedSearch) || email.includes(normalizedSearch);
    });
  }

  if (normalizedStatus && normalizedStatus !== 'all') {
    filtered = filtered.filter((student) => student.examStatus === normalizedStatus);
  }

  filtered.sort(sortByCreatedAtDesc);

  return {
    data: filtered.map(sanitizeStudent),
    total: filtered.length,
  };
}

function getStudentById(id) {
  const students = readStudents();
  const student = students.find((item) => item.id === id);
  return sanitizeStudent(student);
}

function getStudentRecord(id) {
  const students = readStudents();
  const index = findStudentIndex(students, id);

  if (index === -1) {
    return null;
  }

  return { index, students, student: students[index] };
}

function createStudent({ firstName, lastName, email, examStatus, password }) {
  const normalizedEmail = normalizeEmail(email);
  const trimmedFirstName = (firstName || '').trim();
  const trimmedLastName = (lastName || '').trim();

  if (emailExists(normalizedEmail)) {
    throw new Error('อีเมลนี้ถูกใช้งานแล้ว');
  }

  if (!getExamStatusValues().includes(examStatus)) {
    throw new Error('สถานะการสอบไม่ถูกต้อง');
  }

  const students = readStudents();
  const timestamp = new Date().toISOString();

  const newStudent = {
    id: randomUUID(),
    firstName: trimmedFirstName,
    lastName: trimmedLastName,
    email: normalizedEmail,
    examStatus,
    passwordHash: hashPassword(password),
    createdAt: timestamp,
    updatedAt: timestamp,
    lastPasswordResetAt: null,
  };

  students.push(newStudent);
  writeStudents(students);

  return sanitizeStudent(newStudent);
}

function updateStudent(id, { firstName, lastName, email, examStatus }) {
  const record = getStudentRecord(id);

  if (!record) {
    throw new Error('ไม่พบผู้เรียนที่ต้องการแก้ไข');
  }

  const { index, students } = record;
  const target = students[index];
  const normalizedEmail = normalizeEmail(email);

  if (emailExists(normalizedEmail, id)) {
    throw new Error('อีเมลนี้ถูกใช้งานแล้ว');
  }

  if (!getExamStatusValues().includes(examStatus)) {
    throw new Error('สถานะการสอบไม่ถูกต้อง');
  }

  target.firstName = (firstName || '').trim();
  target.lastName = (lastName || '').trim();
  target.email = normalizedEmail;
  target.examStatus = examStatus;
  target.updatedAt = new Date().toISOString();

  students[index] = target;
  writeStudents(students);

  return sanitizeStudent(target);
}

function deleteStudent(id) {
  const students = readStudents();
  const index = findStudentIndex(students, id);

  if (index === -1) {
    throw new Error('ไม่พบผู้เรียนที่ต้องการลบ');
  }

  const [removed] = students.splice(index, 1);
  writeStudents(students);

  return sanitizeStudent(removed);
}

function resetPassword(id) {
  const record = getStudentRecord(id);

  if (!record) {
    throw new Error('ไม่พบผู้เรียนสำหรับการรีเซ็ตรหัสผ่าน');
  }

  const { student, students, index } = record;
  const newPassword = generateReadablePassword(10);
  const timestamp = new Date().toISOString();

  student.passwordHash = hashPassword(newPassword);
  student.updatedAt = timestamp;
  student.lastPasswordResetAt = timestamp;

  students[index] = student;
  writeStudents(students);

  return {
    student: sanitizeStudent(student),
    newPassword,
  };
}

function getExamStatuses() {
  return EXAM_STATUSES.map((status) => ({ ...status }));
}

function getExamStatusLabels() {
  return EXAM_STATUSES.reduce((acc, status) => {
    acc[status.value] = status.label;
    return acc;
  }, {});
}

function importStudents(records = []) {
  const students = readStudents();
  const emailIndex = new Map();

  students.forEach((student, index) => {
    const normalizedEmail = normalizeEmail(student.email);
    if (normalizedEmail) {
      emailIndex.set(normalizedEmail, index);
    }
  });

  const allowedStatuses = getExamStatusValues();
  const seenInBatch = new Map();

  const summary = {
    totalRows: records.length,
    createdCount: 0,
    updatedCount: 0,
    failedCount: 0,
    successCount: 0,
    errors: [],
  };

  let hasChanges = false;

  records.forEach((rawRecord, index) => {
    const rowNumber = index + 2;
    const messages = [];

    const firstName = String(rawRecord.firstName ?? '').trim();
    const lastName = String(rawRecord.lastName ?? '').trim();
    const email = normalizeEmail(rawRecord.email);
    const password = String(rawRecord.password ?? '').trim();
    const examStatus = String(rawRecord.examStatus ?? '').trim();

    if (!firstName) {
      messages.push('ต้องระบุชื่อ');
    }

    if (!lastName) {
      messages.push('ต้องระบุนามสกุล');
    }

    if (!email) {
      messages.push('ต้องระบุอีเมล');
    } else if (!EMAIL_REGEX.test(email)) {
      messages.push('รูปแบบอีเมลไม่ถูกต้อง');
    }

    if (!password) {
      messages.push('ต้องระบุรหัสผ่าน');
    } else if (password.length < 6 || password.length > 50) {
      messages.push('รหัสผ่านต้องมีความยาว 6-50 ตัวอักษร');
    }

    if (!examStatus) {
      messages.push('ต้องระบุสถานะการสอบ');
    } else if (!allowedStatuses.includes(examStatus)) {
      messages.push(`สถานะการสอบไม่ถูกต้อง (ต้องเป็น ${allowedStatuses.join(', ')})`);
    }

    if (messages.length) {
      summary.failedCount += 1;
      summary.errors.push({
        row: rowNumber,
        messages,
      });
      return;
    }

    if (seenInBatch.has(email)) {
      summary.failedCount += 1;
      summary.errors.push({
        row: rowNumber,
        messages: [`อีเมลซ้ำกับแถวที่ ${seenInBatch.get(email)}`],
      });
      return;
    }

    seenInBatch.set(email, rowNumber);

    const timestamp = new Date().toISOString();

    if (emailIndex.has(email)) {
      const existingIndex = emailIndex.get(email);
      const existing = students[existingIndex];

      existing.firstName = firstName;
      existing.lastName = lastName;
      existing.examStatus = examStatus;
      existing.passwordHash = hashPassword(password);
      existing.updatedAt = timestamp;
      existing.lastPasswordResetAt = timestamp;

      students[existingIndex] = existing;
      summary.updatedCount += 1;
    } else {
      const newStudent = {
        id: randomUUID(),
        firstName,
        lastName,
        email,
        examStatus,
        passwordHash: hashPassword(password),
        createdAt: timestamp,
        updatedAt: timestamp,
        lastPasswordResetAt: null,
      };

      students.push(newStudent);
      emailIndex.set(email, students.length - 1);
      summary.createdCount += 1;
    }

    hasChanges = true;
  });

  if (hasChanges) {
    writeStudents(students);
  }

  summary.successCount = summary.createdCount + summary.updatedCount;

  return summary;
}

module.exports = {
  list,
  listAll,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  resetPassword,
  emailExists,
  getExamStatuses,
  getExamStatusLabels,
  importStudents,
};
