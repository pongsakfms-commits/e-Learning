# e-Learning Platform by Pom

## ภาพรวม
แพลตฟอร์ม e-Learning นี้ออกแบบมาสำหรับสถาบันการศึกษาและองค์กรที่ต้องการเผยแพร่หลักสูตรออนไลน์ พร้อมระบบจัดการผู้เรียนและผู้ดูแล ระบบรองรับการนำเข้าข้อมูลผู้เรียนผ่านไฟล์ CSV เชื่อมต่อกับ Google API สำหรับการดึง/บันทึกข้อมูลบน Google Drive และสามารถออกรายงานเป็นไฟล์ PDF ได้ทั้งสำหรับผู้เรียนและผู้ดูแลระบบ (Admin).

## คุณสมบัติหลัก
- จัดการหลักสูตร เนื้อหา บทเรียน และสื่อเสริมได้จากศูนย์กลาง
- ระบบบทบาท (Role) แยกผู้เรียน (Learner) และผู้ดูแลระบบ (Admin)
- ลงทะเบียน/นำเข้าผู้เรียนผ่าน CSV พร้อมตรวจสอบความถูกต้องอัตโนมัติ
- เชื่อมต่อ Google API (เช่น Google Drive, Google Classroom หรือ Google Sheets) เพื่อซิงก์เอกสาร
- ออกรายงาน PDF (ผลการเรียน ใบเสร็จ ใบรับรอง) พร้อมเทมเพลตปรับแต่งได้
- รองรับการสำรองข้อมูลทั้งตัวโค้ด ไฟล์อัปโหลด และฐานข้อมูล

## โครงสร้างโดยสังเขป (แนะนำ)
```
project-root/
├── api/                 # โค้ดฝั่งเซิร์ฟเวอร์ (Node.js + Express/NestJS)
├── web/                 # โค้ดฝั่งเว็บ (React/Vue)
├── prisma/              # สคีมาฐานข้อมูล (ถ้าใช้ Prisma)
├── scripts/             # สคริปต์ช่วยเหลือ (import/export, seed, backup)
├── storage/             # ไฟล์อัปโหลด/ไฟล์ PDF ที่สร้างจากระบบ
├── docs/                # เอกสารเพิ่มเติม (เช่น เทมเพลต CSV, คู่มือ)
└── .env                 # ค่าคอนฟิกเฉพาะสภาพแวดล้อม
```
> หมายเหตุ: โปรเจกต์จริงอาจจัดโครงสร้างต่างออกไป แต่ข้างต้นคือโครงสร้างแนะนำที่ใช้ในเอกสารนี้

## ข้อกำหนดระบบ (Minimum Requirements)
- **Node.js** v18 LTS ขึ้นไป และ **npm** หรือ **yarn**
- **PostgreSQL** v14 ขึ้นไป
- **Google Cloud Project** ที่เปิดใช้ Google Drive API (และ API อื่นที่ต้องการ)
- **wkhtmltopdf** หรือ **Chromium** (กรณีใช้ headless browser สร้าง PDF)
- **Git** สำหรับจัดการซอร์สโค้ด
- ระบบปฏิบัติการ: Linux, macOS หรือ Windows 11 WSL2

