const express = require('express');
const { validationResult } = require('express-validator');
const StudentRepository = require('../lib/studentRepository');
const { createStudentRules, updateStudentRules } = require('../validation/studentRules');

const router = express.Router();

const perPageOptions = [10, 20, 50];
const dateTimeFormatter = new Intl.DateTimeFormat('th-TH', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

function mapValidationErrors(result) {
  if (result.isEmpty()) {
    return {};
  }

  return result.array().reduce((acc, error) => {
    acc[error.path] = error.msg;
    return acc;
  }, {});
}

function resolvePerPage(value) {
  const parsed = parseInt(value, 10);
  if (!Number.isNaN(parsed) && perPageOptions.includes(parsed)) {
    return parsed;
  }
  return perPageOptions[0];
}

function isValidStatus(value) {
  if (!value) {
    return false;
  }
  if (value === 'all') {
    return true;
  }
  return StudentRepository.getExamStatuses().some((status) => status.value === value);
}

function computePath(baseUrl, path = '') {
  if (!path) {
    return baseUrl || '/admin/students';
  }
  if (path.startsWith('/')) {
    return path;
  }
  const trimmedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  return `${trimmedBase}/${path}`;
}

function escapeCsv(value) {
  const stringValue = value === undefined || value === null ? '' : String(value);
  if (stringValue.includes(',') || stringValue.includes('\"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

router.use((req, res, next) => {
  res.locals.adminToken = req.adminToken;
  res.locals.examStatuses = StudentRepository.getExamStatuses();
  res.locals.examStatusLabels = StudentRepository.getExamStatusLabels();
  res.locals.perPageOptions = perPageOptions;
  res.locals.notice = req.query.notice || null;
  res.locals.error = req.query.error || null;
  res.locals.formatDateTime = (value) => {
    if (!value) {
      return '-';
    }
    return dateTimeFormatter.format(new Date(value));
  };

  const baseUrl = req.baseUrl || '/admin/students';

  res.locals.buildAdminUrl = (path = '', params = {}) => {
    const resolvedPath = computePath(baseUrl, path);
    const url = new URL(`http://localhost${resolvedPath}`);
    const searchParams = url.searchParams;

    if (req.adminToken) {
      searchParams.set('adminToken', req.adminToken);
    }

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        searchParams.delete(key);
        return;
      }
      searchParams.set(key, value);
    });

    const query = searchParams.toString();
    return query ? `${url.pathname}?${query}` : url.pathname;
  };

  next();
});

router.get('/', (req, res) => {
  const searchTerm = (req.query.q || '').trim();
  const statusQuery = (req.query.status || 'all').trim();
  const examStatus = isValidStatus(statusQuery) ? statusQuery : 'all';
  const perPage = resolvePerPage(req.query.perPage);
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

  const { data: students, pagination } = StudentRepository.list({
    searchTerm,
    examStatus,
    page,
    perPage,
  });

  res.render('students/index', {
    pageTitle: 'จัดการผู้เรียน',
    students,
    pagination,
    filters: {
      q: searchTerm,
      status: examStatus,
      perPage,
    },
  });
});

router.get('/new', (req, res) => {
  const defaultStatus = res.locals.examStatuses[0]?.value || 'not_started';

  res.render('students/form', {
    pageTitle: 'เพิ่มผู้เรียน',
    student: {
      firstName: '',
      lastName: '',
      email: '',
      examStatus: defaultStatus,
    },
    isEditing: false,
    errors: {},
    formError: null,
  });
});

router.post('/', createStudentRules, (req, res) => {
  const validation = validationResult(req);
  const defaultStatus = res.locals.examStatuses[0]?.value || 'not_started';

  const formData = {
    firstName: req.body.firstName || '',
    lastName: req.body.lastName || '',
    email: (req.body.email || '').toLowerCase(),
    examStatus: req.body.examStatus || defaultStatus,
  };

  if (!validation.isEmpty()) {
    return res.status(422).render('students/form', {
      pageTitle: 'เพิ่มผู้เรียน',
      student: formData,
      isEditing: false,
      errors: mapValidationErrors(validation),
      formError: null,
    });
  }

  try {
    StudentRepository.createStudent({
      ...formData,
      password: req.body.password,
    });

    return res.redirect(res.locals.buildAdminUrl('', {
      notice: 'สร้างข้อมูลผู้เรียนเรียบร้อยแล้ว',
    }));
  } catch (error) {
    const fieldErrors = {};
    if (error.message.includes('อีเมล')) {
      fieldErrors.email = error.message;
    }

    return res.status(400).render('students/form', {
      pageTitle: 'เพิ่มผู้เรียน',
      student: formData,
      isEditing: false,
      errors: fieldErrors,
      formError: fieldErrors.email ? null : 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองอีกครั้ง',
    });
  }
});

router.get('/:id/edit', (req, res) => {
  const student = StudentRepository.getStudentById(req.params.id);

  if (!student) {
    return res.status(404).render('not-found', {
      pageTitle: 'ไม่พบข้อมูล',
      message: 'ไม่พบผู้เรียนที่ต้องการแก้ไข',
    });
  }

  return res.render('students/form', {
    pageTitle: `แก้ไขผู้เรียน: ${student.firstName} ${student.lastName}`,
    student,
    isEditing: true,
    errors: {},
    formError: null,
  });
});

router.put('/:id', updateStudentRules, (req, res) => {
  const existingStudent = StudentRepository.getStudentById(req.params.id);

  if (!existingStudent) {
    return res.status(404).render('not-found', {
      pageTitle: 'ไม่พบข้อมูล',
      message: 'ไม่พบผู้เรียนที่ต้องการแก้ไข',
    });
  }

  const validation = validationResult(req);
  const defaultStatus = res.locals.examStatuses[0]?.value || 'not_started';
  const formData = {
    firstName: req.body.firstName || '',
    lastName: req.body.lastName || '',
    email: (req.body.email || '').toLowerCase(),
    examStatus: req.body.examStatus || defaultStatus,
    id: existingStudent.id,
  };

  if (!validation.isEmpty()) {
    return res.status(422).render('students/form', {
      pageTitle: `แก้ไขผู้เรียน: ${existingStudent.firstName} ${existingStudent.lastName}`,
      student: formData,
      isEditing: true,
      errors: mapValidationErrors(validation),
      formError: null,
    });
  }

  try {
    StudentRepository.updateStudent(req.params.id, formData);

    return res.redirect(res.locals.buildAdminUrl('', {
      notice: 'อัปเดตข้อมูลผู้เรียนเรียบร้อยแล้ว',
    }));
  } catch (error) {
    const fieldErrors = {};
    if (error.message.includes('อีเมล')) {
      fieldErrors.email = error.message;
    }

    const statusCode = error.message.includes('ไม่พบผู้เรียน') ? 404 : 400;

    return res.status(statusCode).render('students/form', {
      pageTitle: `แก้ไขผู้เรียน: ${existingStudent.firstName} ${existingStudent.lastName}`,
      student: formData,
      isEditing: true,
      errors: fieldErrors,
      formError: fieldErrors.email ? null : statusCode === 404 ? error.message : 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองอีกครั้ง',
    });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const removed = StudentRepository.deleteStudent(req.params.id);
    const studentName = removed ? `${removed.firstName} ${removed.lastName}` : '';

    return res.redirect(res.locals.buildAdminUrl('', {
      notice: studentName ? `ลบผู้เรียน ${studentName} เรียบร้อยแล้ว` : 'ลบข้อมูลผู้เรียนเรียบร้อยแล้ว',
    }));
  } catch (error) {
    return res.redirect(res.locals.buildAdminUrl('', {
      error: error.message || 'ไม่สามารถลบผู้เรียนได้',
    }));
  }
});

router.post('/:id/reset-password', (req, res) => {
  try {
    const { student, newPassword } = StudentRepository.resetPassword(req.params.id);
    const studentName = `${student.firstName} ${student.lastName}`;

    return res.redirect(res.locals.buildAdminUrl('', {
      notice: `รีเซ็ตรหัสผ่านสำหรับ ${studentName} สำเร็จ รหัสผ่านใหม่: ${newPassword}`,
    }));
  } catch (error) {
    return res.redirect(res.locals.buildAdminUrl('', {
      error: error.message || 'ไม่สามารถรีเซ็ตรหัสผ่านได้',
    }));
  }
});

router.get('/export', (req, res) => {
  const searchTerm = (req.query.q || '').trim();
  const statusQuery = (req.query.status || 'all').trim();
  const examStatus = isValidStatus(statusQuery) ? statusQuery : 'all';

  const { data: students } = StudentRepository.listAll({
    searchTerm,
    examStatus,
  });

  const rows = [
    ['รหัสผู้เรียน', 'ชื่อ', 'นามสกุล', 'อีเมล', 'สถานะการสอบ', 'สร้างเมื่อ', 'อัปเดตล่าสุด', 'รีเซ็ตรหัสผ่านล่าสุด'],
    ...students.map((student) => [
      student.id,
      student.firstName,
      student.lastName,
      student.email,
      res.locals.examStatusLabels[student.examStatus] || student.examStatus,
      res.locals.formatDateTime(student.createdAt),
      res.locals.formatDateTime(student.updatedAt),
      student.lastPasswordResetAt ? res.locals.formatDateTime(student.lastPasswordResetAt) : '-',
    ]),
  ];

  const csvContent = rows.map((row) => row.map(escapeCsv).join(',')).join('\n');
  const timestamp = new Date().toISOString().split('T')[0];

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="students-${timestamp}.csv"`);
  return res.send(`\uFEFF${csvContent}`);
});

module.exports = router;
