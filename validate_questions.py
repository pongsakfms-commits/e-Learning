"""Validation script to verify all question banks are correct."""

from seeders import (
    build_pre_test_quiz,
    build_post_test_quiz,
    build_true_false_quiz,
    build_matching_quiz,
)


def validate_quiz(quiz, expected_count, expected_points, quiz_name):
    """Validate a quiz structure."""
    print(f"\n{'=' * 60}")
    print(f"Validating: {quiz_name}")
    print(f"{'=' * 60}")
    
    errors = []
    
    # Check question count
    if len(quiz.questions) != expected_count:
        errors.append(f"Expected {expected_count} questions, got {len(quiz.questions)}")
    else:
        print(f"✓ Question count: {len(quiz.questions)}")
    
    # Check total points
    if quiz.total_points != expected_points:
        errors.append(f"Expected {expected_points} points, got {quiz.total_points}")
    else:
        print(f"✓ Total points: {quiz.total_points}")
    
    # Check all questions have required fields
    for i, q in enumerate(quiz.questions, 1):
        if not q.id:
            errors.append(f"Question {i} missing ID")
        if not q.question_text:
            errors.append(f"Question {i} missing question_text")
        if q.points <= 0:
            errors.append(f"Question {i} has invalid points: {q.points}")
        
        # Validate answer mapping
        try:
            question_type = q.question_type.value
            if question_type == "multiple_choice":
                if not (0 <= q.correct_answer < len(q.options)):
                    errors.append(f"Question {i} ({q.id}) has invalid answer index")
            elif question_type == "true_false":
                if not isinstance(q.correct_answer, bool):
                    errors.append(f"Question {i} ({q.id}) has non-boolean answer")
            elif question_type == "matching":
                if len(q.pairs) == 0:
                    errors.append(f"Question {i} ({q.id}) has no matching pairs")
        except Exception as e:
            errors.append(f"Question {i} validation error: {e}")
    
    if not errors:
        print(f"✓ All questions valid")
        print(f"✓ All answer mappings correct")
    
    # Display question types
    type_counts = {}
    for q in quiz.questions:
        t = q.question_type.value
        type_counts[t] = type_counts.get(t, 0) + 1
    
    print(f"\nQuestion types:")
    for qtype, count in type_counts.items():
        print(f"  - {qtype}: {count}")
    
    if errors:
        print(f"\n❌ Errors found:")
        for error in errors:
            print(f"  - {error}")
        return False
    else:
        print(f"\n✅ All validations passed!")
        return True


def main():
    """Run all validations."""
    print("=" * 60)
    print("QUESTION BANK VALIDATION")
    print("=" * 60)
    
    results = []
    
    # Validate Pre-test
    pre_test = build_pre_test_quiz()
    results.append(validate_quiz(pre_test, 20, 100, "Pre-test"))
    
    # Validate Post-test
    post_test = build_post_test_quiz()
    results.append(validate_quiz(post_test, 20, 100, "Post-test"))
    
    # Validate True/False
    tf_quiz = build_true_false_quiz()
    results.append(validate_quiz(tf_quiz, 10, 20, "True/False Exercise"))
    
    # Validate Matching
    matching_quiz = build_matching_quiz()
    results.append(validate_quiz(matching_quiz, 5, 20, "Matching Exercise"))
    
    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    
    total_questions = sum([
        len(pre_test.questions),
        len(post_test.questions),
        len(tf_quiz.questions),
        len(matching_quiz.questions),
    ])
    
    total_points = sum([
        pre_test.total_points,
        post_test.total_points,
        tf_quiz.total_points,
        matching_quiz.total_points,
    ])
    
    print(f"Total Quizzes: 4")
    print(f"Total Questions: {total_questions}")
    print(f"Total Points: {total_points}")
    print(f"\nBreakdown:")
    print(f"  - Pre-test: 20 MCQ (100 points)")
    print(f"  - Post-test: 20 MCQ (100 points)")
    print(f"  - True/False: 10 questions (20 points)")
    print(f"  - Matching: 5 sets (20 points)")
    
    if all(results):
        print(f"\n{'=' * 60}")
        print(f"✅ ALL VALIDATIONS PASSED!")
        print(f"{'=' * 60}")
        return True
    else:
        print(f"\n{'=' * 60}")
        print(f"❌ SOME VALIDATIONS FAILED!")
        print(f"{'=' * 60}")
        return False


if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
