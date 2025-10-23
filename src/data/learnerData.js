// Mock data for learner dashboard
// In production, this would connect to a real database

export const learnerData = {
  id: 'L001',
  name: 'สมชาย มั่นคง',
  email: 'somchai@example.com',
  lastLogin: '2024-03-10T09:45:00+07:00',
  defaultPassScore: 60,
  recommendedProgressThreshold: 70,
  enrolledCourses: [
    {
      id: 'C001',
      title: 'Introduction to JavaScript',
      progress: 75,
      status: 'in-progress',
      enrolledDate: '2024-01-15',
      lastAccessed: '2024-03-10',
      instructor: 'อาจารย์วิชัย'
    },
    {
      id: 'C002',
      title: 'Web Development Fundamentals',
      progress: 100,
      status: 'completed',
      enrolledDate: '2024-01-10',
      lastAccessed: '2024-02-28',
      instructor: 'อาจารย์สมหญิง'
    },
    {
      id: 'C003',
      title: 'Database Design',
      progress: 45,
      status: 'in-progress',
      enrolledDate: '2024-02-01',
      lastAccessed: '2024-03-08',
      instructor: 'อาจารย์ประสิทธิ์'
    }
  ],
  testHistory: [
    {
      id: 'T001',
      courseId: 'C002',
      courseName: 'Web Development Fundamentals',
      testName: 'Final Exam',
      date: '2024-02-28',
      score: 85,
      maxScore: 100,
      passingScore: 70,
      passed: true,
      duration: 60,
      hasPdf: true,
      pdfUrl: '/api/download-result/T001'
    },
    {
      id: 'T002',
      courseId: 'C001',
      courseName: 'Introduction to JavaScript',
      testName: 'Mid-term Quiz',
      date: '2024-02-15',
      score: 72,
      maxScore: 100,
      passingScore: 60,
      passed: true,
      duration: 30,
      hasPdf: true,
      pdfUrl: '/api/download-result/T002'
    },
    {
      id: 'T003',
      courseId: 'C003',
      courseName: 'Database Design',
      testName: 'Quiz 1',
      date: '2024-02-20',
      score: 55,
      maxScore: 100,
      passingScore: 60,
      passed: false,
      duration: 20,
      hasPdf: false,
      pdfUrl: null
    },
    {
      id: 'T004',
      courseId: 'C001',
      courseName: 'Introduction to JavaScript',
      testName: 'Quiz 2',
      date: '2024-03-05',
      score: 90,
      maxScore: 100,
      passingScore: 60,
      passed: true,
      duration: 20,
      hasPdf: true,
      pdfUrl: '/api/download-result/T004'
    }
  ]
};

export function getLearnerSummary() {
  const sortedTests = [...learnerData.testHistory].sort((a, b) => new Date(b.date) - new Date(a.date));

  const latestTest = sortedTests[0] ?? null;

  const totalCourses = learnerData.enrolledCourses.length;
  const completedCourses = learnerData.enrolledCourses.filter(c => c.status === 'completed').length;
  const inProgressCourses = learnerData.enrolledCourses.filter(c => c.status === 'in-progress').length;

  const totalTests = sortedTests.length;
  const passedTests = sortedTests.filter(t => t.passed).length;
  const failedTests = sortedTests.filter(t => !t.passed).length;

  const latestScore = latestTest ? latestTest.score : null;
  const averageScore = totalTests > 0
    ? Math.round(sortedTests.reduce((sum, t) => sum + t.score, 0) / totalTests)
    : 0;

  const coursesWithExamStatus = learnerData.enrolledCourses.map(course => {
    const courseTests = sortedTests.filter(test => test.courseId === course.id);
    const courseLatestTest = courseTests[0] ?? null;

    const examStatus = courseLatestTest
      ? (courseLatestTest.passed ? 'passed' : 'failed')
      : 'upcoming';

    return {
      ...course,
      examStatus,
      latestScore: courseLatestTest ? courseLatestTest.score : null,
      passingScore: courseLatestTest ? courseLatestTest.passingScore : learnerData.defaultPassScore,
      totalTests: courseTests.length,
      passedTests: courseTests.filter(t => t.passed).length,
      lastTestDate: courseLatestTest ? courseLatestTest.date : null
    };
  });

  return {
    learner: {
      id: learnerData.id,
      name: learnerData.name,
      email: learnerData.email,
      lastLogin: learnerData.lastLogin
    },
    summary: {
      totalCourses,
      completedCourses,
      inProgressCourses,
      totalTests,
      passedTests,
      failedTests,
      latestScore,
      latestTest,
      averageScore,
      defaultPassScore: learnerData.defaultPassScore,
      recommendedProgressThreshold: learnerData.recommendedProgressThreshold
    },
    courses: coursesWithExamStatus,
    recentTests: sortedTests.slice(0, 3)
  };
}

export function getTestHistory() {
  return [...learnerData.testHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getTestById(testId) {
  return learnerData.testHistory.find(t => t.id === testId);
}

export function getRecommendations() {
  const failedTests = learnerData.testHistory.filter(t => !t.passed);
  const recommendations = [];

  if (failedTests.length > 0) {
    failedTests.forEach(test => {
      recommendations.push({
        type: 'improvement',
        priority: 'high',
        message: `ควรทบทวนเนื้อหาวิชา "${test.courseName}" อีกครั้ง คะแนน ${test.score} ต่ำกว่าเกณฑ์ผ่าน (${test.passingScore})`,
        action: `review-course-${test.courseId}`,
        courseId: test.courseId
      });
    });
  }

  const inProgressCourses = learnerData.enrolledCourses.filter(c => c.status === 'in-progress');
  inProgressCourses.forEach(course => {
    if (course.progress < 50) {
      recommendations.push({
        type: 'progress',
        priority: 'medium',
        message: `คอร์ส "${course.title}" ความคืบหน้า ${course.progress}% ควรเรียนต่อให้มากขึ้น`,
        action: `continue-course-${course.id}`,
        courseId: course.id
      });
    }
  });

  const averageScore = learnerData.testHistory.length > 0
    ? learnerData.testHistory.reduce((sum, t) => sum + t.score, 0) / learnerData.testHistory.length
    : 0;

  if (averageScore >= 80) {
    recommendations.push({
      type: 'achievement',
      priority: 'low',
      message: `เยี่ยมมาก! คะแนนเฉลี่ยของคุณอยู่ที่ ${Math.round(averageScore)} คะแนน ลองท้าทายตัวเองกับคอร์สระดับสูงกว่านี้`,
      action: 'explore-advanced-courses'
    });
  } else if (averageScore < 60) {
    recommendations.push({
      type: 'support',
      priority: 'high',
      message: 'คะแนนเฉลี่ยต่ำกว่าเกณฑ์ ควรติดต่ออาจารย์ผู้สอนหรือขอความช่วยเหลือเพิ่มเติม',
      action: 'contact-support'
    });
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}
