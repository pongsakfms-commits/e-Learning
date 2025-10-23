(function () {
    function initLessonDetailPage() {
        const lessonTitle = document.querySelector('#lessonTitle');
        if (!lessonTitle) return;

        const urlParams = new URLSearchParams(window.location.search);
        const lessonId = urlParams.get('id');
        const lesson = window.courseApp.getLessonById(lessonId);

        if (!lesson) {
            window.location.href = 'index.html';
            return;
        }

        const lessonNumber = document.querySelector('#lessonNumber');
        const lessonDuration = document.querySelector('#lessonDuration');
        const textContent = document.querySelector('#textContent');
        const mediaSection = document.querySelector('#mediaSection');
        const markCompleteBtn = document.querySelector('#markCompleteBtn');

        const progress = window.courseApp.loadProgress();
        const isCompleted = Boolean(progress.completed[lesson.id]);

        lessonTitle.textContent = lesson.title;
        if (lessonNumber) lessonNumber.textContent = `บทที่ ${lesson.order}`;
        if (lessonDuration) lessonDuration.textContent = lesson.duration;

        renderLessonContent(lesson, textContent);
        renderLessonMedia(lesson, mediaSection);

        updateCompletionButton(markCompleteBtn, isCompleted);

        if (markCompleteBtn) {
            markCompleteBtn.addEventListener('click', () => {
                const newProgress = window.courseApp.toggleLessonCompletion(lesson.id);
                const nowCompleted = Boolean(newProgress.completed[lesson.id]);
                updateCompletionButton(markCompleteBtn, nowCompleted);
            });
        }

        setupLessonNavigation(lesson.id);
        window.courseApp.setLastLessonId(lesson.id);
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

        if (lesson.topics && lesson.topics.length > 0) {
            const topicsSection = document.createElement('section');
            topicsSection.innerHTML = `
                <h4>หัวข้อที่จะเรียนรู้</h4>
                <p>${lesson.topics.join(', ')}</p>
            `;
            container.appendChild(topicsSection);
        }

        if (lesson.sections && lesson.sections.length > 0) {
            lesson.sections.forEach((section) => {
                const sectionElement = document.createElement('section');
                sectionElement.innerHTML = `
                    <h3>${section.heading}</h3>
                    ${section.body ? `<p>${section.body}</p>` : ''}
                    ${section.list ? `<ul>${section.list.map((item) => `<li>${item}</li>`).join('')}</ul>` : ''}
                    ${section.code ? `<pre><code>${escapeHtml(section.code)}</code></pre>` : ''}
                `;
                container.appendChild(sectionElement);
            });
        }

        if (lesson.challenge) {
            const challengeSection = document.createElement('section');
            challengeSection.innerHTML = `
                <h3>🎯 แบบฝึกหัดท้าทาย</h3>
                <p>${lesson.challenge}</p>
            `;
            container.appendChild(challengeSection);
        }

        if (lesson.resources && lesson.resources.length > 0) {
            const resourcesSection = document.createElement('section');
            resourcesSection.innerHTML = `
                <h3>📚 แหล่งเรียนรู้เพิ่มเติม</h3>
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
            if (lesson.media.caption) {
                const caption = document.createElement('p');
                caption.textContent = lesson.media.caption;
                caption.style.textAlign = 'center';
                caption.style.marginTop = '0.5rem';
                caption.style.color = '#666';
                container.appendChild(caption);
            }
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
        const incompleteText = button.querySelector('.btn-text-incomplete');
        const completeText = button.querySelector('.btn-text-complete');

        if (incompleteText) incompleteText.style.display = isCompleted ? 'none' : 'inline';
        if (completeText) completeText.style.display = isCompleted ? 'inline' : 'none';
    }

    function setupLessonNavigation(currentLessonId) {
        const lessons = window.courseApp.getLessons();
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
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    document.addEventListener('DOMContentLoaded', initLessonDetailPage);
})();
