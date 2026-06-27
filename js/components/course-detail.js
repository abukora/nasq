// ================================================================
// js/components/course-detail.js — تفاصيل الكراسة والدروس
// ================================================================

import { getCourseProgress, isLessonDone } from '../services/storage.js';
import { ICON_MAP, LABEL_MAP } from '../config/constants.js';

/**
 * عرض أقسام الدرس بتنسيق HTML
 * @param {{ type: string, content: string, source?: string }[]} sections
 * @returns {string}
 */
export function renderSections(sections) {
    if (!sections || sections.length === 0) {
        return '<p>لا يوجد محتوى لهذا الدرس.</p>';
    }
    return sections.map(sec => {
        const icon  = ICON_MAP[sec.type]  || 'fa-paragraph';
        const label = LABEL_MAP[sec.type] || 'محتوى';
        let extra = '';
        if (sec.type === 'quote' && sec.source) {
            extra = `<span class="source">— ${sec.source}</span>`;
        }
        let contentHtml = sec.content;
        if (!contentHtml.includes('<ul') && !contentHtml.includes('<ol')) {
            contentHtml = `<p>${contentHtml}</p>`;
        }
        return `
            <div class="section-block ${sec.type}">
                <div class="section-label">
                    <i class="fas ${icon}"></i> ${label}
                </div>
                ${contentHtml}
                ${extra}
            </div>
        `;
    }).join('');
}

/**
 * بناء HTML لصفحة تفاصيل كراسة
 * @param {object[]} courses
 * @param {number} courseId
 * @param {number} lessonIndex
 * @returns {string}
 */
export function renderCourseDetail(courses, courseId, lessonIndex) {
    const course = courses.find(c => c.id === courseId);
    if (!course) return '<p style="text-align:center;padding:40px;">الكراسة غير موجودة.</p>';

    const totalLessons = course.lessons.length;
    const progress = getCourseProgress(course.id, course);

    const sidebarLinks = course.lessons.map((l, idx) => {
        const done   = isLessonDone(course.id, idx);
        const active = idx === lessonIndex ? 'active' : '';
        return `
            <a class="lesson-link ${active}" onclick="navigateTo('course', {courseId: ${course.id}, lessonIndex: ${idx}})">
                <span class="status-dot ${done ? 'done' : ''}"></span>
                ${idx + 1}. ${l.title}
            </a>
        `;
    }).join('');

    const lesson      = course.lessons[lessonIndex];
    const done        = isLessonDone(course.id, lessonIndex);
    const sectionsHtml = renderSections(lesson.sections);
    const prevDisabled = lessonIndex === 0;
    const nextDisabled = lessonIndex === totalLessons - 1;

    return `
        <div class="course-detail-layout">
            <aside class="sidebar">
                <h4>📖 دروس ${course.title}</h4>
                ${sidebarLinks}
            </aside>
            <main class="main-content">
                <div class="course-header">
                    <button class="btn-back" onclick="navigateTo('home')">
                        <i class="fas fa-arrow-right"></i> العودة
                    </button>
                    <span class="course-title">${course.title}</span>
                    <span class="course-stats"><i class="fas fa-book"></i> ${totalLessons} درس · ${progress}% مكتمل</span>
                    <span style="font-size:0.78rem;color:var(--text-light);width:100%;text-align:center;padding-top:4px;">تأليف: محمد أبو عبد الرحمن — عفا الله عنه</span>
                </div>

                <div class="lesson-card">
                    <div class="lesson-header" onclick="toggleLesson(this)">
                        <h3>${lessonIndex + 1}. ${lesson.title}</h3>
                        <div class="lesson-meta">
                            <span class="status-dot ${done ? 'done' : ''}"></span>
                            <i class="fas fa-chevron-down"></i>
                        </div>
                    </div>
                    <div class="lesson-body active">
                        <div class="lesson-content">${sectionsHtml}</div>
                        <div class="lesson-actions">
                            <button class="btn-complete ${done ? 'done' : ''}"
                                onclick="completeLesson(event, ${course.id}, ${lessonIndex}, '${course.title}', '${lesson.title}')">
                                ${done
                                    ? '<i class="fas fa-check-circle"></i> تم الإتمام'
                                    : '<i class="fas fa-check"></i> أتممت هذا الدرس'}
                            </button>
                            <a class="btn-youtube" href="https://youtube.com/@abukora?si=Nu3-ZETtW-QPsLW6" target="_blank">
                                <i class="fab fa-youtube"></i> شاهد الدرس على اليوتيوب
                            </a>
                            <a class="btn-book" href="https://www.google.com/?hl=ar" target="_blank">
                                <i class="fas fa-book"></i> رابط الكتاب
                            </a>
                        </div>
                        <div class="lesson-navigation">
                            <button onclick="navigateTo('course', {courseId: ${course.id}, lessonIndex: ${lessonIndex - 1}})"
                                ${prevDisabled ? 'disabled' : ''}>
                                <i class="fas fa-arrow-right"></i> السابق
                            </button>
                            <span>${lessonIndex + 1} / ${totalLessons}</span>
                            <button onclick="navigateTo('course', {courseId: ${course.id}, lessonIndex: ${lessonIndex + 1}})"
                                ${nextDisabled ? 'disabled' : ''}>
                                التالي <i class="fas fa-arrow-left"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `;
}
