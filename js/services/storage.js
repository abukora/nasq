// ================================================================
// js/services/storage.js — دوال localStorage
// ================================================================

import { LS_MODE, LS_START_DATE, LS_SETUP_DONE } from '../config/constants.js';

/** @param {number} courseId @param {number} lessonIndex @returns {string} */
export function getProgressKey(courseId, lessonIndex) {
    return `hosoonaliman_progress_${courseId}_${lessonIndex}`;
}

/**
 * هل اكتمل درس معين؟
 * @param {number} courseId
 * @param {number} lessonIndex
 * @returns {boolean}
 */
export function isLessonDone(courseId, lessonIndex) {
    return localStorage.getItem(getProgressKey(courseId, lessonIndex)) === 'true';
}

/**
 * تعيين درس كمكتمل
 * @param {number} courseId
 * @param {number} lessonIndex
 */
export function setLessonDone(courseId, lessonIndex) {
    localStorage.setItem(getProgressKey(courseId, lessonIndex), 'true');
}

/**
 * حساب نسبة التقدم في كراسة
 * @param {number} courseId
 * @param {{ lessons: any[] }} course - كائن الكراسة
 * @returns {number} النسبة المئوية 0-100
 */
export function getCourseProgress(courseId, course) {
    if (!course) return 0;
    let done = 0;
    course.lessons.forEach((_, idx) => { if (isLessonDone(courseId, idx)) done++; });
    return Math.round((done / course.lessons.length) * 100);
}

/** حفظ وضع التطبيق */
export const saveMode       = mode      => localStorage.setItem(LS_MODE, mode);
/** تحميل وضع التطبيق */
export const loadMode       = ()        => localStorage.getItem(LS_MODE);
/** حفظ تاريخ البداية */
export const saveStartDate  = date      => localStorage.setItem(LS_START_DATE, date);
/** تحميل تاريخ البداية */
export const loadStartDate  = ()        => localStorage.getItem(LS_START_DATE);
/** تعيين الإعداد كمكتمل */
export const markSetupDone  = ()        => localStorage.setItem(LS_SETUP_DONE, '1');
/** هل اكتمل الإعداد؟ */
export const isSetupDone    = ()        => !!localStorage.getItem(LS_SETUP_DONE);
/** إعادة ضبط إعدادات الدورة (مع الاحتفاظ بالتقدم) */
export function resetCourseSetup() {
    localStorage.removeItem(LS_MODE);
    localStorage.removeItem(LS_START_DATE);
    localStorage.removeItem(LS_SETUP_DONE);
}
