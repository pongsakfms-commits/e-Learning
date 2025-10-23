# E-Learning Admin - จัดการข้อมูลคะแนนสอบ

ระบบจัดการคะแนนสอบสำหรับแอดมิน (Admin Score Management System) สำหรับระบบ e-Learning

## คุณสมบัติหลัก (Features)

### ✅ ภาพรวมคะแนนสอบ (Scores Overview)
- แสดงผลคะแนนทั้งหมดในรูปแบบตาราง
- ค้นหาและกรองตาม:
  - ผู้เรียน (Student)
  - แบบทดสอบ (Quiz)
  - ช่วงเวลา (Date Range)
  - คำค้นหาจากชื่อ/อีเมล (Search Text)
- แสดงข้อมูลสรุปพร้อมคะแนนเปอร์เซ็นต์

### ✅ รายละเอียดการทำแบบทดสอบ (Attempt Details)
- แสดงข้อมูลผู้เรียนและแบบทดสอบ
- แสดงคำตอบของผู้เรียนและคำตอบที่ถูกต้อง
- แสดงคะแนนในแต่ละข้อ
- สามารถดูว่าตอบถูกหรือผิด

### ✅ ปรับแก้คะแนน (Score Adjustment)
- แก้ไขคะแนนพร้อมระบุเหตุผล
- บันทึกประวัติการแก้ไขทั้งหมด (Audit Log)
- แสดงคะแนนเดิมและคะแนนใหม่

### ✅ บันทึกหมายเหตุ (Notes/Comments)
- เพิ่มหมายเหตุสำหรับการทำแบบทดสอบ
- แสดงหมายเหตุล่าสุดในหน้าภาพรวม
- บันทึกประวัติทั้งหมดใน Audit Log

### ✅ ดาวน์โหลดรายงาน (Report Download)
- ดาวน์โหลดรายงานคะแนนต่อผู้เรียนในรูปแบบ CSV
- รองรับการส่งออกข้อมูลเพื่อวิเคราะห์เพิ่มเติม

## โครงสร้างโปรเจค (Project Structure)

```
/home/engine/project/
├── backend/          # Backend API (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── db/      # Database setup and migrations
│   │   ├── routes/  # API routes
│   │   └── index.ts # Main server file
│   └── package.json
├── frontend/         # Frontend UI (React + TypeScript + Vite)
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
└── README.md
```

## เทคโนโลยีที่ใช้ (Tech Stack)

### Backend
- **Node.js** + **Express** - Server framework
- **TypeScript** - Type safety
- **Better-SQLite3** - Embedded database
- **Zod** - Schema validation

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Routing
- **date-fns** - Date formatting

## การติดตั้งและรัน (Installation & Running)

### 1. ติดตั้ง Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. สร้างฐานข้อมูลและข้อมูลตัวอย่าง

```bash
cd backend
npm run db:seed
```

### 3. รันโปรเจค

เปิด 2 terminals:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Server จะรันที่ http://localhost:4000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend จะรันที่ http://localhost:5173

### 4. เข้าใช้งาน

เปิดเบราว์เซอร์ไปที่: **http://localhost:5173**

## API Endpoints

### GET `/api/admin/attempts`
ดึงข้อมูลการทำแบบทดสอบทั้งหมด
- Query parameters: `studentId`, `quizId`, `startDate`, `endDate`, `search`

### GET `/api/admin/attempts/:id`
ดึงรายละเอียดการทำแบบทดสอบ

### PATCH `/api/admin/attempts/:id/score`
อัพเดทคะแนน
- Body: `{ score: number, note?: string }`

### POST `/api/admin/attempts/:id/note`
เพิ่มหมายเหตุ
- Body: `{ note: string }`

### GET `/api/admin/students`
ดึงรายชื่อผู้เรียนทั้งหมด

### GET `/api/admin/quizzes`
ดึงรายการแบบทดสอบทั้งหมด

### GET `/api/admin/report/:studentId`
ดึงรายงานคะแนนของผู้เรียน (JSON)

### GET `/api/admin/report/:studentId/export`
ดาวน์โหลดรายงานคะแนนเป็น CSV

## ฐานข้อมูล (Database Schema)

### Tables:
- **students** - ข้อมูลผู้เรียน
- **quizzes** - ข้อมูลแบบทดสอบ
- **attempts** - ข้อมูลการทำแบบทดสอบ
- **attempt_answers** - คำตอบของแต่ละข้อ
- **audit_logs** - ประวัติการแก้ไขและหมายเหตุ

## การพัฒนาต่อ (Future Development)

- เพิ่มระบบ Authentication/Authorization
- เพิ่มการแจ้งเตือนผู้เรียนเมื่อคะแนนถูกแก้ไข
- เพิ่มฟังก์ชัน Export เป็น PDF
- เพิ่ม Dashboard แสดงสถิติคะแนนรวม
- เพิ่มการ Filter ขั้นสูงและการ Sort
- เพิ่มการแสดงผลแบบกราฟ

## License

MIT
