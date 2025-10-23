(function () {
    const PROGRESS_KEY = 'python_course_progress';

    const courseData = window.pythonCourseData || { lessons: [], finalProject: {} };

    function getLessons() {
        return [...(courseData.lessons || [])].sort((a, b) => a.order - b.order);
    }

    function getLessonById(lessonId) {
        return getLessons().find((lesson) => lesson.id === lessonId) || null;
    }

    function normalizeProgress(rawProgress) {
        const defaultProgress = {
            completed: {},
            lastLessonId: courseData.lessons?.[0]?.id || null,
            updatedAt: null,
        };

        if (!rawProgress) {
            return defaultProgress;
        }

        try {
            const parsed = JSON.parse(rawProgress);

            if (Array.isArray(parsed)) {
                const completed = {};
                parsed.forEach((lessonId) => {
                    completed[lessonId] = true;
                });
                return { ...defaultProgress, completed };
            }

            return {
                ...defaultProgress,
                ...parsed,
                completed: { ...parsed.completed },
            };
        } catch (error) {
            console.warn('ไม่สามารถอ่านข้อมูลความคืบหน้าได้ จะสร้างข้อมูลใหม่', error);
            return defaultProgress;
        }
    }

    function loadProgress() {
        const rawProgress = localStorage.getItem(PROGRESS_KEY);
        const normalized = normalizeProgress(rawProgress);

        const knownLessonIds = new Set(getLessons().map((lesson) => lesson.id));
        Object.keys(normalized.completed).forEach((lessonId) => {
            if (!knownLessonIds.has(lessonId)) {
                delete normalized.completed[lessonId];
            }
        });

        if (!knownLessonIds.has(normalized.lastLessonId)) {
            normalized.lastLessonId = getLessons()[0]?.id || null;
        }

        return normalized;
    }

    function saveProgress(progress) {
        if (!progress) return;
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    }

    function setLessonCompletion(lessonId, completed) {
        const progress = loadProgress();
        progress.completed[lessonId] = completed;
        progress.lastLessonId = lessonId;
        progress.updatedAt = new Date().toISOString();
        saveProgress(progress);
        return progress;
    }

    function toggleLessonCompletion(lessonId) {
        const progress = loadProgress();
        const currentState = Boolean(progress.completed[lessonId]);
        return setLessonCompletion(lessonId, !currentState);
    }

    function setLastLessonId(lessonId) {
        const progress = loadProgress();
        progress.lastLessonId = lessonId;
        progress.updatedAt = new Date().toISOString();
        saveProgress(progress);
        return progress;
    }

    function getProgressStats(progress) {
        const totalLessons = getLessons().length;
        const completedCount = Object.keys(progress.completed || {}).filter((lessonId) => progress.completed[lessonId]).length;
        const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
        return { totalLessons, completedCount, percent };
    }

    function renderLessonCards(container, progress) {
        if (!container) return;
        const lessons = getLessons();
        container.innerHTML = '';

        lessons.forEach((lesson) => {
            const article = document.createElement('article');
            const isCompleted = Boolean(progress.completed[lesson.id]);
            article.className = 'lesson-card' + (isCompleted ? ' completed' : '');

            article.innerHTML = `
                <div class="lesson-info">
                    <div class="lesson-header-info">
                        <span class="lesson-number">บทที่ ${lesson.order}</span>
                        <h4 class="lesson-title">${lesson.title}</h4>
                    </div>
                    <p class="lesson-description">${lesson.summary}</p>
                    <div class="lesson-meta-info">
                        <span>ระดับ: ${lesson.level}</span>
                        <span>เวลาเรียน: ${lesson.duration}</span>
                    </div>
                </div>
                <div class="lesson-status">
                    <span class="status-badge ${isCompleted ? 'completed' : 'incomplete'}">
                        ${isCompleted ? 'เรียนแล้ว' : 'ยังไม่เรียน'}
                    </span>
                    <a href="lesson.html?id=${lesson.id}" class="btn-primary">ดูรายละเอียด</a>
                </div>
            `;

            article.addEventListener('click', (event) => {
                const target = event.target;
                if (target.closest('.btn-primary')) {
                    return;
                }
                window.location.href = `lesson.html?id=${lesson.id}`;
            });

            container.appendChild(article);
        });
    }

    function updateLandingProgressUI(progress) {
        const stats = getProgressStats(progress);
        const totalElement = document.querySelector('#totalLessons');
        const completedElement = document.querySelector('#completedLessons');
        const percentElement = document.querySelector('#progressPercent');
        const progressFill = document.querySelector('.progress-fill');

        if (totalElement) totalElement.textContent = stats.totalLessons;
        if (completedElement) completedElement.textContent = stats.completedCount;
        if (percentElement) percentElement.textContent = `${stats.percent}%`;
        if (progressFill) {
            progressFill.style.width = `${stats.percent}%`;
            progressFill.textContent = `${stats.percent}%`;
        }
    }

    function initLandingPage() {
        const lessonsList = document.querySelector('#lessonsList');
        if (!lessonsList) return;

        const progress = loadProgress();
        renderLessonCards(lessonsList, progress);
        updateLandingProgressUI(progress);
    }

    function initFinalProjectPage() {
        const submissionForm = document.querySelector('#submissionForm');
        if (!submissionForm) return;

        submissionForm.addEventListener('submit', (event) => {
            event.preventDefault();
            alert('ขอบคุณสำหรับการส่งโปรเจกต์! ระบบกำลังพัฒนา ข้อมูลนี้ยังไม่ถูกบันทึกจริง');
            submissionForm.reset();
        });
    }

    function initLessonDetailPage() {
        const lessonTitle = document.querySelector('#lessonTitle');
        if (!lessonTitle) return;

        const urlParams = new URLSearchParams(window.location.search);
        const lessonId = urlParams.get('id');
        const lesson = getLessonById(lessonId);

        if (!lesson) {
            window.location.href = 'index.html';
            return;
        }

        const lessonNumber = document.querySelector('#lessonNumber');
        const lessonDuration = document.querySelector('#lessonDuration');
        const textContent = document.querySelector('#textContent');
        const mediaSection = document.querySelector('#mediaSection');
        const markCompleteBtn = document.querySelector('#markCompleteBtn');

        const progress = loadProgress();
        const isCompleted = Boolean(progress.completed[lesson.id]);

        lessonTitle.textContent = lesson.title;
        lessonNumber.textContent = `บทที่ ${lesson.order}`;
        lessonDuration.textContent = lesson.duration;

        renderLessonContent(lesson, textContent);
        renderLessonMedia(lesson, mediaSection);

        updateCompletionButton(markCompleteBtn, isCompleted);

        markCompleteBtn.addEventListener('click', () => {
            const newProgress = toggleLessonCompletion(lesson.id);
            const nowCompleted = Boolean(newProgress.completed[lesson.id]);
            updateCompletionButton(markCompleteBtn, nowCompleted);
        });

        const navigationButtons = setupLessonNavigation(lesson.id);
        setLastLessonId(lesson.id);
    }

    function renderLessonContent(lesson, container) {
        if (!container) return;

        container.innerHTML = '';

        if (lesson.objectives && lesson.objectives.length > 0) {
            const objectivesSection = document.createElement('section');
            objectivesSection.innerHTML = `
                <h3>เป้าหมายการเรียนรู้</h3>
                <ul>
                    ${lesson.objectives.map((item) => `<li>${item}</li>`).join('')}
                </ul>
            `;
            container.appendChild(objectivesSection);
        }

        if (lesson.sections && lesson.sections.length > 0) {
            lesson.sections.forEach((section) => {
                const sectionElement = document.createElement('section');
                sectionElement.innerHTML = `
                    <h3>${section.heading}</h3>
                    <p>${section.body}</p>
                    ${section.list ? `<ul>${section.list.map((item) => `<li>${item}</li>`).join('')}</ul>` : ''}
                    ${section.code ? `<pre><code>${section.code}</code></pre>` : ''}
                `;
                container.appendChild(sectionElement);
            });
        }

        if (lesson.challenge) {
            const challengeSection = document.createElement('section');
            challengeSection.innerHTML = `
                <h3>แบบฝึกหัดท้าทาย</h3>
                <p>${lesson.challenge}</p>
            `;
            container.appendChild(challengeSection);
        }

        if (lesson.resources && lesson.resources.length > 0) {
            const resourcesSection = document.createElement('section');
            resourcesSection.innerHTML = `
                <h3>แหล่งเรียนรู้เพิ่มเติม</h3>
                <ul>
                    ${lesson.resources
                        .map((resource) => `<li><a href="${resource.url}" target="_blank" rel="noopener">${resource.label}</a></li>`)
                        .join('')}
                </ul>
            `;
            container.appendChild(resourcesSection);
        }
    }

    function renderLessonMedia(lesson, container) {
        if (!container) return;
        container.innerHTML = '';

        if (!lesson.media) return;

        if (lesson.media.type === 'video') {
            const videoWrapper = document.createElement('div');
            videoWrapper.className = 'video-container';
            videoWrapper.innerHTML = `
                <iframe src="${lesson.media.url}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            `;
            container.appendChild(videoWrapper);
        } else if (lesson.media.type === 'image') {
            const imageWrapper = document.createElement('div');
            imageWrapper.className = 'image-container';
            imageWrapper.innerHTML = `
                <img src="${lesson.media.url}" alt="${lesson.media.alt || lesson.title}">
                ${lesson.media.caption ? `<p>${lesson.media.caption}</p>` : ''}
            `;
            container.appendChild(imageWrapper);
        }
    }

    function updateCompletionButton(button, isCompleted) {
        if (!button) return;

        button.classList.toggle('completed', isCompleted);
        button.querySelector('.btn-text-incomplete').style.display = isCompleted ? 'none' : 'inline';
        button.querySelector('.btn-text-complete').style.display = isCompleted ? 'inline' : 'none';
    }

    function setupLessonNavigation(currentLessonId) {
        const lessons = getLessons();
        const currentIndex = lessons.findIndex((lesson) => lesson.id === currentLessonId);

        const prevButton = document.querySelector('#prevLesson');
        const nextButton = document.querySelector('#nextLesson');

        if (prevButton) {
            if (currentIndex > 0) {
                prevButton.disabled = false;
                prevButton.addEventListener('click', () => {
                    window.location.href = `lesson.html?id=${lessons[currentIndex - 1].id}`;
                });
            } else {
                prevButton.disabled = true;
            }
        }

        if (nextButton) {
            if (currentIndex < lessons.length - 1) {
                nextButton.disabled = false;
                nextButton.addEventListener('click', () => {
                    window.location.href = `lesson.html?id=${lessons[currentIndex + 1].id}`;
                });
            } else {
                nextButton.disabled = true;
            }
        }

        return { prevButton, nextButton };
    }

    document.addEventListener('DOMContentLoaded', () => {
        initLandingPage();
        initFinalProjectPage();
        initLessonDetailPage();
    });

    window.courseApp = {
        getLessons,
        getLessonById,
        loadProgress,
        saveProgress,
        toggleLessonCompletion,
        setLessonCompletion,
        setLastLessonId,
        getProgressStats,
    };
})();
