const { body } = require('express-validator');
const StudentRepository = require('../lib/studentRepository');

const examStatusValues = StudentRepository.getExamStatuses().map((status) => status.value);

const createStudentRules = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('กรุณากรอกชื่อ'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('กรุณากรอกนามสกุล'),
  body('email')
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage('รูปแบบอีเมลไม่ถูกต้อง')
    .bail()
    .custom((value) => {
      if (StudentRepository.emailExists(value)) {
        throw new Error('อีเมลนี้ถูกใช้งานแล้ว');
      }

      return true;
    }),
  body('examStatus')
    .isIn(examStatusValues)
    .withMessage('สถานะการสอบไม่ถูกต้อง'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('ยืนยันรหัสผ่านไม่ตรงกับรหัสผ่าน');
      }

      return true;
    }),
];

const updateStudentRules = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('กรุณากรอกชื่อ'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('กรุณากรอกนามสกุล'),
  body('email')
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage('รูปแบบอีเมลไม่ถูกต้อง')
    .bail()
    .custom((value, { req }) => {
      if (StudentRepository.emailExists(value, req.params.id)) {
        throw new Error('อีเมลนี้ถูกใช้งานแล้ว');
      }

      return true;
    }),
  body('examStatus')
    .isIn(examStatusValues)
    .withMessage('สถานะการสอบไม่ถูกต้อง'),
];

module.exports = {
  createStudentRules,
  updateStudentRules,
};
