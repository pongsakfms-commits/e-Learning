# คลังคำถามสำหรับระบบ e-Learning

เอกสารนี้อธิบายคลังคำถามทั้งหมดที่ใช้ในระบบ e-Learning พร้อมรายละเอียดเกี่ยวกับการตรวจสอบคำตอบและการให้คะแนน

## สรุปภาพรวม

ระบบมีคลังคำถามทั้งหมด **4 ชุด** รวม **55 คำถาม** คะแนนรวม **240 คะแนน**

| ชุดคำถาม | จำนวนคำถาม | คะแนนรวม | ประเภทคำถาม |
|---------|------------|---------|------------|
| Pre-test | 20 | 100 | Multiple Choice |
| Post-test | 20 | 100 | Multiple Choice |
| True/False | 10 | 20 | True/False |
| Matching | 5 | 20 | Matching |

## 1. Pre-test (ก่อนเรียน)

### รายละเอียด
- **จำนวนคำถาม:** 20 ข้อ
- **คะแนนต่อข้อ:** 5 คะแนน
- **คะแนนรวม:** 100 คะแนน
- **เกณฑ์ผ่าน:** 70%
- **เวลาที่ใช้:** 30 นาที
- **จำนวนครั้งที่ทำได้:** 1 ครั้ง

### หัวข้อที่ครอบคลุม
1. **พื้นฐาน Python** - ความหมาย, นามสกุลไฟล์
2. **ชนิดข้อมูล** - str, int, float, list
3. **ตัวดำเนินการ** - คณิตศาสตร์, การเปรียบเทียบ
4. **โครงสร้างควบคุม** - if, for, while
5. **ฟังก์ชัน** - การประกาศและเรียกใช้
6. **คอมเมนต์** - การใช้ # 
7. **รายการ (Lists)** - การสร้างและจัดการ
8. **ตัวแปร** - กฎการตั้งชื่อ
9. **ฟังก์ชันมาตรฐาน** - len(), input(), type()

### ตัวอย่างคำถาม

**คำถามที่ 1:** What is Python?
- ตัวเลือก: A type of snake / **A high-level programming language** / A database system / An operating system
- คำตอบที่ถูกต้อง: ตัวเลือกที่ 2 (index 1)
- คะแนน: 5
- คำอธิบาย: Python is a high-level, interpreted programming language known for its simplicity and versatility.

**คำถามที่ 3:** What is the output of: print(2 ** 3)?
- ตัวเลือก: 5 / 6 / **8** / 9
- คำตอบที่ถูกต้อง: ตัวเลือกที่ 3 (index 2)
- คะแนน: 5
- คำอธิบาย: The ** operator is exponentiation in Python. 2 ** 3 = 2 × 2 × 2 = 8.

### การ Mapping คำตอบ
- ใช้ index (0-based) สำหรับตัวเลือกที่ถูกต้อง
- ตัวอย่าง: ถ้าตัวเลือกที่ 2 ถูกต้อง → correct_answer = 1
- การตรวจสอบ: 0 ≤ correct_answer < len(options)

## 2. Post-test (หลังเรียน)

### รายละเอียด
- **จำนวนคำถาม:** 20 ข้อ
- **คะแนนต่อข้อ:** 5 คะแนน
- **คะแนนรวม:** 100 คะแนน
- **เกณฑ์ผ่าน:** 80%
- **เวลาที่ใช้:** 30 นาที
- **จำนวนครั้งที่ทำได้:** 1 ครั้ง

### หัวข้อที่ครอบคลุม
1. **Generators** - การใช้ yield
2. **Decorators** - @classmethod, @staticmethod
3. **Comprehensions** - list, dict comprehensions
4. **Exception Handling** - try/except
5. **File I/O** - การเปิด/ปิดไฟล์
6. **Built-in Functions** - zip(), enumerate(), map()
7. **Data Structures** - tuple vs list, dict operations
8. **Regular Expressions** - module re
9. **Object Identity** - is vs ==

### ตัวอย่างคำถาม

**คำถามที่ 1:** Which of the following best describes a Python generator?
- ตัวเลือก: A function that returns a list of values / **A function that uses yield to produce a sequence of values lazily** / ...
- คำตอบที่ถูกต้อง: ตัวเลือกที่ 2 (index 1)
- คะแนน: 5

**คำถามที่ 5:** Which exception is raised when you try to access a key that doesn't exist in a dictionary?
- ตัวเลือก: **KeyError** / IndexError / ValueError / TypeError
- คำตอบที่ถูกต้อง: ตัวเลือกที่ 1 (index 0)
- คะแนน: 5

