(function () {
    function initFinalProjectPage() {
        const page = document.body?.dataset?.page;
        if (page !== 'final-project') {
            return;
        }

        const courseData = window.pythonCourseData || {};
        const finalProject = courseData.finalProject || {};
        const progress = window.courseApp.loadProgress();
        const stats = window.courseApp.getProgressStats(progress);

        renderProgressSummary(stats);
        renderFinalProjectDetails(finalProject);
        setupSubmissionForm();
    }

    function renderProgressSummary(stats) {
        const statusBadge = document.querySelector('[data-progress-status]');
        const summaryText = document.querySelector('[data-progress-summary]');
        const message = document.querySelector('[data-progress-message]');

        const isComplete = stats.completedCount === stats.totalLessons && stats.totalLessons > 0;
        if (statusBadge) {
            statusBadge.textContent = isComplete ? 'พร้อมทำโปรเจกต์' : 'ยังเรียนไม่ครบ';
            statusBadge.classList.toggle('is-complete', isComplete);
        }

        if (summaryText) {
            summaryText.textContent = `เรียนแล้ว ${stats.completedCount}/${stats.totalLessons} บท (${stats.percent}%)`;
        }

        if (message) {
            if (isComplete) {
                message.textContent = 'ยอดเยี่ยม! คุณเรียนครบทุกบทแล้ว พร้อมต่อยอดสู่โปรเจกต์จริง 👍';
            } else {
                const remaining = Math.max(stats.totalLessons - stats.completedCount, 0);
                message.textContent = `เหลืออีก ${remaining} บท ก็จะพร้อมสำหรับโปรเจกต์สุดท้าย สู้ ๆ นะ!`;
            }
        }
    }

    function renderFinalProjectDetails(finalProject) {
        if (!finalProject) return;

        const titleEl = document.querySelector('[data-final-title]');
        const taglineEl = document.querySelector('[data-final-tagline]');
        const descriptionEl = document.querySelector('[data-final-description]');
        const objectivesList = document.querySelector('[data-final-objectives]');
        const requirementsList = document.querySelector('[data-final-requirements]');
        const deliverablesList = document.querySelector('[data-final-deliverables]');
        const suggestionsList = document.querySelector('[data-final-suggestions]');
        const resourcesList = document.querySelector('[data-final-resources]');
        const submissionNote = document.querySelector('[data-final-submission-note]');

        if (titleEl) titleEl.textContent = finalProject.title || 'โปรเจกต์สุดท้าย';
        if (taglineEl) taglineEl.textContent = finalProject.tagline || '';
        if (descriptionEl) descriptionEl.textContent = finalProject.description || '';

        fillList(objectivesList, finalProject.objectives);
        fillList(requirementsList, finalProject.requirements);
        fillList(deliverablesList, finalProject.deliverables);
        fillList(suggestionsList, finalProject.suggestions);
        fillResourceList(resourcesList, finalProject.resources);

        if (submissionNote) {
            submissionNote.textContent = finalProject.submissionNote || '';
        }
    }

    function fillList(container, items) {
        if (!container || !Array.isArray(items)) {
            return;
        }
        container.innerHTML = items.map((item) => `<li>${item}</li>`).join('');
    }

    function fillResourceList(container, resources) {
        if (!container || !Array.isArray(resources)) return;
        container.innerHTML = resources
            .map((resource) => `<li><a href="${resource.url}" target="_blank" rel="noopener">${resource.label}</a></li>`)
            .join('');
    }

    function setupSubmissionForm() {
        const form = document.querySelector('[data-submission-form]');
        const feedback = document.querySelector('[data-submission-feedback]');

        if (!form) return;

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            if (feedback) {
                feedback.textContent = 'ขอบคุณสำหรับการส่งโปรเจกต์! ระบบบันทึกจริงจะถูกเปิดใช้งานเร็ว ๆ นี้.';
                feedback.classList.add('is-visible');
            }
            form.reset();
        });
    }

    document.addEventListener('DOMContentLoaded', initFinalProjectPage);
})();
