# e-Learning Admin Dashboard

ระบบแดชบอร์ดสำหรับแอดมินในการติดตามและวิเคราะห์ผลการเรียนรู้ของผู้เรียน พร้อมตัวชี้วัดเชิงลึกและการแสดงผลด้วยกราฟ

## คุณสมบัติ (Features)

✅ **ตัวชี้วัดเชิงลึก (Deep Metrics)**
- Total learners (จำนวนผู้เรียนทั้งหมด)
- ผู้เรียนที่ทำข้อสอบแล้ว (Completed exams)
- Average, Median, Standard Deviation (ค่าเฉลี่ย, มัธยฐาน, ส่วนเบี่ยงเบนมาตรฐาน)
- Min/Max scores
- Pass Ratio (อัตราการผ่าน)
- Proficiency Levels (ระดับความสามารถ: beginner, intermediate, advanced, expert)

✅ **การแสดงผลด้วยกราฟและแผนภูมิ**
- Bar Chart สำหรับการกระจายคะแนน (Score Distribution)
- Doughnut Chart สำหรับระดับความสามารถ (Proficiency Levels)

✅ **ตัวกรองข้อมูล (Filters)**
- กรองตามช่วงเวลา (วันเริ่มต้น - วันสิ้นสุด)
- กรองตามประเภทแบบทดสอบ (Placement, Quiz, Final, Practice, Assessment)

✅ **Performance Optimization**
- Cache ผลลัพธ์การคำนวณด้วย Node Cache (TTL: 10 นาที)
- Query optimization สำหรับการกรองข้อมูล

## Tech Stack

### Backend
- **Node.js + Express** - REST API
- **TypeScript** - Type safety
- **Node Cache** - In-memory caching
- **date-fns** - Date manipulation

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Chart.js + react-chartjs-2** - Data visualization
- **date-fns** - Date utilities

## โครงสร้างโปรเจกต์

```
e-Learning-pom/
├── backend/                # Backend API
│   ├── src/
│   │   ├── config/        # Cache configuration
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Data models (seed data)
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── types/         # TypeScript types
│   │   ├── utils/         # Utility functions
│   │   └── server.ts      # Entry point
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/              # Frontend application
    ├── src/
    │   ├── components/   # React components
    │   ├── hooks/        # Custom hooks
    │   ├── types/        # TypeScript types
    │   ├── utils/        # Utility functions
    │   ├── App.tsx       # Main component
    │   ├── main.tsx      # Entry point
    │   └── styles.css    # Styling
    ├── index.html
    ├── package.json
    └── vite.config.ts
```

## การติดตั้ง (Installation)

### 1. ติดตั้ง Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 2. รันแอปพลิเคชัน

#### Backend (Port 3000)
```bash
cd backend
npm run dev
```

#### Frontend (Port 5173)
```bash
cd frontend
npm run dev
```

### 3. เปิดเบราว์เซอร์
```
http://localhost:5173
```

## API Endpoints

### GET `/api/admin/dashboard/overview`

ดึงข้อมูลแดชบอร์ดภาพรวมสำหรับแอดมิน

**Query Parameters:**
- `startDate` (optional): วันที่เริ่มต้น (ISO 8601 format)
- `endDate` (optional): วันที่สิ้นสุด (ISO 8601 format)
- `examType` (optional): ประเภทแบบทดสอบ (placement, quiz, final, practice, assessment)

**ตัวอย่าง:**
```bash
curl "http://localhost:3000/api/admin/dashboard/overview?startDate=2024-01-01&examType=quiz"
```

**Response:**
```json
{
  "filterSummary": {
    "startDate": "2024-01-01",
    "examType": "quiz",
    "totalRecords": 5
  },
  "totals": {
    "totalLearners": 18,
    "filteredLearners": 5,
    "learnersCompletedExam": 5,
    "attempts": 5
  },
  "scores": {
    "average": 80.6,
    "median": 85,
    "standardDeviation": 12.32,
    "min": 63,
    "max": 94
  },
  "passRatio": 1.0,
  "proficiencyLevels": {
    "intermediate": 2,
    "advanced": 2,
    "expert": 1
  },
  "scoreDistribution": [
    { "label": "0-20", "range": [0, 20], "count": 0 },
    { "label": "21-40", "range": [21, 40], "count": 0 },
    { "label": "41-60", "range": [41, 60], "count": 0 },
    { "label": "61-80", "range": [61, 80], "count": 2 },
    { "label": "81-90", "range": [81, 90], "count": 2 },
    { "label": "91-100", "range": [91, 100], "count": 1 }
  ]
}
```

## สิ่งที่พัฒนาตาม Requirements

### ✅ 1. คำนวณตัวชี้วัดตาม requirement
- **Total learners**: นับจำนวนผู้เรียนทั้งหมดที่มีในระบบ
- **ผู้เรียนที่ทำข้อสอบแล้ว**: นับจำนวนผู้เรียนที่มีผลสอบหลังกรอง
- **Average**: คำนวณค่าเฉลี่ยคะแนน
- **Median**: คำนวณค่ามัธยฐานคะแนน
- **Standard Deviation**: คำนวณส่วนเบี่ยงเบนมาตรฐาน
- **Min/Max**: หาคะแนนต่ำสุดและสูงสุด
- **Pass Ratio**: คำนวณอัตราส่วนการผ่านข้อสอบ
- **Proficiency Levels**: จัดกลุ่มผู้เรียนตามระดับความสามารถ

### ✅ 2. แสดงผลด้วยกราฟ/แผนภูมิ (Chart.js)
- **Bar Chart**: แสดงการกระจายคะแนน (Score Distribution)
- **Doughnut Chart**: แสดงสัดส่วนระดับความสามารถ (Proficiency Distribution)

### ✅ 3. เพิ่มตัวกรองช่วงเวลา/ประเภทแบบทดสอบ
- กรองตามวันที่เริ่มต้น (startDate)
- กรองตามวันที่สิ้นสุด (endDate)
- กรองตามประเภทแบบทดสอบ (examType)

### ✅ 4. ปรับปรุง performance ของ query และ cache
- **Cache Layer**: ใช้ Node Cache เพื่อเก็บผลลัพธ์การคำนวณ (TTL: 10 นาที)
- **Optimized Filtering**: กรองข้อมูลอย่างมีประสิทธิภาพด้วย date-fns
- **Cache Key Generation**: สร้าง cache key จากตัวกรองเพื่อแยก cache แต่ละ query

## Data Model

ข้อมูลตัวอย่าง (Seed Data) อยู่ใน `backend/src/models/examResults.ts`:
- 20 exam attempts
- 18 unique learners
- หลายประเภทแบบทดสอบ (placement, quiz, final, practice, assessment)
- ช่วงเวลาตั้งแต่ 2024-01 ถึง 2024-09

## การพัฒนาต่อ

### เชื่อมต่อกับฐานข้อมูลจริง
ปัจจุบันใช้ seed data ใน memory เมื่อต้องการเชื่อมต่อกับฐานข้อมูลจริง:
1. เพิ่ม PostgreSQL/MongoDB
2. แก้ไข `backend/src/models/examResults.ts` ให้ query จาก database
3. เพิ่ม connection pooling และ database migrations

### เพิ่ม Redis สำหรับ Distributed Cache
เมื่อ scale application:
1. แทนที่ Node Cache ด้วย Redis
2. ใช้ Redis for distributed caching across multiple instances

### เพิ่ม Authentication & Authorization
1. เพิ่ม JWT authentication
2. ใช้ role-based access control (RBAC)

## License
MIT
