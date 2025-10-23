"""Matching questions for Python programming exercises."""

from quiz_system import Quiz, MatchingQuestion, MatchingPair


def get_matching_questions():
    """Return a list of matching questions covering Python concepts."""
    questions = [
        MatchingQuestion(
            id="match-1",
            question_text="Match the Python data structure to its description.",
            pairs=[
                MatchingPair("list", "Ordered, mutable collection"),
                MatchingPair("tuple", "Ordered, immutable collection"),
                MatchingPair("set", "Unordered collection of unique items"),
                MatchingPair("dict", "Key-value mapping"),
            ],
            points=4,
            explanation="Each built-in data structure in Python has distinct properties."
        ),
        MatchingQuestion(
            id="match-2",
            question_text="Match the Python keyword to its purpose.",
            pairs=[
                MatchingPair("def", "Define a function"),
                MatchingPair("class", "Define a class"),
                MatchingPair("lambda", "Create an anonymous function"),
                MatchingPair("with", "Context manager for resource handling"),
            ],
            points=4,
            explanation="Python keywords serve specific purposes in the language syntax."
        ),
        MatchingQuestion(
            id="match-3",
            question_text="Match the built-in function to its description.",
            pairs=[
                MatchingPair("len", "Returns the number of items"),
                MatchingPair("sum", "Returns the total of numeric items"),
                MatchingPair("max", "Returns the largest item"),
                MatchingPair("sorted", "Returns a new sorted list"),
            ],
            points=4,
            explanation="Python provides built-in functions for common data operations."
        ),
        MatchingQuestion(
            id="match-4",
            question_text="Match the module to the functionality it provides.",
            pairs=[
                MatchingPair("math", "Mathematical functions"),
                MatchingPair("random", "Random number generation"),
                MatchingPair("os", "Interacting with the operating system"),
                MatchingPair("json", "Work with JSON data"),
            ],
            points=4,
            explanation="Standard library modules offer specialized features."
        ),
        MatchingQuestion(
            id="match-5",
            question_text="Match the code snippet to its output.",
            pairs=[
                MatchingPair("'Python'.upper()", "PYTHON"),
                MatchingPair("len({1, 1, 2, 3})", "3"),
                MatchingPair("type({})", "<class 'dict'>"),
                MatchingPair("'-'.join(['a', 'b', 'c'])", "a-b-c"),
            ],
            points=4,
            explanation="Understanding basic string and collection operations is essential in Python."
        ),
    ]

    return questions


def build_matching_quiz():
    """Build a quiz consisting of matching questions."""
    questions = get_matching_questions()

    return Quiz(
        id="matching-001",
        title="Python Matching Exercise",
        description="Match Python concepts, keywords, functions, and outputs.",
        questions=questions,
        passing_score=70.0,
        time_limit_minutes=15,
        max_attempts=2,
    )
