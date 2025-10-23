"""Pre-test questions for Python programming course."""

from quiz_system import (
    Quiz,
    MultipleChoiceQuestion,
    TrueFalseQuestion,
    MatchingQuestion,
    MatchingPair,
)


def get_pre_test_questions():
    """Return a list of 20 questions for the Pre-test."""
    
    questions = [
        MultipleChoiceQuestion(
            id="pre-mcq-1",
            question_text="What is Python?",
            options=[
                "A type of snake",
                "A high-level programming language",
                "A database system",
                "An operating system"
            ],
            correct_answer=1,
            points=5,
            explanation="Python is a high-level, interpreted programming language known for its simplicity and versatility."
        ),
        MultipleChoiceQuestion(
            id="pre-mcq-2",
            question_text="Which of the following is the correct file extension for Python files?",
            options=[".pt", ".pyt", ".py", ".python"],
            correct_answer=2,
            points=5,
            explanation="Python files use the .py extension."
        ),
        MultipleChoiceQuestion(
            id="pre-mcq-3",
            question_text="What is the output of: print(2 ** 3)?",
            options=["5", "6", "8", "9"],
            correct_answer=2,
            points=5,
            explanation="The ** operator is exponentiation in Python. 2 ** 3 = 2 × 2 × 2 = 8."
        ),
        MultipleChoiceQuestion(
            id="pre-mcq-4",
            question_text="Which keyword is used to create a function in Python?",
            options=["function", "def", "func", "define"],
            correct_answer=1,
            points=5,
            explanation="The 'def' keyword is used to define functions in Python."
        ),
        MultipleChoiceQuestion(
            id="pre-mcq-5",
            question_text="What data type is the object below? x = 'Hello World'",
            options=["str", "int", "float", "list"],
            correct_answer=0,
            points=5,
            explanation="Text enclosed in quotes is a string (str) data type."
        ),
        MultipleChoiceQuestion(
            id="pre-mcq-6",
            question_text="Which of the following is used to comment a single line in Python?",
            options=["//", "/* */", "#", "--"],
            correct_answer=2,
            points=5,
            explanation="In Python, # is used for single-line comments."
        ),
        MultipleChoiceQuestion(
            id="pre-mcq-7",
            question_text="What is the correct way to create a list in Python?",
            options=[
                "list = (1, 2, 3)",
                "list = [1, 2, 3]",
                "list = {1, 2, 3}",
                "list = <1, 2, 3>"
            ],
            correct_answer=1,
            points=5,
            explanation="Lists in Python are created using square brackets []."
        ),
        MultipleChoiceQuestion(
            id="pre-mcq-8",
            question_text="Which operator is used to check if two values are equal?",
            options=["=", "==", "!=", "==="],
            correct_answer=1,
            points=5,
            explanation="The == operator is used for equality comparison in Python."
        ),
        MultipleChoiceQuestion(
            id="pre-mcq-9",
            question_text="What will len([1, 2, 3, 4, 5]) return?",
            options=["4", "5", "6", "Error"],
            correct_answer=1,
            points=5,
            explanation="The len() function returns the number of items in a list. This list has 5 elements."
        ),
        MultipleChoiceQuestion(
            id="pre-mcq-10",
            question_text="Which loop is used to iterate over a sequence in Python?",
            options=["foreach", "for", "loop", "iterate"],
            correct_answer=1,
            points=5,
            explanation="The 'for' loop is used to iterate over sequences (lists, tuples, strings, etc.) in Python."
        ),
        MultipleChoiceQuestion(
            id="pre-mcq-11",
            question_text="What is the output of: print(type(5.0))?",
            options=[
                "<class 'int'>",
                "<class 'float'>",
                "<class 'double'>",
                "<class 'number'>"
            ],
            correct_answer=1,
            points=5,
            explanation="Numbers with decimal points are of type 'float' in Python."
        ),
        MultipleChoiceQuestion(
            id="pre-mcq-12",
            question_text="Which method is used to add an element at the end of a list?",
            options=["add()", "append()", "insert()", "push()"],
            correct_answer=1,
            points=5,
            explanation="The append() method adds an element to the end of a list."
        ),
        MultipleChoiceQuestion(
            id="pre-mcq-13",
            question_text="What is the correct syntax for an if statement in Python?",
            options=[
                "if x = 5:",
                "if (x == 5)",
                "if x == 5:",
                "if x == 5 then:"
            ],
            correct_answer=2,
            points=5,
            explanation="If statements in Python use a colon and require proper comparison operators."
        ),
        MultipleChoiceQuestion(
            id="pre-mcq-14",
            question_text="Which of the following is NOT a valid variable name in Python?",
            options=["_myvar", "my_var", "myVar", "2myvar"],
            correct_answer=3,
            points=5,
            explanation="Variable names in Python cannot start with a number."
        ),
        MultipleChoiceQuestion(
            id="pre-mcq-15",
            question_text="What does the break statement do in a loop?",
            options=[
                "Skips the current iteration",
                "Exits the loop completely",
                "Pauses the loop",
                "Restarts the loop"
            ],
            correct_answer=1,
            points=5,
            explanation="The break statement terminates the loop entirely."
        ),
        MultipleChoiceQuestion(
            id="pre-mcq-16",
            question_text="Which built-in function is used to get user input in Python?",
            options=["get()", "input()", "read()", "scan()"],
            correct_answer=1,
            points=5,
            explanation="The input() function is used to get user input from the console."
        ),
        MultipleChoiceQuestion(
            id="pre-mcq-17",
            question_text="What is the result of: bool(0)?",
            options=["True", "False", "0", "Error"],
            correct_answer=1,
            points=5,
            explanation="In Python, 0 is considered False when converted to boolean."
        ),
        MultipleChoiceQuestion(
            id="pre-mcq-18",
            question_text="Which of these is a mutable data type in Python?",
            options=["tuple", "string", "list", "int"],
            correct_answer=2,
            points=5,
            explanation="Lists are mutable, meaning they can be modified after creation."
        ),
        MultipleChoiceQuestion(
            id="pre-mcq-19",
            question_text="What is the output of: print('Hello' + 'World')?",
            options=["Hello World", "HelloWorld", "Error", "Hello+World"],
            correct_answer=1,
            points=5,
            explanation="The + operator concatenates strings in Python without adding spaces."
        ),
        MultipleChoiceQuestion(
            id="pre-mcq-20",
            question_text="Which symbol is used for integer division in Python 3?",
            options=["/", "//", "%", "\\"],
            correct_answer=1,
            points=5,
            explanation="The // operator performs integer (floor) division in Python 3."
        ),
    ]
    
    return questions


def build_pre_test_quiz():
    """Build the complete Pre-test quiz."""
    questions = get_pre_test_questions()
    
    return Quiz(
        id="pre-test-001",
        title="Python Programming Pre-Test",
        description="Initial assessment to evaluate your Python programming knowledge before starting the course.",
        questions=questions,
        passing_score=70.0,
        time_limit_minutes=30,
        max_attempts=1,
    )
