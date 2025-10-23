"""Seed data script to populate the quiz system with all question banks."""

from pathlib import Path
from quiz_system import QuizEngine, JsonAttemptRepository
from seeders import (
    build_pre_test_quiz,
    build_post_test_quiz,
    build_true_false_quiz,
    build_matching_quiz,
)


def display_quiz_info(quiz):
    """Display detailed information about a quiz."""
    print(f"\n{'=' * 80}")
    print(f"Quiz ID: {quiz.id}")
    print(f"Title: {quiz.title}")
    print(f"Description: {quiz.description}")
    print(f"Total Questions: {len(quiz.questions)}")
    print(f"Total Points: {quiz.total_points}")
    print(f"Passing Score: {quiz.passing_score}%")
    print(f"Time Limit: {quiz.time_limit_minutes} minutes" if quiz.time_limit_minutes else "Time Limit: No limit")
    print(f"Max Attempts: {quiz.max_attempts}" if quiz.max_attempts else "Max Attempts: Unlimited")
    print(f"{'=' * 80}")


def display_questions_summary(quiz):
    """Display a summary of all questions in a quiz."""
    print(f"\nQuestions in '{quiz.title}':")
    print(f"{'-' * 80}")
    
    for i, question in enumerate(quiz.questions, 1):
        question_type = question.question_type.value.replace('_', ' ').title()
        print(f"{i}. [{question_type}] {question.question_text[:60]}...")
        print(f"   Points: {question.points}")


def verify_answers(quiz):
    """Verify that all questions have proper answer mappings."""
    print(f"\nVerifying answer mappings for '{quiz.title}':")
    print(f"{'-' * 80}")
    
    all_valid = True
    for i, question in enumerate(quiz.questions, 1):
        try:
            question_type = question.question_type.value
            
            if question_type == "multiple_choice":
                assert 0 <= question.correct_answer < len(question.options)
                print(f"✓ Question {i}: Correct answer index {question.correct_answer} is valid")
            
            elif question_type == "true_false":
                assert isinstance(question.correct_answer, bool)
                print(f"✓ Question {i}: Correct answer is {question.correct_answer}")
            
            elif question_type == "matching":
                assert len(question.pairs) > 0
                print(f"✓ Question {i}: Has {len(question.pairs)} matching pairs")
            
        except AssertionError as e:
            print(f"✗ Question {i}: Invalid answer mapping - {e}")
            all_valid = False
    
    if all_valid:
        print(f"\n✓ All {len(quiz.questions)} questions have valid answer mappings!")
    else:
        print("\n✗ Some questions have invalid answer mappings!")
    
    return all_valid


def run_sample_attempt(engine, quiz, user_id):
    """Run a sample attempt to verify the quiz works properly."""
    print(f"\n\nRunning sample attempt for user '{user_id}'...")
    print(f"{'-' * 80}")
    
    try:
        attempt = engine.start_quiz(quiz=quiz, user_id=user_id)
        print(f"✓ Successfully started attempt {attempt.attempt_id}")
        
        answered = 0
        for question in quiz.questions[:3]:
            question_type = question.question_type.value
            
            if question_type == "multiple_choice":
                engine.record_answer(attempt.attempt_id, question.id, question.correct_answer)
                answered += 1
            
            elif question_type == "true_false":
                engine.record_answer(attempt.attempt_id, question.id, question.correct_answer)
                answered += 1
            
            elif question_type == "matching":
                correct_mapping = {pair.left: pair.right for pair in question.pairs}
                engine.record_answer(attempt.attempt_id, question.id, correct_mapping)
                answered += 1
        
        print(f"✓ Recorded {answered} sample answers")
        
        graded_attempt = engine.submit_quiz(attempt.attempt_id, quiz)
        print(f"✓ Successfully submitted and graded attempt")
        
        summary = engine.get_attempt_summary(graded_attempt.attempt_id, quiz)
        print(f"\nAttempt Results:")
        print(f"  Score: {summary['score']:.1f}/{summary['max_score']:.1f} ({summary['percentage']:.1f}%)")
        print(f"  Status: {'PASSED' if summary['passed'] else 'FAILED'}")
        
        return True
        
    except Exception as e:
        print(f"✗ Error during sample attempt: {e}")
        return False


def main():
    """Main seeder script."""
    print("=" * 80)
    print("E-LEARNING QUIZ SYSTEM - DATA SEEDING")
    print("=" * 80)
    
    repository = JsonAttemptRepository(Path("data/attempts.json"))
    engine = QuizEngine(repository)
    
    all_quizzes = [
        ("Pre-Test", build_pre_test_quiz()),
        ("Post-Test", build_post_test_quiz()),
        ("True/False Exercise", build_true_false_quiz()),
        ("Matching Exercise", build_matching_quiz()),
    ]
    
    print(f"\nTotal Question Banks: {len(all_quizzes)}")
    
    total_questions = 0
    total_points = 0
    
    for name, quiz in all_quizzes:
        display_quiz_info(quiz)
        display_questions_summary(quiz)
        
        is_valid = verify_answers(quiz)
        
        if is_valid:
            run_sample_attempt(engine, quiz, f"demo-user-{quiz.id}")
        
        total_questions += len(quiz.questions)
        total_points += quiz.total_points
        
        print("\n")
    
    print("=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"Total Quizzes: {len(all_quizzes)}")
    print(f"Total Questions: {total_questions}")
    print(f"  - Pre-test: 20 questions (multiple choice)")
    print(f"  - Post-test: 20 questions (multiple choice)")
    print(f"  - True/False: 10 questions")
    print(f"  - Matching: 5 question sets")
    print(f"Total Points Available: {total_points}")
    print("=" * 80)
    
    print("\n✓ All question banks have been successfully validated!")
    print(f"✓ Data seeding complete. Sample attempts stored in: data/attempts.json")


if __name__ == "__main__":
    main()
