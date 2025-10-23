# เอกสารระบบทำแบบทดสอบ

## ภาพรวม

ระบบทำแบบทดสอบออนไลน์ที่รองรับการทำข้อสอบหลายประเภท มีระบบคำนวณคะแนนอัตโนมัติ และสามารถสร้างรายงานเชิงลึกได้

## คุณสมบัติหลัก

### 1. Workflow การทำแบบทดสอบ

ระบบมี 4 ขั้นตอนหลัก:

1. **เริ่มทำข้อสอบ** (`start_quiz`)
   - สร้าง attempt ใหม่สำหรับผู้ใช้
   - ตรวจสอบจำนวนครั้งที่ทำได้สูงสุด
   - บันทึกเวลาเริ่มต้น

2. **ทำข้อสอบ** (`record_answer`)
   - บันทึกคำตอบของแต่ละข้อ
   - สามารถแก้ไขคำตอบได้ก่อนส่ง
   - รองรับการบันทึกคำตอบแบบทีละข้อ

3. **ส่งข้อสอบ** (`submit_quiz`)
   - ตรวจและให้คะแนนอัตโนมัติ
   - คำนวณผลสอบผ่าน/ไม่ผ่าน
   - บันทึกเวลาที่ส่ง
   - ล็อกข้อมูลไม่ให้แก้ไขได้

4. **สรุปผล** (`get_attempt_summary`)
   - แสดงคะแนนรวมและเปอร์เซ็นต์
   - แสดงเฉลยพร้อมคำอธิบาย
   - บอกข้อที่ถูก/ผิด

### 2. ประเภทคำถามที่รองรับ

#### Multiple Choice (เลือกตอบ)
```python
MultipleChoiceQuestion(
    id="q1",
    question_text="ภาษาใดใช้สำหรับ Data Science?",
    options=["Java", "Python", "C++", "Go"],
    correct_answer=1,  # ตัวเลือกที่ 1 คือ Python
    points=5,
)
```

#### True/False (ถูก/ผิด)
```python
TrueFalseQuestion(
    id="q2",
    question_text="โลกเป็นดาวเคราะห์",
    correct_answer=True,
    points=2,
)
```

#### Matching (จับคู่)
```python
MatchingQuestion(
    id="q3",
    question_text="จับคู่ประเทศกับเมืองหลวง",
    pairs=[
        MatchingPair("ไทย", "กรุงเทพฯ"),
        MatchingPair("ญี่ปุ่น", "โตเกียว"),
        MatchingPair("ฝรั่งเศส", "ปารีส"),
    ],
    points=3,
)
```

### 3. ระบบคำนวณคะแนน

- **คะแนนรวม**: รวมคะแนนจากทุกข้อที่ตอบถูก
- **คะแนนผ่าน**: กำหนดเป็นเปอร์เซ็นต์ (เช่น 70%)
- **ผล Pass/Fail**: ระบบจะคำนวณอัตโนมัติว่าผ่านหรือไม่ผ่าน

```python
quiz = Quiz(
    id="quiz-001",
    title="แบบทดสอบทั่วไป",
    passing_score=70.0,  # ต้องได้ 70% ขึ้นไปถึงจะผ่าน
    max_attempts=3,      # ทำได้สูงสุด 3 ครั้ง
    questions=[...],
)
```

### 4. การป้องกันข้อมูลซ้ำซ้อน

ระบบมีกระบวนการ deduplication เพื่อป้องกันข้อมูลซ้ำ:

- ใช้ `attempt_id` เป็น unique identifier
- เมื่อบันทึกข้อมูล จะตรวจสอบและเก็บเฉพาะเวอร์ชั่นล่าสุด
- เปรียบเทียบจาก `submitted_at` หรือ `started_at`

### 5. ระบบรายงาน

#### รายงานระดับแบบทดสอบ
```python
stats = report.get_quiz_statistics(quiz_id="quiz-001")
# ผลลัพธ์:
# {
#   "total_attempts": 10,
#   "completed_attempts": 8,
#   "pass_count": 6,
#   "fail_count": 2,
#   "pass_rate": 75.0,
#   "average_score": 8.5,
#   "highest_score": 10.0,
#   "lowest_score": 5.0
# }
```