### การ Mapping คำตอบ
- ใช้วิธีเดียวกับ Pre-test (index-based)
- ทุกคำถามมีคำอธิบายประกอบ

## 3. True/False Exercise (แบบฝึกหัดถูก/ผิด)

### รายละเอียด
- **จำนวนคำถาม:** 10 ข้อ
- **คะแนนต่อข้อ:** 2 คะแนน
- **คะแนนรวม:** 20 คะแนน
- **เกณฑ์ผ่าน:** 70%
- **เวลาที่ใช้:** 10 นาที
- **จำนวนครั้งที่ทำได้:** 2 ครั้ง

### หัวข้อที่ครอบคลุม
- การตีความภาษา Python (interpreted)
- ความแตกต่างระหว่าง mutable และ immutable
- การใช้ keyword ต่างๆ (in, pass, global)
- โครงสร้างข้อมูล (dictionary, lists)
- การสืบทอด (inheritance)
- Dynamic typing

### ตัวอย่างคำถาม

**คำถามที่ 1:** Python is an interpreted programming language.
- คำตอบที่ถูกต้อง: **True**
- คะแนน: 2
- คำอธิบาย: Python code is executed by an interpreter rather than being compiled to machine code.

**คำถามที่ 2:** Lists in Python are immutable.
- คำตอบที่ถูกต้อง: **False**
- คะแนน: 2
- คำอธิบาย: Lists are mutable - they can be modified after creation. Tuples are immutable.

**คำถามที่ 4:** Python uses curly braces {} to define code blocks.
- คำตอบที่ถูกต้อง: **False**
- คะแนน: 2
- คำอธิบาย: Python uses indentation to define code blocks, not curly braces.

### การ Mapping คำตอบ
- ใช้ boolean: `True` หรือ `False`
- การตรวจสอบ: `isinstance(answer, bool)` และ `answer == correct_answer`

## 4. Matching Exercise (แบบฝึกหัดจับคู่)

### รายละเอียด
- **จำนวนชุด:** 5 ชุด
- **จำนวนคู่ต่อชุด:** 4 คู่
- **คะแนนต่อชุด:** 4 คะแนน
- **คะแนนรวม:** 20 คะแนน
- **เกณฑ์ผ่าน:** 70%
- **เวลาที่ใช้:** 15 นาที
- **จำนวนครั้งที่ทำได้:** 2 ครั้ง

### หัวข้อที่ครอบคลุม

#### ชุดที่ 1: Data Structures
จับคู่โครงสร้างข้อมูลกับคำอธิบาย
```python
{
    "list": "Ordered, mutable collection",
    "tuple": "Ordered, immutable collection",
    "set": "Unordered collection of unique items",
    "dict": "Key-value mapping"
}
```

#### ชุดที่ 2: Keywords
จับคู่ keyword กับวัตถุประสงค์
```python
{
    "def": "Define a function",
    "class": "Define a class",
    "lambda": "Create an anonymous function",
    "with": "Context manager for resource handling"
}
```

#### ชุดที่ 3: Built-in Functions
จับคู่ฟังก์ชันกับคำอธิบาย
```python
{
    "len": "Returns the number of items",
    "sum": "Returns the total of numeric items",
    "max": "Returns the largest item",
    "sorted": "Returns a new sorted list"
}
```

#### ชุดที่ 4: Modules
จับคู่ module กับฟังก์ชันการทำงาน
```python
{
    "math": "Mathematical functions",
    "random": "Random number generation",
    "os": "Interacting with the operating system",
    "json": "Work with JSON data"
}
```

#### ชุดที่ 5: Code Outputs
จับคู่โค้ดกับผลลัพธ์
```python
{
    "'Python'.upper()": "PYTHON",
    "len({1, 1, 2, 3})": "3",
    "type({})": "<class 'dict'>",
    "'-'.join(['a', 'b', 'c'])": "a-b-c"
}
```

### การ Mapping คำตอบ
- ใช้ dictionary สำหรับการจับคู่
- Format: `{"left_item": "right_item", ...}`
- การตรวจสอบ:
  1. ตรวจสอบว่าเป็น dict หรือไม่
  2. ตรวจสอบว่า keys ตรงกันหมดหรือไม่
  3. ตรวจสอบว่าแต่ละคู่ถูกต้องหรือไม่
- ต้องจับคู่ถูกทั้งหมดจึงจะได้คะแนน (all-or-nothing)

