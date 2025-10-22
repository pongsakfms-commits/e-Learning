<?php

namespace Database\Seeders;

use App\Models\Lesson;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class LessonSeeder extends Seeder
{
    public function run(): void
    {
        $lessonsData = [
            [
                'title' => 'Introduction to Python',
                'slug' => 'introduction-to-python',
                'description' => 'Get an overview of the Python ecosystem, its history, and why it is a great first language for beginners.',
                'duration_minutes' => 60,
                'level' => 1,
                'sections' => [
                    [
                        'title' => 'Why Python Matters',
                        'summary' => 'Explore the philosophy and strengths of Python.',
                        'content' => 'Python emphasises readability and developer productivity. In this section, learners will understand the guiding principles of the language and where it fits in modern software development.',
                        'video_url' => 'https://videos.example.com/python/intro-why-python',
                        'resources' => [
                            'slides' => 'https://cdn.example.com/slides/python-intro.pdf',
                        ],
                    ],
                    [
                        'title' => 'Setting Up the Environment',
                        'summary' => 'Install Python and choose an editor.',
                        'content' => 'Walk through installing Python via python.org, choosing an IDE such as VS Code, and verifying the installation on different operating systems.',
                        'video_url' => 'https://videos.example.com/python/setup-environment',
                        'resources' => [
                            'checklist' => 'https://cdn.example.com/resources/python-setup-checklist.txt',
                        ],
                    ],
                    [
                        'title' => 'Running Your First Script',
                        'summary' => 'Write and execute a simple Python program.',
                        'content' => 'Learners will write the classic "Hello, World!" program, understand how the interpreter executes code, and explore running scripts from the command line.',
                        'video_url' => 'https://videos.example.com/python/first-script',
                        'resources' => [
                            'code_sample' => 'https://cdn.example.com/code/python-hello.py',
                        ],
                    ],
                ],
            ],
            [
                'title' => 'Variables and Data Types',
                'slug' => 'variables-and-data-types',
                'description' => 'Understand how to store information in Python using the built-in data types.',
                'duration_minutes' => 75,
                'level' => 1,
                'sections' => [
                    [
                        'title' => 'Variable Basics',
                        'summary' => 'Learn declaration rules and naming conventions.',
                        'content' => 'Python variables are dynamically typed. This section covers assignment semantics, naming best practices, and the concept of mutability.',
                        'video_url' => 'https://videos.example.com/python/variables-basics',
                        'resources' => [
                            'cheatsheet' => 'https://cdn.example.com/resources/python-variables.pdf',
                        ],
                    ],
                    [
                        'title' => 'Numeric Types',
                        'summary' => 'Work with integers, floats, and complex numbers.',
                        'content' => 'Dive into performing arithmetic, type conversion, and using the decimal module for precise calculations.',
                        'video_url' => 'https://videos.example.com/python/numeric-types',
                        'resources' => [
                            'exercises' => 'https://cdn.example.com/resources/python-numeric-exercises.zip',
                        ],
                    ],
                    [
                        'title' => 'Collections Overview',
                        'summary' => 'Lists, tuples, sets, and dictionaries.',
                        'content' => 'Compare the core collection types, their use cases, and how to choose the right one for a given problem.',
                        'video_url' => 'https://videos.example.com/python/collections-overview',
                        'resources' => [
                            'reference' => 'https://cdn.example.com/resources/python-collections.html',
                        ],
                    ],
                ],
            ],
            [
                'title' => 'Control Flow',
                'slug' => 'control-flow',
                'description' => 'Master conditional logic and loops to build interactive programs.',
                'duration_minutes' => 80,
                'level' => 2,
                'sections' => [
                    [
                        'title' => 'Conditional Statements',
                        'summary' => 'if, elif, and else usage.',
                        'content' => 'This section highlights branching logic patterns, truthy and falsy evaluation, and nested conditions.',
                        'video_url' => 'https://videos.example.com/python/control-flow-conditionals',
                        'resources' => [
                            'coding_challenge' => 'https://cdn.example.com/resources/python-conditional-challenges.pdf',
                        ],
                    ],
                    [
                        'title' => 'Loops and Iteration',
                        'summary' => 'for and while loops in depth.',
                        'content' => 'Learn when to choose each loop type, iterate over different collection types, and use the range function effectively.',
                        'video_url' => 'https://videos.example.com/python/control-flow-loops',
                        'resources' => [
                            'sample_notebook' => 'https://cdn.example.com/resources/python-loops.ipynb',
                        ],
                    ],
                    [
                        'title' => 'Comprehensions and Itertools',
                        'summary' => 'Expressive data transformations in Python.',
                        'content' => 'Explore list, set, and dictionary comprehensions along with the itertools module to write concise iteration patterns.',
                        'video_url' => 'https://videos.example.com/python/control-flow-comprehensions',
                        'resources' => [
                            'reference' => 'https://cdn.example.com/resources/python-itertools.pdf',
                        ],
                    ],
                ],
            ],
            [
                'title' => 'Functions',
                'slug' => 'functions',
                'description' => 'Encapsulate logic with reusable and testable functions.',
                'duration_minutes' => 90,
                'level' => 2,
                'sections' => [
                    [
                        'title' => 'Defining Functions',
                        'summary' => 'Learn parameters, return values, and scope.',
                        'content' => 'Understand function signatures, default parameters, and the importance of documentation strings.',
                        'video_url' => 'https://videos.example.com/python/functions-defining',
                        'resources' => [
                            'style_guide' => 'https://cdn.example.com/resources/python-function-style-guide.pdf',
                        ],
                    ],
                    [
                        'title' => 'Higher-Order Functions',
                        'summary' => 'Passing functions as arguments.',
                        'content' => 'Cover lambda expressions, map/filter/reduce, and practical examples for data transformations.',
                        'video_url' => 'https://videos.example.com/python/functions-higher-order',
                        'resources' => [
                            'cheatsheet' => 'https://cdn.example.com/resources/python-hof.pdf',
                        ],
                    ],
                    [
                        'title' => 'Decorators and Closures',
                        'summary' => 'Enhance behaviour with decorators.',
                        'content' => 'Learn how closures capture state and how decorators can add cross-cutting functionality such as logging.',
                        'video_url' => 'https://videos.example.com/python/functions-decorators',
                        'resources' => [
                            'code_examples' => 'https://cdn.example.com/resources/python-decorators.zip',
                        ],
                    ],
                ],
            ],
            [
                'title' => 'Modules and Packages',
                'slug' => 'modules-and-packages',
                'description' => 'Structure large Python applications and reuse code effectively.',
                'duration_minutes' => 70,
                'level' => 2,
                'sections' => [
                    [
                        'title' => 'Creating Modules',
                        'summary' => 'Organise code into files and directories.',
                        'content' => 'Discuss the module search path, __init__.py files, and Python package management best practices.',
                        'video_url' => 'https://videos.example.com/python/modules-creating',
                        'resources' => [
                            'reference' => 'https://cdn.example.com/resources/python-packaging.pdf',
                        ],
                    ],
                    [
                        'title' => 'Standard Library Tour',
                        'summary' => 'Explore essential batteries-included modules.',
                        'content' => 'Highlight modules such as pathlib, datetime, json, and collections with hands-on examples.',
                        'video_url' => 'https://videos.example.com/python/modules-stdlib',
                        'resources' => [
                            'cheatsheet' => 'https://cdn.example.com/resources/python-stdlib-cheatsheet.pdf',
                        ],
                    ],
                    [
                        'title' => 'Managing Dependencies',
                        'summary' => 'Use pip and virtual environments responsibly.',
                        'content' => 'Learn how to create and manage virtual environments, pin dependencies, and publish packages.',
                        'video_url' => 'https://videos.example.com/python/modules-dependencies',
                        'resources' => [
                            'guide' => 'https://cdn.example.com/resources/python-venv-guide.html',
                        ],
                    ],
                ],
            ],
            [
                'title' => 'File Handling',
                'slug' => 'file-handling',
                'description' => 'Read, write, and manipulate files with Python safely.',
                'duration_minutes' => 75,
                'level' => 3,
                'sections' => [
                    [
                        'title' => 'Working with Text Files',
                        'summary' => 'Open, read, and write files.',
                        'content' => 'Cover file modes, context managers, and encoding best practices.',
                        'video_url' => 'https://videos.example.com/python/files-text',
                        'resources' => [
                            'starter_files' => 'https://cdn.example.com/resources/python-text-files.zip',
                        ],
                    ],
                    [
                        'title' => 'CSV and JSON',
                        'summary' => 'Handle structured data formats.',
                        'content' => 'Use the csv and json modules to parse, transform, and persist structured data.',
                        'video_url' => 'https://videos.example.com/python/files-structured-data',
                        'resources' => [
                            'datasets' => 'https://cdn.example.com/resources/python-data-samples.zip',
                        ],
                    ],
                    [
                        'title' => 'Error Handling in IO',
                        'summary' => 'Gracefully recover from file errors.',
                        'content' => 'Implement try/except blocks, custom exceptions, and logging strategies when interacting with the filesystem.',
                        'video_url' => 'https://videos.example.com/python/files-error-handling',
                        'resources' => [
                            'reference' => 'https://cdn.example.com/resources/python-io-errors.pdf',
                        ],
                    ],
                ],
            ],
            [
                'title' => 'Object-Oriented Programming',
                'slug' => 'object-oriented-programming',
                'description' => 'Design reusable classes and understand Python OOP features.',
                'duration_minutes' => 100,
                'level' => 3,
                'sections' => [
                    [
                        'title' => 'Classes and Instances',
                        'summary' => 'Define classes and instantiate objects.',
                        'content' => 'Introduce class syntax, attributes, and methods with practical examples.',
                        'video_url' => 'https://videos.example.com/python/oop-classes',
                        'resources' => [
                            'worksheet' => 'https://cdn.example.com/resources/python-oop-classes.pdf',
                        ],
                    ],
                    [
                        'title' => 'Inheritance and Polymorphism',
                        'summary' => 'Reuse behaviour with inheritance.',
                        'content' => 'Explore base and derived classes, method overriding, and the super() function.',
                        'video_url' => 'https://videos.example.com/python/oop-inheritance',
                        'resources' => [
                            'exercises' => 'https://cdn.example.com/resources/python-oop-inheritance.zip',
                        ],
                    ],
                    [
                        'title' => 'Dataclasses and Protocols',
                        'summary' => 'Modern OOP tooling in Python.',
                        'content' => 'Use dataclasses for lightweight data containers and typing.Protocol for structural subtyping.',
                        'video_url' => 'https://videos.example.com/python/oop-dataclasses',
                        'resources' => [
                            'reference' => 'https://cdn.example.com/resources/python-dataclasses.pdf',
                        ],
                    ],
                ],
            ],
            [
                'title' => 'Error Handling and Debugging',
                'slug' => 'error-handling-and-debugging',
                'description' => 'Build resilient programs by anticipating and fixing issues.',
                'duration_minutes' => 65,
                'level' => 3,
                'sections' => [
                    [
                        'title' => 'Exception Hierarchy',
                        'summary' => 'Understand Python exceptions.',
                        'content' => 'Survey built-in exceptions, when to raise custom ones, and best practices for error messages.',
                        'video_url' => 'https://videos.example.com/python/errors-exceptions',
                        'resources' => [
                            'diagram' => 'https://cdn.example.com/resources/python-exception-map.png',
                        ],
                    ],
                    [
                        'title' => 'Debugging Techniques',
                        'summary' => 'Use debugging tools effectively.',
                        'content' => 'Leverage print debugging, logging, and the pdb module to trace execution.',
                        'video_url' => 'https://videos.example.com/python/errors-debugging',
                        'resources' => [
                            'cheatsheet' => 'https://cdn.example.com/resources/python-debugging.pdf',
                        ],
                    ],
                    [
                        'title' => 'Testing Foundations',
                        'summary' => 'Write unit tests with pytest.',
                        'content' => 'Introduce the Arrange-Act-Assert pattern, fixtures, and how testing fits into debugging workflows.',
                        'video_url' => 'https://videos.example.com/python/errors-testing',
                        'resources' => [
                            'starter_repo' => 'https://cdn.example.com/resources/python-testing-starter.zip',
                        ],
                    ],
                ],
            ],
            [
                'title' => 'Advanced Topics and Best Practices',
                'slug' => 'advanced-topics-and-best-practices',
                'description' => 'Go beyond the basics with performance tips and best practices.',
                'duration_minutes' => 120,
                'level' => 4,
                'sections' => [
                    [
                        'title' => 'Asynchronous Programming',
                        'summary' => 'Asyncio fundamentals.',
                        'content' => 'Discover the event loop, coroutines, and async/await syntax with live coding examples.',
                        'video_url' => 'https://videos.example.com/python/advanced-async',
                        'resources' => [
                            'code_samples' => 'https://cdn.example.com/resources/python-async.zip',
                        ],
                    ],
                    [
                        'title' => 'Performance Optimisation',
                        'summary' => 'Profile and speed up Python programs.',
                        'content' => 'Use tools like cProfile, line_profiler, and caching strategies to improve performance.',
                        'video_url' => 'https://videos.example.com/python/advanced-performance',
                        'resources' => [
                            'worksheet' => 'https://cdn.example.com/resources/python-performance.pdf',
                        ],
                    ],
                    [
                        'title' => 'Best Practices Checklist',
                        'summary' => 'Review code style and project hygiene.',
                        'content' => 'Summarise PEP 8 guidelines, documentation standards, and collaborative workflows.',
                        'video_url' => 'https://videos.example.com/python/advanced-best-practices',
                        'resources' => [
                            'checklist' => 'https://cdn.example.com/resources/python-best-practices-checklist.pdf',
                        ],
                    ],
                ],
            ],
        ];

        $previousLesson = null;

        foreach ($lessonsData as $index => $lessonData) {
            $sections = $lessonData['sections'];
            unset($lessonData['sections']);

            $lesson = Lesson::query()->updateOrCreate(
                ['slug' => $lessonData['slug']],
                array_merge($lessonData, [
                    'display_order' => $index + 1,
                    'prerequisite_lesson_id' => $previousLesson?->id,
                    'is_active' => true,
                ])
            );

            foreach ($sections as $sectionIndex => $sectionData) {
                $lesson->sections()->updateOrCreate(
                    [
                        'lesson_id' => $lesson->id,
                        'title' => $sectionData['title'],
                    ],
                    array_merge($sectionData, [
                        'display_order' => $sectionIndex + 1,
                    ])
                );
            }

            $previousLesson = $lesson;
        }
    }
}
