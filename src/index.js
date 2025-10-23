import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import PDFDocument from 'pdfkit';

import {
  learnerData,
  getLearnerSummary,
  getTestHistory,
  getTestById,
  getRecommendations
} from './data/learnerData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/learner-dashboard', (req, res) => {
  res.json({
    summary: getLearnerSummary(),
    recommendations: getRecommendations(),
    testHistory: getTestHistory()
  });
});

app.get('/api/learner-dashboard/summary', (req, res) => {
  res.json(getLearnerSummary());
});

app.get('/api/learner-dashboard/tests', (req, res) => {
  res.json(getTestHistory());
});

app.get('/api/learner-dashboard/recommendations', (req, res) => {
  res.json(getRecommendations());
});

app.get('/api/download-result/:testId', (req, res) => {
  const { testId } = req.params;
  const test = getTestById(testId);

  if (!test || !test.hasPdf) {
    return res.status(404).json({ message: 'ไม่พบไฟล์ผลการทดสอบ' });
  }

  const fileName = `result-${test.courseId}-${test.testName.replace(/\s+/g, '-').toLowerCase()}.pdf`;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(res);

  doc.fontSize(18).text('รายงานผลการทดสอบ', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).text(`ชื่อผู้เรียน: ${learnerData.name}`);
  doc.text(`อีเมล: ${learnerData.email}`);
  doc.text(`ระบบรายงานผลการทดสอบ: e-Learning by pom`);
  doc.moveDown();

  doc.fontSize(14).text(`วิชา: ${test.courseName}`);
  doc.fontSize(12);
  doc.text(`ชื่อแบบทดสอบ: ${test.testName}`);
  doc.text(`วันที่ทำแบบทดสอบ: ${new Date(test.date).toLocaleDateString('th-TH')}`);
  doc.text(`ระยะเวลา: ${test.duration} นาที`);
  doc.moveDown();

  doc.text(`คะแนนที่ได้: ${test.score} / ${test.maxScore}`);
  doc.text(`เกณฑ์ผ่าน: ${test.passingScore} คะแนน`);
  doc.text(`สถานะ: ${test.passed ? 'ผ่าน' : 'ไม่ผ่าน'}`);
  doc.moveDown();

  if (!test.passed) {
    doc.fillColor('red').text('คำแนะนำ: กรุณาทบทวนเนื้อหาก่อนทำแบบทดสอบอีกครั้ง');
    doc.fillColor('black');
  } else {
    doc.fillColor('green').text('คำแนะนำ: ยอดเยี่ยม! ลองเรียนคอร์สในระดับถัดไปเพื่อพัฒนาต่อยอด');
    doc.fillColor('black');
  }

  doc.moveDown();
  doc.text('ระบบสร้างรายงานอัตโนมัติ', { align: 'right' });
  doc.text(new Date().toLocaleString('th-TH'), { align: 'right' });

  doc.end();
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