#### รายงานระดับผู้ใช้
```python
user_stats = report.get_user_performance(
    user_id="student-123",
    quiz_id="quiz-001"
)
# ผลลัพธ์:
# {
#   "total_attempts": 2,
#   "completed_attempts": 2,
#   "pass_count": 1,
#   "best_score": 9.0,
#   "recent_attempts": [...]
# }
```

#### วิเคราะห์ความยากของข้อสอบ
```python
analytics = report.get_question_analytics(quiz)
# ผลลัพธ์:
# {
#   "q1": {
#     "total_attempts": 10,
#     "correct_count": 8,
#     "incorrect_count": 2,
#     "accuracy_rate": 80.0
#   }
# }
```

## สถาปัตยกรรม

### โครงสร้างไฟล์

```
quiz_system/
├── __init__.py        # Package exports
├── models.py          # คำจำกัดความของ Quiz และ Question
├── attempts.py        # QuizAttempt และ AnswerRecord
├── engine.py          # Business logic หลัก
├── repository.py      # การจัดเก็บข้อมูล
└── reporting.py       # การสร้างรายงาน

tests/
├── test_models.py     # ทดสอบ Question types
└── test_quiz_engine.py # ทดสอบ workflow
```

### Data Flow

```
ผู้ใช้ → QuizEngine → Repository → JSON File
  ↓         ↓            ↓            ↓
เริ่มทำ   start_quiz   save_attempt  attempts.json
ตอบคำถาม  record_answer save_attempt  attempts.json
ส่งข้อสอบ submit_quiz   save_attempt  attempts.json
```

### การจัดเก็บข้อมูล (JSON)

ระบบใช้ JSON เพื่อ:
- อ่านง่าย สามารถตรวจสอบด้วยตาได้
- รองรับการสร้างรายงานภายหลัง
- ง่ายต่อการ backup
- สามารถย้ายไปใช้ database ได้ในภายหลัง

ตัวอย่างข้อมูลที่บันทึก:
```json
[
  {
    "attempt_id": "uuid-1",
    "quiz_id": "quiz-001",
    "user_id": "student-123",
    "status": "submitted",
    "score": 9.0,
    "max_score": 10.0,
    "passed": true,
    "started_at": "2025-01-15T10:00:00Z",
    "submitted_at": "2025-01-15T10:30:00Z",
    "responses": {
      "q1": 1,
      "q2": true,
      "q3": {"ไทย": "กรุงเทพฯ"}
    },
    "answers": [
      {
        "question_id": "q1",
        "response": 1,
        "is_correct": true,
        "awarded_points": 5.0,
        "max_points": 5.0
      }
    ]
  }
]
```

## ตัวอย่างการใช้งาน

### การสร้างแบบทดสอบ

```python
from pathlib import Path
from quiz_system import (
    Quiz,
    MultipleChoiceQuestion,
    TrueFalseQuestion,
    MatchingQuestion,
    MatchingPair,
    QuizEngine,
    JsonAttemptRepository,
)

# สร้างคำถาม
questions = [
    MultipleChoiceQuestion(
        id="q1",
        question_text="2 + 2 เท่ากับเท่าไร?",
        options=["3", "4", "5", "6"],
        correct_answer=1,
        points=10,
    ),
    TrueFalseQuestion(
        id="q2",
        question_text="Python เป็นภาษาโปรแกรม",
        correct_answer=True,
        points=5,
    ),
    MatchingQuestion(
        id="q3",
        question_text="จับคู่ประเทศกับเมืองหลวง",
        pairs=[
            MatchingPair("ไทย", "กรุงเทพฯ"),
            MatchingPair("ญี่ปุ่น", "โตเกียว"),
        ],
        points=10,
    ),
]

# สร้างแบบทดสอบ
quiz = Quiz(
    id="quiz-001",
    title="แบบทดสอบตัวอย่าง",
    description="แบบทดสอบสำหรับสาธิต",
    questions=questions,
    passing_score=70.0,
    max_attempts=3,
)
```

### การให้นักเรียนทำข้อสอบ

