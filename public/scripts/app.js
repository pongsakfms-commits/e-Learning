const API_BASE_URL = window.location.origin;

let dashboardData = null;
let currentCourseFilter = 'all';
let currentHistoryFilter = 'all';

async function fetchDashboardData() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/learner-dashboard`);
    if (!response.ok) {
      throw new Error('ไม่สามารถโหลดข้อมูลได้');
    }
    dashboardData = await response.json();
    renderDashboard();
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    showError('เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง');
  }
}

function renderDashboard() {
  if (!dashboardData) return;

  renderSummary();
  renderLatestScore();
  renderLatestTests();
  renderCourses();
  renderRecommendations();
  renderTestHistory();
  setupEventListeners();
  updateFooter();
}

function renderSummary() {
  const { summary: metrics, learner } = dashboardData.summary;

  document.getElementById('learnerName').textContent = learner.name;
  document.getElementById('navLearnerName').textContent = learner.name;

  const avatar = document.querySelector('.avatar');
  if (avatar) {
    const initials = learner.name
      .split(' ')
      .filter(Boolean)
      .map(word => word[0])
      .join('')
      .toUpperCase();
    avatar.textContent = initials;
  }

  const lastLoginElement = document.getElementById('lastLogin');
  if (lastLoginElement) {
    if (learner.lastLogin) {
      const lastLoginDate = new Date(learner.lastLogin);
      lastLoginElement.textContent = lastLoginDate.toLocaleString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      lastLoginElement.setAttribute('datetime', lastLoginDate.toISOString());
    } else {
      lastLoginElement.textContent = 'ยังไม่มีข้อมูล';
    }
  }

  const summaryCards = [
    {
      icon: '📚',
      label: 'คอร์สทั้งหมด',
      value: metrics.totalCourses,
      subtitle: `${metrics.inProgressCourses} กำลังเรียน, ${metrics.completedCourses} เรียนจบ`
    },
    {
      icon: '📝',
      label: 'แบบทดสอบทั้งหมด',
      value: metrics.totalTests,
      subtitle: `${metrics.passedTests} ผ่าน, ${metrics.failedTests} ไม่ผ่าน`
    },
    {
      icon: '📊',
      label: 'คะแนนเฉลี่ย',
      value: metrics.averageScore,
      subtitle: 'จากทุกแบบทดสอบ'
    },
    {
      icon: '✅',
      label: 'แบบทดสอบที่ผ่าน',
      value: metrics.passedTests,
      subtitle: `อัตราการผ่าน ${metrics.totalTests > 0 ? Math.round((metrics.passedTests / metrics.totalTests) * 100) : 0}%`
    }
  ];

  const summaryContainer = document.getElementById('summaryCards');
  summaryContainer.innerHTML = summaryCards
    .map(
      card => `
    <div class="summary-card" role="listitem">
      <div class="summary-card-label">
        <span aria-hidden="true">${card.icon}</span>
        <span>${card.label}</span>
      </div>
      <div class="summary-card-value">${card.value}</div>
      <div class="summary-card-subtitle">${card.subtitle}</div>
    </div>
  `
    )
    .join('');
}

function renderLatestScore() {
  const { summary: metrics } = dashboardData.summary;

  const latestScoreElement = document.getElementById('latestScore');
  if (!latestScoreElement) return;

  const scoreValueElement = latestScoreElement.querySelector('.score-value');
  const scoreStatusElement = latestScoreElement.querySelector('.score-status');
  const scoreMessageElement = latestScoreElement.querySelector('.score-message');

  if (metrics.latestScore !== null) {
    scoreValueElement.textContent = metrics.latestScore;
    
    if (metrics.latestScore >= 80) {
      scoreStatusElement.textContent = 'ยอดเยี่ยม!';
      scoreMessageElement.textContent = 'คะแนนของคุณอยู่ในระดับดีเยี่ยม เก่งมาก!';
    } else if (metrics.latestScore >= 70) {
      scoreStatusElement.textContent = 'ดีมาก';
      scoreMessageElement.textContent = 'คะแนนของคุณอยู่ในระดับดี ทำได้ดีแล้ว!';
    } else if (metrics.latestScore >= 60) {
      scoreStatusElement.textContent = 'ผ่านเกณฑ์';
      scoreMessageElement.textContent = 'ผ่านแล้ว แต่ยังมีโอกาสพัฒนาได้อีก';
    } else {
      scoreStatusElement.textContent = 'ต้องปรับปรุง';
      scoreMessageElement.textContent = 'ต่ำกว่าเกณฑ์ ควรทบทวนเนื้อหาและลองใหม่';
    }
  } else {
    scoreValueElement.textContent = '-';
    scoreStatusElement.textContent = 'ยังไม่มีข้อมูล';
    scoreMessageElement.textContent = 'รอการทำแบบทดสอบครั้งแรก';
  }
}

function renderLatestTests() {
  const { recentTests } = dashboardData.summary;

  const latestTestsList = document.getElementById('latestTestsList');
  if (!latestTestsList) return;

  if (recentTests.length === 0) {
    latestTestsList.innerHTML = '<li class="empty-state">ยังไม่มีประวัติการทำแบบทดสอบ</li>';
    return;
  }

  latestTestsList.innerHTML = recentTests
    .map(
      test => `
    <li class="latest-test-item">
      <div class="latest-test-info">
        <span class="latest-test-name">${test.testName}</span>
        <span class="latest-test-course">${test.courseName}</span>
        <span class="latest-test-date">${formatDate(test.date)}</span>
      </div>
      <span class="latest-test-score ${test.passed ? 'passed' : 'failed'}">
        ${test.score}/${test.maxScore}
      </span>
    </li>
  `
    )
    .join('');
}

function renderCourses() {
  const { courses } = dashboardData.summary;

  const courseList = document.getElementById('courseList');
  if (!courseList) return;

  const filteredCourses = courses.filter(course => {
    if (currentCourseFilter === 'all') return true;
    return course.status === currentCourseFilter;
  });

  if (filteredCourses.length === 0) {
    courseList.innerHTML = '<div class="empty-state">ไม่พบคอร์สที่ตรงตามเงื่อนไข</div>';
    return;
  }

  courseList.innerHTML = filteredCourses
    .map(
      course => {
        const examStatusText = course.examStatus === 'passed'
          ? '✅ ผ่านแบบทดสอบ'
          : course.examStatus === 'failed'
          ? '❌ ไม่ผ่านแบบทดสอบ'
          : '⏳ ยังไม่มีแบบทดสอบ';

        const examStatusClass = course.examStatus === 'passed'
          ? 'text-success'
          : course.examStatus === 'failed'
          ? 'text-danger'
          : 'text-secondary';

        return `
    <div class="course-card" data-status="${course.status}">
      <div class="course-card-header">
        <div>
          <h3 class="course-title">${course.title}</h3>
          <p class="course-instructor">${course.instructor}</p>
        </div>
        <span class="course-status-badge ${course.status}">
          ${course.status === 'in-progress' ? 'กำลังเรียน' : 'เรียนจบ'}
        </span>
      </div>
      <div class="course-progress">
        <div class="progress-label">
          <span>ความคืบหน้า</span>
          <span><strong>${course.progress}%</strong></span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${course.progress}%"></div>
        </div>
      </div>
      <div class="course-exam-status ${examStatusClass}">
        <span>${examStatusText}</span>
        ${course.latestScore !== null ? `<span class="course-latest-score">${course.latestScore}/${course.passingScore}</span>` : ''}
      </div>
      <div class="course-meta">
        <span>📅 ลงทะเบียน: ${formatDate(course.enrolledDate)}</span>
        <span>🕒 เข้าสู่ระบบล่าสุด: ${formatDate(course.lastAccessed)}</span>
      </div>
    </div>
  `;
      }
    )
    .join('');
}

function renderRecommendations() {
  const recommendations = dashboardData.recommendations;
  const { summary: metrics } = dashboardData.summary;

  const recommendationsList = document.getElementById('recommendationsList');
  const defaultPassScoreElement = document.getElementById('defaultPassScore');
  const progressThresholdElement = document.getElementById('progressThreshold');

  if (defaultPassScoreElement) {
    defaultPassScoreElement.textContent = metrics.defaultPassScore || 60;
  }

  if (progressThresholdElement) {
    progressThresholdElement.textContent = `≥ ${metrics.recommendedProgressThreshold || 70}% ความคืบหน้า`;
  }

  if (!recommendationsList) return;

  if (recommendations.length === 0) {
    recommendationsList.innerHTML = `
      <div class="recommendation-card low" role="listitem">
        <div class="recommendation-icon" aria-hidden="true">🎉</div>
        <div class="recommendation-content">
          <div class="recommendation-type">ยินดีด้วย</div>
          <div class="recommendation-message">
            คุณทำได้ดีมาก! ไม่มีคำแนะนำเพิ่มเติมในขณะนี้ เดินหน้าต่อไป!
          </div>
        </div>
      </div>
    `;
    return;
  }

  const typeIcons = {
    improvement: '📈',
    progress: '⏱️',
    achievement: '🏆',
    support: '🤝'
  };

  recommendationsList.innerHTML = recommendations
    .map(
      rec => `
    <div class="recommendation-card ${rec.priority}" role="listitem">
      <div class="recommendation-icon" aria-hidden="true">
        ${typeIcons[rec.type] || '💡'}
      </div>
      <div class="recommendation-content">
        <div class="recommendation-type">${rec.priority === 'high' ? 'สำคัญมาก' : rec.priority === 'medium' ? 'ปานกลาง' : 'แนะนำ'}</div>
        <div class="recommendation-message">${rec.message}</div>
        <button class="recommendation-action" data-action="${rec.action}">
          ดำเนินการ
        </button>
      </div>
    </div>
  `
    )
    .join('');
}

function renderTestHistory() {
  const testHistory = dashboardData.testHistory;

  const historyTableBody = document.getElementById('historyTableBody');
  if (!historyTableBody) return;

  const filteredTests = testHistory.filter(test => {
    if (currentHistoryFilter === 'all') return true;
    return test.passed ? currentHistoryFilter === 'passed' : currentHistoryFilter === 'failed';
  });

  if (filteredTests.length === 0) {
    historyTableBody.innerHTML = '<tr><td colspan="6" class="empty-state">ไม่พบประวัติการทำแบบทดสอบที่ตรงเงื่อนไข</td></tr>';
    return;
  }

  historyTableBody.innerHTML = filteredTests
    .map(
      test => `
    <tr>
      <td>${formatDate(test.date)}</td>
      <td>${test.courseName}</td>
      <td>${test.testName}</td>
      <td><strong>${test.score}/${test.maxScore}</strong></td>
      <td>
        <span class="status-badge ${test.passed ? 'passed' : 'failed'}">
          ${test.passed ? '✓ ผ่าน' : '✗ ไม่ผ่าน'}
        </span>
      </td>
      <td>
        ${
          test.hasPdf && test.pdfUrl
            ? `<button class="download-btn" data-test-id="${test.id}" data-pdf-url="${test.pdfUrl}">
                 📥 ดาวน์โหลด PDF
               </button>`
            : '<span style="color: var(--text-secondary); font-size: 0.875rem;">ไม่มีไฟล์</span>'
        }
      </td>
    </tr>
  `
    )
    .join('');
}

function setupEventListeners() {
  // Course filters
  const courseFilterButtons = document.querySelectorAll('.course-filters .chip');
  courseFilterButtons.forEach(button => {
    button.addEventListener('click', () => {
      courseFilterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      currentCourseFilter = button.dataset.filter;
      renderCourses();
    });
  });

  // History filter
  const historyFilter = document.getElementById('historyFilter');
  if (historyFilter) {
    historyFilter.addEventListener('change', e => {
      currentHistoryFilter = e.target.value;
      renderTestHistory();
    });
  }

  // Download buttons
  document.addEventListener('click', e => {
    if (e.target.closest('.download-btn')) {
      const button = e.target.closest('.download-btn');
      const pdfUrl = button.dataset.pdfUrl;
      downloadPDF(pdfUrl);
    }
  });

  // Navigation
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = link.getAttribute('href');
      const section = document.querySelector(target);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });

  // Quick actions
  const quickActions = document.querySelectorAll('.quick-action');
  quickActions.forEach(action => {
    action.addEventListener('click', () => {
      const target = action.dataset.target;
      const section = document.querySelector(target);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Recommendation actions
  document.addEventListener('click', e => {
    if (e.target.closest('.recommendation-action')) {
      const button = e.target.closest('.recommendation-action');
      const action = button.dataset.action;
      handleRecommendationAction(action);
    }
  });
}

function downloadPDF(pdfUrl) {
  if (!pdfUrl) {
    showError('ไม่พบไฟล์ผลการทดสอบสำหรับรายการนี้');
    return;
  }
  const fullUrl = `${API_BASE_URL}${pdfUrl}`;
  window.open(fullUrl, '_blank');
}

function handleRecommendationAction(action) {
  if (action.startsWith('review-course-') || action.startsWith('continue-course-')) {
    const coursesSection = document.querySelector('#courses');
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: 'smooth' });
    }
    alert('จะนำคุณไปยังคอร์สที่เกี่ยวข้อง (ฟีเจอร์นี้จะใช้งานได้เมื่อเชื่อมต่อกับระบบจริง)');
  } else if (action === 'explore-advanced-courses') {
    alert('จะนำคุณไปยังคอร์สขั้นสูง (ฟีเจอร์นี้จะใช้งานได้เมื่อเชื่อมต่อกับระบบจริง)');
  } else if (action === 'contact-support') {
    alert('จะนำคุณไปยังหน้าติดต่อสนับสนุน (ฟีเจอร์นี้จะใช้งานได้เมื่อเชื่อมต่อกับระบบจริง)');
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function updateFooter() {
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

function showError(message) {
  alert(message);
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  fetchDashboardData();
});
