window.pythonCourseData = {
    id: 'python-foundations',
    title: 'เส้นทางสู่การเป็น Python Developer',
    tagline: 'เรียนรู้ Python อย่างเป็นระบบ ตั้งแต่พื้นฐานสู่การทำโปรเจกต์จริง',
    description:
        'คอร์สนี้ออกแบบมาเพื่อให้ผู้เรียนเข้าใจแนวคิดหลักของ Python ผ่านบทเรียนที่ต่อเนื่องกัน พร้อมตัวอย่างและแบบฝึกหัดให้ลงมือทำจริง',
    lessons: [
        {
            id: 'lesson-01-getting-started',
            order: 1,
            title: 'เตรียมความพร้อมและเขียนโค้ดแรกใน Python',
            summary: 'ตั้งค่าพื้นฐานให้พร้อมสำหรับการเรียน Python พร้อมลองเขียนโปรแกรมแรกของคุณ',
            level: 'พื้นฐาน',
            duration: '45 นาที',
            media: {
                type: 'video',
                url: 'https://www.youtube.com/embed/_uQrJ0TkZlc',
                caption: 'Python Programming - พื้นฐานสำหรับผู้เริ่มต้น'
            },
            objectives: [
                'ติดตั้ง Python และตั้งค่าสภาพแวดล้อมการพัฒนาได้อย่างถูกต้อง',
                'เข้าใจคำสั่งพื้นฐานของ Python ผ่านการใช้งาน REPL',
                'สามารถรันโปรแกรม Python บนเครื่องของตนเอง',
            ],
            topics: ['Python Interpreter', 'REPL', 'โครงสร้างไฟล์ .py', 'คำสั่ง print'],
            sections: [
                {
                    heading: 'ติดตั้ง Python และเครื่องมือที่จำเป็น',
                    body: 'ดาวน์โหลด Python รุ่นล่าสุดจากเว็บไซต์ทางการ และติดตั้งร่วมกับ VS Code พร้อมส่วนขยาย Python เพื่อให้พร้อมสำหรับการพัฒนา',
                    list: [
                        'ตรวจสอบเวอร์ชันด้วยคำสั่ง `python --version` หรือ `python3 --version`',
                        'ติดตั้ง VS Code และเพิ่มส่วนขยาย “Python” จาก Microsoft',
                        'ตั้งค่าโฟลเดอร์สำหรับเก็บไฟล์โปรเจกต์เรียนรู้',
                    ],
                },
                {
                    heading: 'ลองเล่นกับ REPL (Read-Eval-Print Loop)',
                    body: 'REPL ช่วยให้ทดลองคำสั่งสั้นๆ ได้อย่างรวดเร็ว เหมาะสำหรับค้นหาคำตอบและเข้าใจพฤติกรรมของภาษา',
                    code: '>>> 2 + 3\n5\n>>> message = "Hello, Python"\n>>> message\n"Hello, Python"',
                },
                {
                    heading: 'โปรแกรมแรกของคุณ',
                    body: 'สร้างไฟล์ `hello.py` และพิมพ์คำสั่งต่อไปนี้ จากนั้นรันผ่าน Terminal หรือปุ่ม Run ใน VS Code',
                    code: 'print("Hello, Python!")\nprint("ฉันพร้อมสำหรับการเขียนโปรแกรมแล้ว ✨")',
                },
            ],
            challenge: 'สร้างโปรแกรมที่ถามชื่อผู้ใช้และแสดงคำทักทาย เช่น “ยินดีต้อนรับ คุณเอ!”',
            resources: [
                { label: 'ดาวน์โหลด Python', url: 'https://www.python.org/downloads/' },
                { label: 'ตั้งค่า VS Code สำหรับ Python', url: 'https://code.visualstudio.com/docs/python/python-tutorial' },
            ],
        },
        {
            id: 'lesson-02-variables-data-types',
            order: 2,
            title: 'ตัวแปร ชนิดข้อมูล และการทำงานกับสตริง',
            summary: 'เข้าใจโครงสร้างข้อมูลพื้นฐานของ Python และฝึกจัดการสตริงในชีวิตจริง',
            level: 'พื้นฐาน',
            duration: '60 นาที',
            objectives: [
                'ประกาศและใช้งานตัวแปรได้อย่างมั่นใจ',
                'รู้จักชนิดข้อมูลหลักของ Python และวิธีแปลงชนิด',
                'จัดรูปแบบข้อความด้วย f-string เพื่อสร้างผลลัพธ์ที่สวยงาม',
            ],
            topics: ['Variables', 'Numbers', 'Strings', 'Type Casting', 'f-string'],
            media: {
                type: 'video',
                url: 'https://www.youtube.com/embed/kqtD5dpn9C8',
                caption: 'ทำความเข้าใจตัวแปรและสตริงใน Python'
            },
            sections: [
                {
                    heading: 'ประกาศตัวแปรแบบยืดหยุ่น',
                    body: 'Python เป็นภาษาที่กำหนดชนิดข้อมูลอัตโนมัติ คุณเพียงต้องตั้งชื่อสื่อความหมายและกำหนดค่าเท่านั้น',
                    code: 'course_name = "Python Essentials"\nlessons_count = 10\nprogress = 0.45  # 45%\nready_to_learn = True',
                },
                {
                    heading: 'ทำความรู้จักชนิดข้อมูลพื้นฐาน',
                    list: [
                        'ตัวเลขจำนวนเต็ม (int) และทศนิยม (float)',
                        'ข้อความ (str) และตัวอักษรพิเศษ',
                        'ค่าความจริง (bool) — True / False',
                        'None ใช้แทนค่าที่ว่างหรือยังไม่กำหนด',
                    ],
                },
                {
                    heading: 'เครื่องมือสำคัญ: f-string',
                    body: 'ใช้ f-string เพื่อจัดรูปแบบข้อความให้อ่านง่ายขึ้น และแทรกตัวแปรลงไปได้โดยตรง',
                    code: 'name = "เอ"\ncompleted = 3\ntotal = 10\nmessage = f"สวัสดี {name}! คุณเรียนไปแล้ว {completed}/{total} บท"\nprint(message)  # สวัสดี เอ! คุณเรียนไปแล้ว 3/10 บท',
                },
            ],
            challenge: 'เขียนโปรแกรมคำนวณอายุจากปีเกิด และแสดงผลแบบสวยงามด้วย f-string',
            resources: [
                { label: 'ชนิดข้อมูลมาตรฐานใน Python', url: 'https://docs.python.org/3/library/stdtypes.html' },
                { label: 'การใช้งาน f-string', url: 'https://realpython.com/python-f-strings/' },
            ],
        },
        {
            id: 'lesson-03-control-flow',
            order: 3,
            title: 'ควบคุมการไหลของโปรแกรมด้วยเงื่อนไขและลูป',
            summary: 'ใช้ if, for, while เพื่อให้โปรแกรมตัดสินใจและทำงานซ้ำได้อย่างยืดหยุ่น',
            level: 'พื้นฐาน',
            duration: '75 นาที',
            objectives: [
                'วิเคราะห์และสร้างเงื่อนไขซ้อนกันได้',
                'ใช้ลูป for/while เพื่อจัดการข้อมูลซ้ำๆ',
                'รู้จัก break และ continue สำหรับควบคุมลูประดับละเอียด',
            ],
            topics: ['if/elif/else', 'logical operators', 'for loop', 'while loop', 'break & continue'],
            sections: [
                {
                    heading: 'โครงสร้างการตัดสินใจ',
                    body: 'ควบคุมการทำงานด้วยเงื่อนไขผสมผสานหลายระดับ',
                    code: 'score = 82\nattendance = 0.9\n\nif score >= 80 and attendance >= 0.8:\n    print("ผ่านด้วยเกียรตินิยม")\nelif score >= 50:\n    print("ผ่านเกณฑ์มาตรฐาน")\nelse:\n    print("ต้องปรับปรุงเพิ่ม")',
                },
                {
                    heading: 'วนลูปเพื่อจัดการข้อมูล',
                    body: 'รวบรวมผลลัพธ์จากรายการด้วย for loop',
                    code: 'scores = [78, 92, 88, 64, 85]\ntotal = 0\nfor score in scores:\n    total += score\n\naverage = total / len(scores)\nprint(f"คะแนนเฉลี่ย: {average:.2f}")',
                },
                {
                    heading: 'while loop และการหยุดลูป',
                    body: 'ใช้ while สำหรับโจทย์ที่ไม่ทราบจำนวนรอบล่วงหน้า พร้อมควบคุมด้วย break/continue',
                    code: 'attempts = 0\nMAX_ATTEMPTS = 3\n\nwhile attempts < MAX_ATTEMPTS:\n    password = input("กรอกรหัสผ่าน: ")\n    if password == "letmein":\n        print("เข้าสู่ระบบสำเร็จ")\n        break\n    attempts += 1\nelse:\n    print("พยายามครบจำนวนแล้ว กรุณาลองใหม่ภายหลัง")',
                },
            ],
            challenge: 'สร้างเมนูง่ายๆ ที่ให้ผู้ใช้เลือก (1) แสดงรายการ, (2) เพิ่มรายการ, (3) ออกจากโปรแกรม โดยใช้ลูปและเงื่อนไขควบคุม',
            resources: [
                { label: 'ทำความเข้าใจ if statements', url: 'https://www.w3schools.com/python/python_conditions.asp' },
                { label: 'แนวทางใช้ loop ใน Python', url: 'https://realpython.com/python-for-loop/' },
            ],
        },
        {
            id: 'lesson-04-functions-modules',
            order: 4,
            title: 'จัดระเบียบโค้ดด้วยฟังก์ชันและโมดูลมาตรฐาน',
            summary: 'ย่อยปัญหาเป็นฟังก์ชัน และใช้ประโยชน์จากโมดูลใน Python Standard Library',
            level: 'กลาง',
            duration: '70 นาที',
            objectives: [
                'สร้างฟังก์ชันที่มีพารามิเตอร์และค่าที่ส่งกลับได้',
                'เข้าใจความแตกต่างของตัวแปรแบบ local/global',
                'ใช้โมดูลมาตรฐาน เช่น datetime, random เพื่อเพิ่มขีดความสามารถ',
            ],
            topics: ['def function', 'parameters', 'return', 'scope', 'standard library'],
            sections: [
                {
                    heading: 'ฟังก์ชันที่ยืดหยุ่น',
                    body: 'รับค่าจำนวนไม่แน่นอนด้วย *args และ **kwargs เพื่อสร้าง API ที่ใช้งานง่าย',
                    code: 'def summarize_scores(*scores):\n    total = sum(scores)\n    average = total / len(scores)\n    return {"total": total, "average": average}\n\nprint(summarize_scores(82, 71, 95))',
                },
                {
                    heading: 'ใช้โมดูลสำเร็จรูป',
                    body: 'เชื่อมต่อกับโมดูล datetime และ random เพื่อสร้างโปรแกรมที่ฉลาดขึ้น',
                    code: 'from datetime import datetime\nimport random\n\nnow = datetime.now()\nprint(now.strftime("%d/%m/%Y %H:%M"))\n\notp = random.randint(100000, 999999)\nprint(f"รหัสยืนยันของคุณคือ {otp}")',
                },
                {
                    heading: 'แนวทางเขียนฟังก์ชันที่อ่านง่าย',
                    list: [
                        'ตั้งชื่อฟังก์ชันให้บอกหน้าที่ชัดเจน เช่น `calculate_total`',
                        'แก้ปัญหาเดียวต่อหนึ่งฟังก์ชัน (Single Responsibility)',
                        'เขียน docstring อธิบายอินพุต เอาต์พุต และตัวอย่าง',
                        'ทดสอบฟังก์ชันด้วยกรณีปกติ และกรณีขอบ (edge cases)',
                    ],
                },
            ],
            challenge: 'สร้างโมดูล `utils.py` ที่มีฟังก์ชันช่วยเหลืออย่างน้อย 3 ฟังก์ชัน แล้วนำไปใช้ในโปรแกรมหลัก',
            resources: [
                { label: 'คู่มือการเขียนฟังก์ชันใน Python', url: 'https://realpython.com/defining-your-own-python-function/' },
                { label: 'Python Standard Library', url: 'https://docs.python.org/3/library/' },
            ],
        },
        {
            id: 'lesson-05-working-with-data',
            order: 5,
            title: 'ทำงานกับข้อมูลไฟล์และภายนอก',
            summary: 'อ่านเขียนไฟล์ จัดการข้อมูลแบบ JSON และเตรียมพร้อมสำหรับโปรเจกต์จริง',
            level: 'กลาง',
            duration: '80 นาที',
            objectives: [
                'จัดเก็บข้อมูลลงไฟล์ข้อความและ CSV/JSON ได้',
                'ดึงข้อมูลจาก API ง่ายๆ ด้วย requests',
                'จัดโครงสร้างข้อมูลเพื่อเตรียมส่งต่อให้โปรเจกต์สุดท้าย',
            ],
            topics: ['file handling', 'CSV', 'JSON', 'API basics', 'error handling'],
            media: {
                type: 'video',
                url: 'https://www.youtube.com/embed/xeMOzuo3z8Q',
                caption: 'Workshop: จัดการไฟล์และทำงานกับข้อมูลจริง'
            },
            sections: [
                {
                    heading: 'อ่านและเขียนไฟล์อย่างปลอดภัย',
                    body: 'ใช้คำสั่ง `with open` เพื่อจัดการทรัพยากรไฟล์ ป้องกันข้อผิดพลาดการลืมปิดไฟล์',
                    code: "with open('notes.txt', 'a', encoding='utf-8') as file:\n    note = input('บันทึกสิ่งที่เรียนรู้วันนี้: ')\n    file.write(f'{note}\n')",
                },
                {
                    heading: 'ทำงานกับข้อมูล JSON',
                    body: 'JSON เป็นรูปแบบข้อมูลที่ใช้งานแพร่หลาย ใช้เก็บข้อมูลโปรไฟล์หรือรายการต่างๆ ได้เป็นอย่างดี',
                    code: 'import json\n\nprofile = {\n    "name": "A",\n    "skills": ["Python", "Git", "API"],\n    "completedLessons": 4\n}\n\nwith open("profile.json", "w", encoding="utf-8") as f:\n    json.dump(profile, f, ensure_ascii=False, indent=2)',
                },
                {
                    heading: 'ลองดึงข้อมูลจาก API สาธารณะ',
                    body: 'ใช้ requests เพื่อเรียก API และแสดงผลลัพธ์เบื้องต้น',
                    code: 'import requests\n\nresponse = requests.get("https://api.quotable.io/random", timeout=5)\nif response.status_code == 200:\n    data = response.json()\n    print(f"คำคมวันนี้: {data['content']} — {data['author']}")\nelse:\n    print("ไม่สามารถดึงข้อมูลได้")',
                },
            ],
            challenge:
                'สร้างระบบบันทึก To-Do List ที่บันทึกข้อมูลลงไฟล์ JSON และสามารถเพิ่ม/แสดง/ทำเครื่องหมายเสร็จสิ้นได้',
            resources: [
                { label: 'การจัดการไฟล์ใน Python', url: 'https://realpython.com/read-write-files-python/' },
                { label: 'แนะนำการใช้งาน requests', url: 'https://requests.readthedocs.io/en/latest/user/quickstart/' },
            ],
        },
    ],
    finalProject: {
        title: 'Final Project: Python Mini Application',
        tagline: 'สร้างแอปพลิเคชันขนาดเล็กที่แก้ปัญหาได้จริง',
        description:
            'ออกแบบและพัฒนาโปรแกรม Python ที่ช่วยแก้ปัญหาจริงในชีวิตประจำวัน เลือกหัวข้อที่คุณสนใจและนำความรู้จากทุกบทมาใช้',
        objectives: [
            'วางโครงสร้างโปรแกรมและออกแบบฟังก์ชันให้มีความรับผิดชอบเฉพาะ',
            'ใช้โครงสร้างข้อมูลและไฟล์เพื่อจัดเก็บและเรียกใช้ข้อมูล',
            'รองรับการป้อนข้อมูลจากผู้ใช้พร้อมจัดการข้อผิดพลาดที่อาจเกิดขึ้น',
            'นำเสนอผลงานด้วย README หรือคู่มือใช้งานสั้นๆ',
        ],
        requirements: [
            'ต้องมีฟังก์ชันอย่างน้อย 3 ฟังก์ชัน และจัดกลุ่มโค้ดให้เป็นสัดส่วน',
            'มีการบันทึกข้อมูลลงไฟล์ (เช่น JSON, CSV หรือ TXT) หรืออ่านข้อมูลจากภายนอก',
            'รองรับกรณีข้อมูลไม่ถูกต้องด้วย try/except และมีข้อความแนะนำผู้ใช้',
            'มีตัวเลือกเมนูหรือทางเลือกให้ผู้ใช้โต้ตอบกับโปรแกรมได้อย่างน้อย 3 รูปแบบ',
        ],
        deliverables: [
            'โค้ดโปรแกรมหลักและโมดูลที่เกี่ยวข้อง (.py)',
            'ไฟล์ README.md หรือเอกสารที่อธิบายวิธีใช้งานและตัวอย่างอินพุต/เอาต์พุต',
            'ตัวอย่างข้อมูลหรือไฟล์ตัวอย่างสำหรับทดสอบ (ถ้ามี)',
        ],
        suggestions: [
            'ระบบจัดการงานส่วนตัว พร้อมติดตามสถานะและกำหนดเวลา',
            'ตัวช่วยจัดการค่าใช้จ่ายรายวัน พร้อมสรุปรายงาน',
            'แอปสร้าง Flash Cards สำหรับทบทวนคำศัพท์หรือแนวคิด',
            'Mini Game เช่น เกมทายคำหรือเกมคณิตศาสตร์',
        ],
        resources: [
            { label: 'แนวคิดออกแบบ CLI App', url: 'https://realpython.com/python-command-line-arguments/' },
            { label: 'เทคนิคจัดการข้อผิดพลาดใน Python', url: 'https://realpython.com/python-exceptions/' },
            { label: 'ตัวอย่างโปรเจกต์เล็กๆ สำหรับผู้เริ่มต้น', url: 'https://www.freecodecamp.org/news/python-projects-for-beginners/' },
        ],
        submissionNote: 'โปรดเตรียมลิงก์หรือไฟล์โปรเจกต์ พร้อมคำอธิบายสั้นๆ เกี่ยวกับแรงบันดาลใจและการนำไปใช้จริง',
    },
};
