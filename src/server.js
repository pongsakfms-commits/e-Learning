const path = require('path');
const express = require('express');
const methodOverride = require('method-override');
const adminPolicy = require('./middleware/adminPolicy');
const studentsRouter = require('./routes/students');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.use((req, res, next) => {
  res.locals.appName = 'e-Learning Admin';
  next();
});

app.get('/', (req, res) => {
  const adminToken = process.env.ADMIN_TOKEN || adminPolicy.ADMIN_TOKEN;
  const params = new URLSearchParams({ adminToken });
  res.redirect(`/admin/students?${params.toString()}`);
});

app.use('/admin/students', adminPolicy, studentsRouter);

app.use((req, res) => {
  res.status(404).render('not-found', {
    pageTitle: 'ไม่พบหน้า',
    message: 'ไม่พบหน้าที่คุณต้องการเข้าถึง',
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('error', {
    pageTitle: 'เกิดข้อผิดพลาด',
    message: 'ไม่สามารถประมวลผลคำขอได้ กรุณาลองใหม่อีกครั้ง',
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