```python
# เริ่มต้น engine
repository = JsonAttemptRepository(Path("data/attempts.json"))
engine = QuizEngine(repository)

# เริ่มทำข้อสอบ
attempt = engine.start_quiz(quiz=quiz, user_id="student-123")
print(f"เริ่มทำข้อสอบ: {attempt.attempt_id}")

# บันทึกคำตอบ
engine.record_answer(attempt.attempt_id, "q1", 1)
engine.record_answer(attempt.attempt_id, "q2", True)
engine.record_answer(
    attempt.attempt_id,
    "q3",
    {"ไทย": "กรุงเทพฯ", "ญี่ปุ่น": "โตเกียว"}
)

# ส่งข้อสอบ
graded = engine.submit_quiz(attempt.attempt_id, quiz)
print(f"คะแนน: {graded.score}/{graded.max_score}")
print(f"ผล: {'ผ่าน' if graded.passed else 'ไม่ผ่าน'}")

# ดูสรุปผลพร้อมเฉลย
summary = engine.get_attempt_summary(graded.attempt_id, quiz)
for question in summary['questions']:
    print(f"ข้อ {question['id']}: {'ถูก' if question['is_correct'] else 'ผิด'}")
```

### การสร้างรายงาน

```python
from quiz_system import QuizReport

report = QuizReport(repository)

# รายงานแบบทดสอบ
stats = report.get_quiz_statistics(quiz_id="quiz-001")
print(f"อัตราผ่าน: {stats['pass_rate']:.1f}%")
print(f"คะแนนเฉลี่ย: {stats['average_score']:.1f}")

# รายงานผู้ใช้
user_stats = report.get_user_performance(
    user_id="student-123",
    quiz_id="quiz-001"
)
print(f"ทำข้อสอบไปแล้ว: {user_stats['completed_attempts']} ครั้ง")
print(f"คะแนนสูงสุด: {user_stats['best_score']}")

# วิเคราะห์ข้อสอบ
analytics = report.get_question_analytics(quiz)
for qid, data in analytics.items():
    print(f"ข้อ {qid}: คนตอบถูก {data['accuracy_rate']:.1f}%")
```

## การป้องกันปัญหาที่พบบ่อย

### 1. ป้องกันการทำเกินจำนวนครั้ง

```python
from quiz_system.engine import MaxAttemptsExceededError

try:
    attempt = engine.start_quiz(quiz, user_id="student-123")
except MaxAttemptsExceededError:
    print("คุณทำข้อสอบครบจำนวนครั้งที่กำหนดแล้ว")
```

### 2. ป้องกันการแก้ไขหลังส่ง

```python
from quiz_system.engine import AttemptAlreadySubmittedError

try:
    engine.record_answer(attempt_id, "q1", 2)
except AttemptAlreadySubmittedError:
    print("ไม่สามารถแก้ไขคำตอบหลังส่งแล้ว")
```

### 3. ตรวจสอบสถานะก่อนทำงาน

```python
attempt = engine.get_attempt(attempt_id)
if attempt.status == AttemptStatus.IN_PROGRESS:
    # ยังทำอยู่
    pass
elif attempt.status == AttemptStatus.SUBMITTED:
    # ส่งแล้ว
    pass
elif attempt.status == AttemptStatus.CANCELLED:
    # ยกเลิกแล้ว
    pass
```

## การขยายระบบในอนาคต

ระบบนี้ออกแบบให้ขยายได้ง่าย:

1. **เพิ่มประเภทคำถามใหม่**: สร้าง class ที่ implement `check_answer()` method
2. **เปลี่ยนไปใช้ Database**: สร้าง class ใหม่ที่ implement `AttemptRepository` protocol
3. **เพิ่ม REST API**: ใช้ Flask/FastAPI เรียกใช้ QuizEngine
4. **ระบบจับเวลา**: เพิ่มการตรวจสอบ `time_limit_minutes` ใน engine
5. **คะแนนบางส่วน**: ปรับ logic การให้คะแนนใน MatchingQuestion

## สรุป

ระบบนี้ครอบคลุม:
- ✅ Workflow สมบูรณ์: เริ่ม → ทำ → ส่ง → สรุปผล
- ✅ รองรับ 3 ประเภทคำถาม: Multiple Choice, True/False, Matching
- ✅ คำนวณคะแนนและผลสอบผ่าน/ไม่ผ่านอัตโนมัติ
- ✅ บันทึก quiz_attempt และ answers พร้อมป้องกันข้อมูลซ้ำ
- ✅ ระบบรายงานครบถ้วนสำหรับวิเคราะห์ผล

ระบบพร้อมใช้งานจริงและสามารถขยายเพิ่มเติมได้ตามความต้องการ