## การตรวจสอบความถูกต้อง

### 1. Multiple Choice Questions
```python
def check_answer(self, answer: Any) -> bool:
    if not isinstance(answer, int):
        return False
    return answer == self.correct_answer
```
- ตรวจสอบว่าคำตอบเป็น integer
- ตรวจสอบว่าตรงกับ index ที่ถูกต้อง

### 2. True/False Questions
```python
def check_answer(self, answer: Any) -> bool:
    if not isinstance(answer, bool):
        return False
    return answer == self.correct_answer
```
- ตรวจสอบว่าคำตอบเป็น boolean
- ตรวจสอบว่าตรงกับค่าที่ถูกต้อง

### 3. Matching Questions
```python
def check_answer(self, answer: Any) -> bool:
    if not isinstance(answer, dict):
        return False
    correct_mapping = {pair.left: pair.right for pair in self.pairs}
    if set(answer.keys()) != set(correct_mapping.keys()):
        return False
    for left, right in answer.items():
        if correct_mapping.get(left) != right:
            return False
    return True
```
- ตรวจสอบว่าคำตอบเป็น dict
- ตรวจสอบว่ามี keys ครบทุกตัว
- ตรวจสอบว่าแต่ละคู่ถูกต้อง

## การให้คะแนน

### คะแนนต่อข้อ
- Pre-test: 5 คะแนน/ข้อ
- Post-test: 5 คะแนน/ข้อ
- True/False: 2 คะแนน/ข้อ
- Matching: 4 คะแนน/ชุด (ต้องถูกทั้งหมด)

### การคำนวณคะแนน
```python
total_score = sum(awarded_points for each correct answer)
percentage = (total_score / max_score) * 100
passed = percentage >= passing_score
```

### เกณฑ์การผ่าน
- Pre-test: 70%
- Post-test: 80%
- True/False: 70%
- Matching: 70%

## วิธีการใช้งาน

### 1. Load คลังคำถาม
```python
from seeders import (
    build_pre_test_quiz,
    build_post_test_quiz,
    build_true_false_quiz,
    build_matching_quiz
)

pre_test = build_pre_test_quiz()
post_test = build_post_test_quiz()
tf_quiz = build_true_false_quiz()
matching_quiz = build_matching_quiz()
```

### 2. เริ่มทำแบบทดสอบ
```python
from quiz_system import QuizEngine, JsonAttemptRepository
from pathlib import Path

repository = JsonAttemptRepository(Path("data/attempts.json"))
engine = QuizEngine(repository)

attempt = engine.start_quiz(quiz=pre_test, user_id="student-123")
```

### 3. บันทึกคำตอบ
```python
# Multiple Choice
engine.record_answer(attempt.attempt_id, "pre-mcq-1", 1)

# True/False
engine.record_answer(attempt.attempt_id, "tf-1", True)

# Matching
engine.record_answer(attempt.attempt_id, "match-1", {
    "list": "Ordered, mutable collection",
    "tuple": "Ordered, immutable collection",
    "set": "Unordered collection of unique items",
    "dict": "Key-value mapping"
})
```

### 4. ส่งและให้คะแนน
```python
graded_attempt = engine.submit_quiz(attempt.attempt_id, pre_test)
summary = engine.get_attempt_summary(graded_attempt.attempt_id, pre_test)

print(f"Score: {summary['score']}/{summary['max_score']}")
print(f"Passed: {summary['passed']}")
```

## การ Seed ข้อมูล

รันคำสั่ง:
```bash
python seed_data.py
```

สคริปต์นี้จะ:
1. โหลดคลังคำถามทั้งหมด
2. แสดงข้อมูลรายละเอียดของแต่ละชุด
3. ตรวจสอบความถูกต้องของ answer mappings
4. รันการทดสอบตัวอย่าง
5. บันทึกข้อมูลลงใน `data/attempts.json`

## สรุป

- ✅ Pre-test: 20 ข้อ (100 คะแนน)
- ✅ Post-test: 20 ข้อ (100 คะแนน)
- ✅ True/False: 10 ข้อ (20 คะแนน)
- ✅ Matching: 5 ชุด (20 คะแนน)
- ✅ คำตอบทุกข้อมี mapping ที่ถูกต้อง
- ✅ ทุกคำถามมีคะแนนกำหนดชัดเจน
- ✅ มีคำอธิบายประกอบทุกข้อ
- ✅ Seeders ครอบคลุมคำถามทั้งหมด

**รวม: 55 คำถาม, 240 คะแนน**
