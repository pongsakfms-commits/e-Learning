<?php

namespace Database\Seeders;

use App\Models\Assessment;
use App\Models\AssessmentResult;
use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $users = collect([]);
        for ($i = 1; $i <= 10; $i++) {
            $users->push(User::create([
                'name' => "Student {$i}",
                'email' => "student{$i}@example.com",
                'password' => Hash::make('password'),
            ]));
        }

        $course = Course::create([
            'title' => 'Introduction to Web Development',
            'description' => 'Learn the fundamentals of web development including HTML, CSS, and JavaScript.',
            'instructor' => 'Dr. Jane Smith',
            'duration_hours' => 40,
            'is_active' => true,
        ]);

        $assessment = Assessment::create([
            'course_id' => $course->id,
            'title' => 'Final Examination',
            'description' => 'Comprehensive examination covering all course materials.',
            'total_points' => 100,
            'passing_score' => 70,
            'duration_minutes' => 120,
            'is_active' => true,
        ]);

        foreach ($users as $user) {
            $score = rand(50, 100);
            $percentage = $score;
            
            AssessmentResult::create([
                'assessment_id' => $assessment->id,
                'user_id' => $user->id,
                'score' => $score,
                'total_points' => 100,
                'percentage' => $percentage,
                'passed' => $percentage >= 70,
                'time_spent_minutes' => rand(60, 120),
                'completed_at' => now()->subDays(rand(0, 30)),
            ]);
        }

        Course::create([
            'title' => 'Advanced PHP Programming',
            'description' => 'Master advanced PHP concepts and frameworks.',
            'instructor' => 'Prof. John Doe',
            'duration_hours' => 60,
            'is_active' => true,
        ]);

        Course::create([
            'title' => 'Database Design Fundamentals',
            'description' => 'Learn to design efficient and scalable databases.',
            'instructor' => 'Dr. Sarah Johnson',
            'duration_hours' => 30,
            'is_active' => true,
        ]);
    }
}