## การติดตั้งและตั้งค่า (Installation & Configuration)
> **หมายเหตุ:** คำสั่งตัวอย่างด้านล่างเป็นแนวทางมาตรฐาน คุณสามารถเลือกทำเฉพาะรายการที่ตรงกับสภาพแวดล้อมของคุณได้ โดยขั้นตอนที่จำเป็นจริงๆ สรุปไว้ในหัวข้อ [Checklist การเตรียมระบบก่อนใช้งาน](#checklist-การเตรียมระบบก่อนใช้งาน)
### 1. เตรียมเครื่องมือพื้นฐาน
```bash
# ติดตั้ง Node.js (แนะนำผ่าน nvm)
nvm install 18
nvm use 18

# ติดตั้ง PostgreSQL
# macOS (Homebrew)
brew install postgresql@14
# Ubuntu
sudo apt update && sudo apt install postgresql postgresql-contrib
```

### 2. Clone โปรเจกต์
```bash
git clone <repository-url>
cd e-Learning
```

### 3. ติดตั้ง Dependencies
```bash
# ฝั่งเซิร์ฟเวอร์
cd api
npm install

# ฝั่งเว็บ (ถ้ามี)
cd ../web
npm install
```

### 4. ตั้งค่าไฟล์ Environment
คัดลอก `.env.example` ไปเป็น `.env` แล้วแก้ไขข้อมูลให้ถูกต้อง (ถ้าไม่มีไฟล์ example ให้สร้างใหม่)

ตัวอย่างตัวแปรสำคัญ:

| ตัวแปร | ตัวอย่างค่า | คำอธิบาย |
| --- | --- | --- |
| `APP_PORT` | `3000` | พอร์ตที่เซิร์ฟเวอร์ทำงาน |
| `APP_URL` | `https://elearning.example.com` | URL ฐานของระบบ |
| `DATABASE_URL` | `postgresql://user:pass@localhost:5432/elearning` | เชื่อมต่อฐานข้อมูล |
| `GOOGLE_PROJECT_ID` | `elearning-prod-12345` | รหัสโปรเจกต์บน Google Cloud |
| `GOOGLE_CLIENT_EMAIL` | `service-account@elearning.iam.gserviceaccount.com` | อีเมล Service Account |
| `GOOGLE_PRIVATE_KEY` | `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n` | กุญแจส่วนตัว (ต้อง escape line break) |
| `GOOGLE_DRIVE_FOLDER_ID` | `1AbCdEfGhIjklmn` | โฟลเดอร์ปลายทางบน Google Drive |
| `CSV_UPLOAD_PATH` | `./storage/uploads/csv` | ที่เก็บไฟล์ CSV ชั่วคราว |
| `PDF_OUTPUT_PATH` | `./storage/exports/pdf` | ที่จัดเก็บไฟล์ PDF ที่สร้าง |
| `JWT_SECRET` | สตริงสุ่ม | ใช้เซ็นข้อมูล JWT |
| `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` | ข้อมูล SMTP | ส่งอีเมลแจ้งเตือน |

### 5. ตั้งค่าฐานข้อมูล
1. สร้างฐานข้อมูลว่าง
   ```bash
   createdb elearning
   ```
2. รันคำสั่ง migration และ seed (หากมีสคริปต์)
   ```bash
   cd api
   npm run migrate
   npm run seed
   ```
3. ตรวจสอบการเชื่อมต่อโดยรัน `npm run db:status`

### 6. ตั้งค่า Google API
1. เข้า [Google Cloud Console](https://console.cloud.google.com/)
2. สร้างโปรเจกต์ใหม่หรือใช้โปรเจกต์เดิม
3. เปิดใช้ API ที่ต้องการ (เช่น Google Drive API, Google Sheets API)
4. ไปที่ **APIs & Services > Credentials** สร้าง **Service Account**
5. ดาวน์โหลดไฟล์ JSON แล้วนำค่ามาใส่ใน `.env`
6. แชร์โฟลเดอร์ Google Drive ปลายทางให้ Service Account มีสิทธิ์ `Editor`
7. ทดสอบเชื่อมต่อด้วยคำสั่ง
   ```bash
   npm run google:test
   ```

### 7. การตั้งค่าการนำเข้า CSV
- เก็บไฟล์เทมเพลต CSV ไว้ใน `docs/templates/learner-import.csv`
- คอลัมน์ที่ระบบรองรับ เช่น:
  | column | required | ตัวอย่าง |
  | --- | --- | --- |
  | `student_id` | ✅ | `STU001` |
  | `first_name` | ✅ | `Somchai` |
  | `last_name` | ✅ | `Sukjai` |
  | `email` | ✅ | `somchai@example.com` |
  | `course_code` | ✅ | `COURSE-INTRO` |
  | `enrolled_at` | ❌ | `2024-01-15` |
- CSV ต้องเป็น UTF-8 และมี header row
- ใช้คำสั่ง
  ```bash
  npm run csv:validate ./storage/uploads/csv/learner-import.csv
  npm run csv:import ./storage/uploads/csv/learner-import.csv
  ```

### 8. การตั้งค่าการออก PDF
- ติดตั้ง `wkhtmltopdf` หรือให้ระบบใช้ `puppeteer` + Chromium
  ```bash
  sudo apt install wkhtmltopdf
  ```
- กำหนดเทมเพลต PDF ใน `api/templates/pdf/`
- ปรับตั้งค่าโลโก้และฟ้อนต์ใน `config/pdf.ts`
- ทดสอบคำสั่งสร้าง PDF
  ```bash
  npm run pdf:preview --certificate --user=STU001
  ```

### 9. การรันระบบ
```bash
# รันฝั่ง API
cd api
npm run start:dev

# รันฝั่งเว็บ
cd ../web
npm run dev
```
ระบบจะพร้อมใช้งานที่ `http://localhost:3000` (API) และ `http://localhost:5173` (Front-end)

## Checklist การเตรียมระบบก่อนใช้งาน
### ขั้นตอนบังคับ (ทำทุกครั้งก่อนขึ้นระบบจริง)
- [ ] ติดตั้ง Node.js v18 ขึ้นไป, npm/yarn และ PostgreSQL ให้พร้อมใช้งาน (ดู [ขั้นตอนที่ 1](#1-เตรียมเครื่องมือพื้นฐาน))
- [ ] Clone โปรเจกต์และติดตั้ง dependencies ทั้งฝั่ง API/Web (ดู [ขั้นตอนที่ 2-3](#2-clone-โปรเจกต์))
- [ ] คัดลอกและตั้งค่าไฟล์ `.env` กำหนดตัวแปรสำคัญ เช่น `DATABASE_URL`, คีย์ Google, SMTP (ดู [ขั้นตอนที่ 4](#4-ตั้งค่าไฟล์-environment))
- [ ] สร้างฐานข้อมูล, รัน migration/seed และตรวจสอบสถานะ (ดู [ขั้นตอนที่ 5](#5-ตั้งค่าฐานข้อมูล))
- [ ] สตาร์ทเซิร์ฟเวอร์ API/Web เพื่อตรวจสอบการทำงาน (ดู [ขั้นตอนที่ 9](#9-การรันระบบ))

### ขั้นตอนเพิ่มเติมตามฟีเจอร์ที่ต้องใช้
- [ ] ตั้งค่า Google API และทดสอบการเชื่อมต่อ หากต้องการซิงก์กับ Google Drive/Sheets (ดู [ขั้นตอนที่ 6](#6-ตั้งค่า-google-api))
- [ ] เตรียมเทมเพลต CSV และสคริปต์นำเข้า พร้อมทดสอบ flow การ import (ดู [ขั้นตอนที่ 7](#7-การตั้งค่าการนำเข้า-csv))
- [ ] ตั้งค่าเครื่องมือสร้าง PDF และเทมเพลต รวมถึงทดสอบคำสั่ง preview (ดู [ขั้นตอนที่ 8](#8-การตั้งค่าการออก-pdf))
- [ ] กำหนดวิธีสำรองข้อมูลฐานข้อมูล/ไฟล์/credentials ตามคู่มือ (ดู [คู่มือการสำรอง/กู้คืนข้อมูล](#คู่มือการสำรองกู้คืนข้อมูล-backup--restore))

> เคล็ดลับ: หากต้องการเริ่มทดสอบระบบอย่างรวดเร็ว ให้ทำเฉพาะรายการใน "ขั้นตอนบังคับ" ก่อน แล้วค่อยตั้งค่าฟีเจอร์เสริมตามความต้องการ

## Quick Start Guide
### สำหรับผู้เรียน (Learner)
1. รับอีเมลเชิญหรือข้อมูลล็อกอินจากผู้ดูแลระบบ
2. เข้าระบบที่ `APP_URL` และเข้าสู่ระบบ
3. ตรวจสอบหลักสูตรที่ลงทะเบียนไว้ในแดชบอร์ด
4. เรียนเนื้อหา, ทำแบบทดสอบ, อัปโหลดไฟล์งานตามกำหนด
5. ดาวน์โหลดใบรับรองหรือรายงานการเรียนเป็น PDF จากเมนู "รายงานของฉัน"
6. หากมีปัญหา ให้ใช้ปุ่ม "แจ้งปัญหา" หรือส่งอีเมลไปที่ทีมซัพพอร์ต

### สำหรับผู้ดูแลระบบ (Admin)
1. เข้าสู่ระบบด้วยบัญชีผู้ดูแลที่มีสิทธิ์ครบถ้วน
2. ตั้งค่าหลักสูตรใหม่: ชื่อหลักสูตร, คำอธิบาย, โมดูล, ตารางเวลา
3. นำเข้าผู้เรียนจาก CSV หรือสร้างผู้ใช้ใหม่จากฟอร์ม
4. กำหนดผู้สอน/ผู้ช่วย และสิทธิ์ในการเข้าถึงเนื้อหา
5. ติดตามความคืบหน้าของผู้เรียนผ่านแดชบอร์ดและกราฟรายงาน
6. ออกรายงาน PDF หรือส่งออกข้อมูลเป็น CSV ได้จากเมนู "รายงานผู้เรียน"
7. ตั้งค่าอีเมลแจ้งเตือน (เช่น แจ้งงานใหม่, แจ้งผลสอบ) ผ่านโมดูล Notification
8. กำหนดรอบการสำรองข้อมูลอัตโนมัติในเมนู System Settings

## คู่มือการสำรอง/กู้คืนข้อมูล (Backup & Restore)
### 1. สำรองฐานข้อมูล
```bash
# ใช้ pg_dump
pg_dump -Fc -U <db_user> -h <host> elearning > backups/db/elearning_$(date +%F).dump
```
- ตั้ง cron job เช่น `0 2 * * *` ให้สำรองทุกวัน
- ทดสอบไฟล์สำรองด้วย `pg_restore --list`

### 2. สำรองไฟล์โปรเจกต์และไฟล์อัปโหลด
```bash
# สำรองโค้ด + storage เป็นไฟล์ tar.gz
cd /path/to/e-Learning
mkdir -p backups/code

tar -czf backups/code/elearning-src_$(date +%F).tar.gz \
  --exclude="node_modules" \
  --exclude=".git" \
  .

# สำรองเฉพาะไฟล์อัปโหลดและ PDF
mkdir -p backups/storage
tar -czf backups/storage/storage_$(date +%F).tar.gz storage/
```
- เก็บไฟล์สำรองไปยัง external storage หรือ S3/Google Cloud Storage
- ตรวจสอบสิทธิ์การเข้าถึง (ไฟล์สำรองควรเข้ารหัสกรณีมีข้อมูลส่วนบุคคล)

### 3. สำรองค่า Environment และ Credential สำคัญ
- เก็บไฟล์ `.env`, `service-account.json`, SSL certificates ในที่ปลอดภัย เช่น password manager หรือ vault
- บันทึกค่าคอนฟิกระบบ (เช่น domain, SMTP, webhook) ลงเอกสาร `docs/configuration.md`

### 4. ขั้นตอนการกู้คืน (Restore)
1. ดึงซอร์สโค้ดเวอร์ชันล่าสุดหรือไฟล์ tar.gz มาคลายไฟล์
2. คืนค่าฐานข้อมูลด้วย `pg_restore`
   ```bash
   pg_restore -c -U <db_user> -h <host> -d elearning backups/db/elearning_latest.dump
   ```
3. คืนค่าไฟล์อัปโหลด
   ```bash
   tar -xzf backups/storage/storage_latest.tar.gz -C ./
   ```
4. ตรวจสอบไฟล์ `.env` และ Credential
5. รัน migration/seed อีกครั้งหากจำเป็น แล้วสตาร์ทเซิร์ฟเวอร์เพื่อทดสอบ

## การนำเข้า CSV อย่างละเอียด
1. ดาวน์โหลดเทมเพลตล่าสุดจากเมนูผู้ดูแลระบบ หรือจาก `docs/templates`
2. กรอกข้อมูลด้วย Spreadsheet ที่รองรับ UTF-8 (Google Sheets แนะนำ)
3. ตรวจสอบความถูกต้องของข้อมูล (ID ซ้ำ, อีเมลไม่ถูกต้อง, หลักสูตรไม่มี)
4. อัปโหลดผ่านหน้าเว็บ Admin > Data Import หรือวางไฟล์ในโฟลเดอร์ที่กำหนดแล้วรันคำสั่ง CLI
5. ตรวจสอบผลลัพธ์ในหน้า "ประวัติการนำเข้า" (Import Logs)
6. ถ้าพบ Error ให้ดาวน์โหลดไฟล์ Error Report ที่ระบบสร้างให้

## การออกรายงาน PDF
1. ตั้งค่าเทมเพลต HTML/Handlebars ใน `api/templates/pdf`
2. ปรับโลโก้ ฟอนต์ สีหลักใน `config/pdf.ts`
3. เลือกรูปแบบรายงานจากหน้า Admin > Reports (เช่น Transcript, Certificate, Invoice)
4. กำหนดช่วงวันที่หรือกลุ่มผู้เรียนที่ต้องการ
5. กดสร้างรายงาน ระบบจะบันทึกไฟล์ใน `storage/exports/pdf`
6. สามารถตั้งให้ระบบอัปโหลด PDF ไปยัง Google Drive โดยเปิด toggle "Sync to Drive"
7. ใช้ CLI สำหรับรันเป็นชุด (Batch)
   ```bash
   npm run pdf:generate --report=certificate --course=COURSE-INTRO
   ```

## การทดสอบและตรวจสอบระบบ
- `npm run lint` ตรวจสอบโค้ดให้ตรงตามมาตรฐาน
- `npm run test` รันยูนิตเทสต์
- `npm run e2e` รันการทดสอบ End-to-End (ถ้ามี)
- ตรวจสอบ Google API Quota และ Error Log เป็นระยะผ่าน Google Cloud Console

## ช่องทางสนับสนุน
- กรณีระบบล้มเหลว ติดต่อทีม DevOps ผ่าน Slack `#elearning-support`
- แจ้งปัญหา/ฟีเจอร์ใหม่ ผ่าน Jira หรือ GitHub Issues ของโปรเจกต์
- เอกสารเสริม: `docs/faq.md`, `docs/user-guide.pdf` (อัปเดตตามรอบสปรินต์)

## License
สงวนลิขสิทธิ์โดยผู้พัฒนา (Pom) – โปรดตรวจสอบไฟล์ `LICENSE` หากมีการเพิ่มในอนาคต
