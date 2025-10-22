<?php

namespace Database\Seeders;

use App\Models\Lesson;
use App\Models\Quiz;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class QuizSeeder extends Seeder
{
    public function run(): void
    {
        Lesson::query()->orderBy('display_order')->get()->each(function (Lesson $lesson) {
            foreach (['pre_test', 'post_test', 'exercise'] as $type) {
                $this->seedQuizForLesson($lesson, $type);
            }
        });
    }

    protected function seedQuizForLesson(Lesson $lesson, string $type): void
    {
        $quiz = Quiz::query()->updateOrCreate(
            [
                'lesson_id' => $lesson->id,
                'type' => $type,
            ],
            [
                'title' => $this->quizTitle($lesson, $type),
                'description' => $this->quizDescription($lesson, $type),
                'time_limit_minutes' => 20,
                'passing_score' => 70,
                'max_attempts' => $type === 'exercise' ? null : 3,
                'is_active' => true,
            ]
        );

        $questions = $this->questionTemplates($lesson, $type);

        foreach ($questions as $index => $questionData) {
            $question = $quiz->questions()->updateOrCreate(
                [
                    'question_text' => $questionData['question_text'],
                ],
                [
                    'explanation' => $questionData['explanation'] ?? null,
                    'question_type' => $questionData['question_type'] ?? 'multiple_choice',
                    'points' => $questionData['points'] ?? 1,
                    'display_order' => $index + 1,
                ]
            );

            foreach ($questionData['options'] as $optionIndex => $optionData) {
                $question->options()->updateOrCreate(
                    [
                        'option_text' => $optionData['option_text'],
                    ],
                    [
                        'is_correct' => $optionData['is_correct'],
                        'explanation' => $optionData['explanation'] ?? null,
                        'display_order' => $optionIndex + 1,
                    ]
                );
            }
        }
    }

    protected function quizTitle(Lesson $lesson, string $type): string
    {
        return match ($type) {
            'pre_test' => 'Pre-test: ' . $lesson->title,
            'post_test' => 'Post-test: ' . $lesson->title,
            'exercise' => 'Practice Quiz: ' . $lesson->title,
            default => Str::headline($type) . ' - ' . $lesson->title,
        };
    }

    protected function quizDescription(Lesson $lesson, string $type): string
    {
        $summary = Str::words($lesson->description ?? $lesson->title, 16, '...');

        return match ($type) {
            'pre_test' => "Benchmark your current understanding before diving into {$lesson->title}.",
            'post_test' => "Validate mastery of {$lesson->title} with a final challenge.",
            'exercise' => "Reinforce the key concepts from {$lesson->title} through applied practice.",
            default => $summary,
        };
    }

    protected function questionTemplates(Lesson $lesson, string $type): array
    {
        return match ($type) {
            'pre_test' => $this->preTestQuestions($lesson),
            'post_test' => $this->postTestQuestions($lesson),
            'exercise' => $this->exerciseQuestions($lesson),
            default => [],
        };
    }

    protected function preTestQuestions(Lesson $lesson): array
    {
        $summary = Str::words($lesson->description ?? $lesson->title, 12, '...');

        return [
            [
                'question_text' => "Which statement best summarises the focus of \"{$lesson->title}\"?",
                'explanation' => 'The pre-test checks that learners recognise the main objective of the lesson.',
                'options' => [
                    [
                        'option_text' => $summary,
                        'is_correct' => true,
                    ],
                    [
                        'option_text' => 'Learning about HTML tags and CSS selectors.',
                        'is_correct' => false,
                    ],
                    [
                        'option_text' => 'Practising spreadsheet formulas in Excel.',
                        'is_correct' => false,
                    ],
                    [
                        'option_text' => 'Configuring network routers and firewalls.',
                        'is_correct' => false,
                    ],
                ],
            ],
            [
                'question_text' => 'Which of the following commands runs a Python script from the terminal?',
                'explanation' => 'Scripts are executed by calling the python interpreter followed by the filename.',
                'options' => [
                    [
                        'option_text' => 'python script.py',
                        'is_correct' => true,
                    ],
                    [
                        'option_text' => 'node script.py',
                        'is_correct' => false,
                    ],
                    [
                        'option_text' => 'ruby script.py',
                        'is_correct' => false,
                    ],
                    [
                        'option_text' => 'bash run script.py',
                        'is_correct' => false,
                    ],
                ],
            ],
            [
                'question_text' => 'What is the official file extension for Python source files?',
                'explanation' => 'Python source files use the .py extension.',
                'options' => [
                    [
                        'option_text' => '.py',
                        'is_correct' => true,
                    ],
                    [
                        'option_text' => '.python',
                        'is_correct' => false,
                    ],
                    [
                        'option_text' => '.pt',
                        'is_correct' => false,
                    ],
                    [
                        'option_text' => '.exe',
                        'is_correct' => false,
                    ],
                ],
            ],
        ];
    }

    protected function postTestQuestions(Lesson $lesson): array
    {
        return [
            [
                'question_text' => 'Which keyword is used to define a function in Python?',
                'explanation' => 'Functions begin with the def keyword.',
                'options' => [
                    [
                        'option_text' => 'def',
                        'is_correct' => true,
                    ],
                    [
                        'option_text' => 'function',
                        'is_correct' => false,
                    ],
                    [
                        'option_text' => 'lambda',
                        'is_correct' => false,
                    ],
                    [
                        'option_text' => 'func',
                        'is_correct' => false,
                    ],
                ],
            ],
            [
                'question_text' => 'What is the output of len({"lesson": "Python", "level": 3})?',
                'explanation' => 'len on a dictionary returns the number of key/value pairs.',
                'options' => [
                    [
                        'option_text' => '1',
                        'is_correct' => false,
                    ],
                    [
                        'option_text' => '2',
                        'is_correct' => true,
                    ],
                    [
                        'option_text' => '3',
                        'is_correct' => false,
                    ],
                    [
                        'option_text' => 'Raises a TypeError',
                        'is_correct' => false,
                    ],
                ],
            ],
            [
                'question_text' => 'Which data structure preserves insertion order and allows duplicate values?',
                'explanation' => 'Lists keep insertion order and accept duplicates, unlike sets.',
                'options' => [
                    [
                        'option_text' => 'List',
                        'is_correct' => true,
                    ],
                    [
                        'option_text' => 'Set',
                        'is_correct' => false,
                    ],
                    [
                        'option_text' => 'Dictionary keys',
                        'is_correct' => false,
                    ],
                    [
                        'option_text' => 'Tuple indices',
                        'is_correct' => false,
                    ],
                ],
            ],
        ];
    }

    protected function exerciseQuestions(Lesson $lesson): array
    {
        $title = Str::headline($lesson->title);

        return [
            [
                'question_text' => "In the context of {$title}, which approach best helps apply the concepts hands-on?",
                'explanation' => 'Practice quizzes reinforce the exact subject matter covered in the lesson.',
                'options' => [
                    [
                        'option_text' => 'Build a mini project or script that utilises the lesson concepts.',
                        'is_correct' => true,
                        'explanation' => 'Practical projects solidify knowledge from the lesson.',
                    ],
                    [
                        'option_text' => 'Memorise the Python language reference end-to-end.',
                        'is_correct' => false,
                    ],
                    [
                        'option_text' => 'Only read discussion forums without writing code.',
                        'is_correct' => false,
                    ],
                    [
                        'option_text' => 'Switch to learning an unrelated programming language.',
                        'is_correct' => false,
                    ],
                ],
            ],
            [
                'question_text' => 'Which built-in function can help you inspect runtime values while practising?',
                'explanation' => 'print is a common and effective debugging helper.',
                'options' => [
                    [
                        'option_text' => 'print()',
                        'is_correct' => true,
                    ],
                    [
                        'option_text' => 'trace()',
                        'is_correct' => false,
                    ],
                    [
                        'option_text' => 'inspect()',
                        'is_correct' => false,
                    ],
                    [
                        'option_text' => 'watch()',
                        'is_correct' => false,
                    ],
                ],
            ],
            [
                'question_text' => 'When stuck on a coding exercise, what is a productive next step?',
                'explanation' => 'Breaking concepts down and reviewing the relevant lesson section helps reinforce understanding.',
                'options' => [
                    [
                        'option_text' => 'Revisit the relevant section and break the problem into smaller parts.',
                        'is_correct' => true,
                    ],
                    [
                        'option_text' => 'Quit immediately and never revisit the exercise.',
                        'is_correct' => false,
                    ],
                    [
                        'option_text' => 'Randomly copy and paste code without understanding it.',
                        'is_correct' => false,
                    ],
                    [
                        'option_text' => 'Ignore errors and submit the incomplete solution.',
                        'is_correct' => false,
                    ],
                ],
            ],
        ];
    }
}
