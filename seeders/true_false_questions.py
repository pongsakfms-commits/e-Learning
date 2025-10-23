"""True/False questions for Python programming exercises."""

from quiz_system import Quiz, TrueFalseQuestion


def get_true_false_questions():
    """Return a list of 10 True/False questions."""
    questions = [
        TrueFalseQuestion(
            id="tf-1",
            question_text="Python is an interpreted programming language.",
            correct_answer=True,
            points=2,
            explanation="Python code is executed by an interpreter rather than being compiled to machine code."
        ),
        TrueFalseQuestion(
            id="tf-2",
            question_text="Lists in Python are immutable.",
            correct_answer=False,
            points=2,
            explanation="Lists are mutable - they can be modified after creation. Tuples are immutable."
        ),
        TrueFalseQuestion(
            id="tf-3",
            question_text="The 'in' keyword can be used to check if a value exists in a list.",
            correct_answer=True,
            points=2,
            explanation="The 'in' operator is used to test for membership in collections like lists."
        ),
        TrueFalseQuestion(
            id="tf-4",
            question_text="Python uses curly braces {} to define code blocks.",
            correct_answer=False,
            points=2,
            explanation="Python uses indentation to define code blocks, not curly braces."
        ),
        TrueFalseQuestion(
            id="tf-5",
            question_text="A Python dictionary can have duplicate keys.",
            correct_answer=False,
            points=2,
            explanation="Dictionary keys must be unique. If you assign a value to an existing key, it overwrites the old value."
        ),
        TrueFalseQuestion(
            id="tf-6",
            question_text="The 'pass' statement in Python does nothing and is used as a placeholder.",
            correct_answer=True,
            points=2,
            explanation="The 'pass' statement is a null operation used when syntax requires a statement but no code needs to execute."
        ),
        TrueFalseQuestion(
            id="tf-7",
            question_text="Python supports multiple inheritance.",
            correct_answer=True,
            points=2,
            explanation="Python classes can inherit from multiple parent classes."
        ),
        TrueFalseQuestion(
            id="tf-8",
            question_text="The range() function returns a list in Python 3.",
            correct_answer=False,
            points=2,
            explanation="In Python 3, range() returns a range object (iterator), not a list."
        ),
        TrueFalseQuestion(
            id="tf-9",
            question_text="Variables in Python must be declared with a type before use.",
            correct_answer=False,
            points=2,
            explanation="Python uses dynamic typing - you don't need to declare variable types."
        ),
        TrueFalseQuestion(
            id="tf-10",
            question_text="The 'global' keyword is used to create a global variable inside a function.",
            correct_answer=True,
            points=2,
            explanation="The 'global' keyword allows you to modify a global variable from within a function."
        ),
    ]

    return questions


def build_true_false_quiz():
    """Build a quiz with all True/False questions."""
    questions = get_true_false_questions()

    return Quiz(
        id="true-false-001",
        title="Python True/False Exercise",
        description="Test your understanding of Python concepts with these True/False questions.",
        questions=questions,
        passing_score=70.0,
        time_limit_minutes=10,
        max_attempts=2,
    )
