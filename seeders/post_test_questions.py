"""Post-test questions for Python programming course."""

from quiz_system import Quiz, MultipleChoiceQuestion


def get_post_test_questions():
    """Return a list of 20 questions for the Post-test."""
    questions = [
        MultipleChoiceQuestion(
            id="post-mcq-1",
            question_text="Which of the following best describes a Python generator?",
            options=[
                "A function that returns a list of values",
                "A function that uses yield to produce a sequence of values lazily",
                "A function that immediately executes all iterations",
                "A function that returns a dictionary"
            ],
            correct_answer=1,
            points=5,
            explanation="Generators use the yield keyword to iterate lazily without storing the entire sequence in memory."
        ),
        MultipleChoiceQuestion(
            id="post-mcq-2",
            question_text="What is the purpose of the @classmethod decorator in Python?",
            options=[
                "Define a method that can only be called on an instance",
                "Define a method executed at class creation time",
                "Define a method that receives the class as the first argument",
                "Define an abstract method"
            ],
            correct_answer=2,
            points=5,
            explanation="@classmethod defines a method that receives the class (cls) as the first argument."
        ),
        MultipleChoiceQuestion(
            id="post-mcq-3",
            question_text="Which statement is true about Python's list comprehension?",
            options=[
                "It cannot include conditional logic",
                "It creates a new list based on existing iterables",
                "It modifies the original list in-place",
                "It only works with lists"
            ],
            correct_answer=1,
            points=5,
            explanation="List comprehensions produce new lists derived from iterables and can include conditions."
        ),
        MultipleChoiceQuestion(
            id="post-mcq-4",
            question_text="What does the zip() function return in Python 3?",
            options=[
                "A list of tuples",
                "An iterator of tuples",
                "A dictionary",
                "A generator of lists"
            ],
            correct_answer=1,
            points=5,
            explanation="zip() returns an iterator of tuples in Python 3."
        ),
        MultipleChoiceQuestion(
            id="post-mcq-5",
            question_text="Which exception is raised when you try to access a key that doesn't exist in a dictionary?",
            options=["KeyError", "IndexError", "ValueError", "TypeError"],
            correct_answer=0,
            points=5,
            explanation="Attempting to access a missing key in a dictionary raises a KeyError."
        ),
        MultipleChoiceQuestion(
            id="post-mcq-6",
            question_text="What is the difference between a tuple and a list in Python?",
            options=[
                "Tuples are mutable, lists are immutable",
                "Tuples are immutable, lists are mutable",
                "Tuples store only numbers, lists store strings",
                "Tuples and lists are identical"
            ],
            correct_answer=1,
            points=5,
            explanation="Tuples are immutable sequences, whereas lists are mutable."
        ),
        MultipleChoiceQuestion(
            id="post-mcq-7",
            question_text="Which of the following statements about decorators is TRUE?",
            options=[
                "Decorators must return classes",
                "Decorators can modify or enhance the behavior of functions",
                "Decorators are only available in Python 3",
                "Decorators can only be applied to methods"
            ],
            correct_answer=1,
            points=5,
            explanation="Decorators wrap functions to modify or extend their behavior."
        ),
        MultipleChoiceQuestion(
            id="post-mcq-8",
            question_text="What is the result of list({1: 'a', 2: 'b', 3: 'c'})?",
            options=["['a', 'b', 'c']", "[1, 2, 3]", "[(1, 'a'), (2, 'b'), (3, 'c')]", "['a:1', 'b:2', 'c:3']"],
            correct_answer=1,
            points=5,
            explanation="When converting a dictionary to a list, only the keys are used."
        ),
        MultipleChoiceQuestion(
            id="post-mcq-9",
            question_text="Which Python module provides tools for working with dates and times?",
            options=["datetime", "time", "calendar", "All of the above"],
            correct_answer=3,
            points=5,
            explanation="datetime, time, and calendar modules all provide date/time-related functionality."
        ),
        MultipleChoiceQuestion(
            id="post-mcq-10",
            question_text="What is the output of: sum([i for i in range(5)])?",
            options=["10", "15", "5", "20"],
            correct_answer=0,
            points=5,
            explanation="The list comprehension generates [0, 1, 2, 3, 4]; sum equals 10."
        ),
        MultipleChoiceQuestion(
            id="post-mcq-11",
            question_text="What is the difference between 'is' and '==' in Python?",
            options=[
                "'is' compares values, '==' compares identities",
                "'is' compares identities, '==' compares values",
                "Both are identical",
                "'is' is for strings, '==' is for numbers"
            ],
            correct_answer=1,
            points=5,
            explanation="'is' checks object identity, '==' checks value equality."
        ),
        MultipleChoiceQuestion(
            id="post-mcq-12",
            question_text="How do you handle exceptions in Python?",
            options=[
                "Using try/except blocks",
                "Using if statements",
                "Using switch statements",
                "Using break statements"
            ],
            correct_answer=0,
            points=5,
            explanation="Exception handling in Python is done using try/except blocks."
        ),
        MultipleChoiceQuestion(
            id="post-mcq-13",
            question_text="Which of the following is a valid way to open a file for reading?",
            options=[
                "open('file.txt', 'r')",
                "open('file.txt', 'w')",
                "open('file.txt', 'a')",
                "open('file.txt', 'x')"
            ],
            correct_answer=0,
            points=5,
            explanation="The 'r' mode opens a file for reading."
        ),
        MultipleChoiceQuestion(
            id="post-mcq-14",
            question_text="What does the enumerate() function return?",
            options=[
                "A list of indices",
                "A tuple containing an index and the value from the iterable",
                "A dictionary of index-value pairs",
                "A generator of values only"
            ],
            correct_answer=1,
            points=5,
            explanation="enumerate() produces pairs of (index, value)."
        ),
        MultipleChoiceQuestion(
            id="post-mcq-15",
            question_text="Which of the following is NOT a Python built-in data structure?",
            options=["List", "Tuple", "HashMap", "Set"],
            correct_answer=2,
            points=5,
            explanation="Python has dict instead of HashMap as a built-in mapping type."
        ),
        MultipleChoiceQuestion(
            id="post-mcq-16",
            question_text="What does the following code print?\n\nvalues = [1, 2, 3]\nprint(values[-1])",
            options=["1", "2", "3", "Error"],
            correct_answer=2,
            points=5,
            explanation="Negative indices access elements from the end of the list."
        ),
        MultipleChoiceQuestion(
            id="post-mcq-17",
            question_text="Which built-in function returns the number of elements in an iterable?",
            options=["count()", "length()", "len()", "size()"],
            correct_answer=2,
            points=5,
            explanation="len() returns the number of items in an iterable."
        ),
        MultipleChoiceQuestion(
            id="post-mcq-18",
            question_text="Which statement about list slicing is TRUE?",
            options=[
                "list[start:stop] includes the stop index",
                "Negative indices are not allowed",
                "Slicing returns a new list",
                "Both start and stop indices are required"
            ],
            correct_answer=2,
            points=5,
            explanation="List slicing produces a new list and excludes the stop index."
        ),
        MultipleChoiceQuestion(
            id="post-mcq-19",
            question_text="What is the result of: {x: x * x for x in range(3)}?",
            options=[
                "A list of squares",
                "A set of squares",
                "A dictionary mapping each number to its square",
                "An error"
            ],
            correct_answer=2,
            points=5,
            explanation="This is a dictionary comprehension producing {0: 0, 1: 1, 2: 4}."
        ),
        MultipleChoiceQuestion(
            id="post-mcq-20",
            question_text="Which module is used for regular expressions in Python?",
            options=["regex", "re", "regexp", "pyregex"],
            correct_answer=1,
            points=5,
            explanation="The 're' module provides regular expression support in Python."
        ),
    ]

    return questions


def build_post_test_quiz():
    """Build the complete Post-test quiz."""
    questions = get_post_test_questions()

    return Quiz(
        id="post-test-001",
        title="Python Programming Post-Test",
        description="Final assessment to evaluate your Python programming knowledge after completing the course.",
        questions=questions,
        passing_score=80.0,
        time_limit_minutes=30,
        max_attempts=1,
    )
