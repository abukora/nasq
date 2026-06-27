// ================================================================
// js/components/shared/CourseCard.js — بطاقة كراسة واحدة
// ================================================================

import { getCourseProgress, isLessonDone } from '../../services/storage.js';
import { isCourseUnlocked } from '../../services/scheduler.js';
import { loadMode } from '../../services/storage.js';

/**
 * بناء HTML لبطاقة كراسة واحدة
 * @param {object} course - كائن الكراسة
 * @param {object[]} courses - جميع الكراسات (لفحص الإتاحة)
 * @returns {string} HTML
 */
export function renderCourseCard(course, courses) {
    const mode = loadMode();
    const progress = getCourseProgress(course.id, course);
    const unlocked = isCourseUnlocked(course.id, courses);

    const lockHtml = (mode === 'course' && !unlocked) ? `
        <div style="margin-top:10px;display:flex;align-items:center;gap:6px;justify-content:center;color:rgba(255,255,255,0.4);font-size:0.78rem;">
            <i class="fas fa-lock" style="color:#D4AF37;"></i> يُفتح في موعده
        </div>` : '';

    const clickAction = (mode !== 'course' || unlocked)
        ? `navigateTo('course', {courseId: ${course.id}, lessonIndex: 0})`
        : 'void(0)';

    return `
        <div class="course-card ${mode === 'course' && !unlocked ? 'lesson-locked' : ''}"
             onclick="${clickAction}">
            <div class="icon"><i class="fas ${course.icon}" style="color:${course.color}"></i></div>
            <h3>${course.title}</h3>
            <div class="badge">${course.lessons.length} دروس</div>
            <div class="progress-indicator">
                <div class="fill" style="width:${progress}%;"></div>
            </div>
            <span style="font-size:0.8rem;color:var(--text-light);">${progress}% مكتمل</span>
            ${lockHtml}
        </div>
    `;
}
