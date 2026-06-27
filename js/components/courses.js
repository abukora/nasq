// ================================================================
// js/components/courses.js — صفحة الكراسات
// ================================================================

import { renderCourseCard } from './shared/CourseCard.js';

/**
 * بناء HTML لشبكة الكراسات
 * @param {object[]} courses
 * @returns {string}
 */
export function renderCoursesGrid(courses) {
    return `
        <h2 class="section-title">الكراسات العشر</h2>
        <div class="courses-grid">
            ${courses.map(c => renderCourseCard(c, courses)).join('')}
        </div>
    `;
}
