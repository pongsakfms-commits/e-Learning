# e-Learning Dashboard
**e-Learning by pom** - ระบบแดชบอร์ดผู้เรียนสำหรับตรวจสอบคะแนนและความคืบหน้า

## ฟีเจอร์หลัก

### 1. ภาพรวมแดชบอร์ด (Dashboard Overview)
- แสดงสรุปคอร์สที่กำลังเรียนทั้งหมด
- สถิติการทำข้อสอบ (จำนวนทั้งหมด, ผ่าน, ไม่ผ่าน)
- คะแนนล่าสุดและคะแนนเฉลี่ย
- แบบทดสอบล่าสุด 3 รายการ

### 2. รายการคอร์ส (Courses)
- แสดงคอร์สที่กำลังเรียนและเรียนจบ
- แสดงความคืบหน้าแต่ละคอร์สด้วย Progress Bar
- กรองคอร์สตามสถานะ (ทั้งหมด, กำลังเรียน, เรียนจบ)
- ข้อมูลอาจารย์ผู้สอนและวันที่ลงทะเบียน

### 3. คำแนะนำและเกณฑ์ผ่าน (Recommendations & Pass Criteria)
- **เกณฑ์ผ่านมาตรฐาน**: คะแนนขั้นต่ำ 60 คะแนน
- **ความคืบหน้าแนะนำ**: ≥ 70% สำหรับการเรียนรู้ต่อเนื่อง
- ระบบวิเคราะห์และแนะนำตามผลการเรียน:
  - **สำคัญมาก (High Priority)**: แบบทดสอบที่ไม่ผ่าน ต้องทบทวนเนื้อหา
  - **ปานกลาง (Medium Priority)**: คอร์สที่ความคืบหน้าน้อยกว่า 50%
  - **แนะนำ (Low Priority)**: คำแนะนำสำหรับผู้เรียนที่มีคะแนนดี

### 4. ประวัติการทำแบบทดสอบ (Test History)
- แสดงประวัติทั้งหมดในรูปแบบตาราง
- ข้อมูลครบถ้วน: วันที่, วิชา, ชื่อแบบทดสอบ, คะแนน, สถานะ
- กรองตามสถานะ (ทั้งหมด, ผ่าน, ไม่ผ่าน)
- **ดาวน์โหลดผลการทดสอบเป็น PDF** พร้อมรายละเอียด

### 5. Navigation ที่ใช้งานง่าย
- Navigation Bar ด้านบน: ภาพรวม, คอร์ส, คำแนะนำ, ประวัติแบบทดสอบ
- Quick Actions ด้านข้าง: ปุ่มด่วนสำหรับเข้าถึงฟีเจอร์หลัก
- Smooth scrolling เมื่อคลิกเมนู

## เทคโนโลยีที่ใช้

- **Backend**: Node.js + Express
- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Variables
- **PDF Generation**: PDFKit
- **Font**: Sarabun (Thai font from Google Fonts)

## การติดตั้งและรันโปรเจค

### ข้อกำหนดเบื้องต้น
- Node.js เวอร์ชัน 16 หรือสูงกว่า
- npm หรือ yarn

### ขั้นตอนการติดตั้ง

1. Clone repository
```bash
git clone <repository-url>
cd e-Learning-pom
```

2. ติดตั้ง dependencies
```bash
npm install
```

3. รันเซิร์ฟเวอร์
```bash
npm start
```

หรือรันในโหมด development (auto-reload)
```bash
npm run dev
```

4. เปิดเบราว์เซอร์ที่
```
http://localhost:3000
```

## โครงสร้างโปรเจค

```
e-Learning-pom/
├── src/
│   ├── index.js              # Express server และ API endpoints
│   └── data/
│       └── learnerData.js    # Mock data และ business logic
├── public/
│   ├── index.html            # หน้า HTML หลัก
│   ├── scripts/
│   │   └── app.js            # JavaScript สำหรับ frontend
│   └── styles/
│       └── main.css          # CSS styles
├── package.json
├── .gitignore
└── README.md
```

## API Endpoints

### GET `/api/learner-dashboard`
ดึงข้อมูลแดชบอร์ดทั้งหมด (summary, recommendations, testHistory)

**Response:**
```json
{
  "summary": {
    "learner": { "id": "L001", "name": "...", "email": "..." },
    "summary": { "totalCourses": 3, "completedCourses": 1, ... },
    "courses": [...],
    "recentTests": [...]
  },
  "recommendations": [...],
  "testHistory": [...]
}
```

### GET `/api/learner-dashboard/summary`
ดึงเฉพาะข้อมูลสรุป

### GET `/api/learner-dashboard/tests`
ดึงประวัติการทำแบบทดสอบทั้งหมด

### GET `/api/learner-dashboard/recommendations`
ดึงคำแนะนำการเรียน

### GET `/api/download-result/:testId`
ดาวน์โหลดผลการทดสอบเป็น PDF

**Parameters:**
- `testId`: รหัสแบบทดสอบ (เช่น T001, T002)

**Response:**
- Content-Type: `application/pdf`
- ไฟล์ PDF พร้อมรายละเอียดผลการทดสอบ

## การใช้งาน

### สำหรับผู้เรียน
1. เข้าสู่ระบบแล้วจะเห็นภาพรวมคะแนนและความคืบหน้า
2. คลิกเมนู "คอร์ส" เพื่อดูรายละเอียดคอร์สที่กำลังเรียน
3. คลิกเมนู "คำแนะนำ" เพื่อดูคำแนะนำการเรียนที่ระบบวิเคราะห์ให้
4. คลิกเมนู "ประวัติแบบทดสอบ" เพื่อดูผลสอบและดาวน์โหลด PDF
5. ใช้ Quick Actions ด้านข้างเพื่อเข้าถึงฟีเจอร์ด่วน

### การดาวน์โหลด PDF
1. ไปที่หน้า "ประวัติแบบทดสอบ"
2. คลิกปุ่ม "📥 ดาวน์โหลด PDF" ในแถวของแบบทดสอบที่ต้องการ
3. ไฟล์ PDF จะถูกสร้างและดาวน์โหลดอัตโนมัติ

## ข้อมูลตัวอย่าง (Mock Data)

ระบบใช้ข้อมูลตัวอย่างที่อยู่ใน `src/data/learnerData.js`:
- ผู้เรียน: สมชาย มั่นคง
- คอร์ส: 3 คอร์ส (JavaScript, Web Development, Database Design)
- แบบทดสอบ: 4 แบบทดสอบที่มีทั้งผ่านและไม่ผ่าน

## การพัฒนาต่อ

### เชื่อมต่อกับฐานข้อมูลจริง
แก้ไขไฟล์ `src/data/learnerData.js` เพื่อเชื่อมต่อกับ:
- PostgreSQL, MySQL, MongoDB
- Firebase, Supabase
- หรือ REST API อื่นๆ

### เพิ่มฟีเจอร์
- Authentication & Authorization
- Real-time notifications
- Quiz taking interface
- Course content viewer
- Discussion forum
- Certificate generation

### Responsive Design
ระบบรองรับการแสดงผลบนหน้าจอขนาดต่างๆ:
- Desktop (> 1024px)
- Tablet (768px - 1024px)
- Mobile (< 768px)

## License

ISC

## ผู้พัฒนา

**pom** - e-Learning Platform Developer

---

สร้างด้วย ❤️ สำหรับระบบการศึกษาออนไลน์
