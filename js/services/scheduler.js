// ================================================================
// js/services/scheduler.js — دوال خطة التدريس والجدول الزمني
// ================================================================

import { loadMode, loadStartDate, isLessonDone } from './storage.js';

/**
 * تحويل كائن Date إلى string بصيغة YYYY-MM-DD (بالتوقيت المحلي)
 * @param {Date} date
 * @returns {string}
 */
export function toLocalDateStr(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

/**
 * هل اليوم الحالي جمعة؟
 * @returns {boolean}
 */
export function isTodayFriday() {
    return new Date().getDay() === 5;
}

/**
 * احسب اليوم الدراسي الحالي (0-based) مع تجاهل أيام الجمعة
 * @param {string} startDateStr - تاريخ البداية بصيغة YYYY-MM-DD
 * @returns {number} رقم اليوم الدراسي (0-based) أو -1 إذا لم تبدأ بعد
 */
export function calcStudyDay(startDateStr) {
    const start = new Date(startDateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    if (today < start) return -1;

    let studyDays = 0;
    const cur = new Date(start);
    while (cur <= today) {
        const dow = cur.getDay(); // 5 = الجمعة
        if (dow !== 5) studyDays++;
        if (toLocalDateStr(cur) === toLocalDateStr(today)) break;
        cur.setDate(cur.getDate() + 1);
    }
    return studyDays - 1; // 0-based
}

/**
 * احسب عدد الأيام الدراسية المكتملة حتى الآن
 * @param {string} startDateStr
 * @returns {number}
 */
export function completedStudyDays(startDateStr) {
    return Math.max(0, calcStudyDay(startDateStr));
}

/**
 * احصل على الكراسات المجدولة ليوم دراسي معين
 * @param {number} dayIndex - اليوم الدراسي (0-based, 0-29)
 * @param {object[]} courses - مصفوفة الكراسات
 * @returns {object[]} مصفوفة من 3 كراسات
 */
export function getPlanForDay(dayIndex, courses) {
    const n = courses.length;
    const i = dayIndex;
    const a = i % n;
    const b = (i + Math.ceil(n / 3)) % n;
    const c = (i + Math.ceil((2 * n) / 3)) % n;
    return [courses[a], courses[b], courses[c]];
}

/**
 * احصل على قائمة معرّفات الكراسات المتاحة اليوم
 * @param {object[]} courses
 * @returns {number[]}
 */
export function getUnlockedCourseIds(courses) {
    const mode = loadMode();
    if (mode !== 'course') return courses.map(c => c.id);

    const startDate = loadStartDate();
    if (!startDate) return [];

    if (isTodayFriday()) {
        const todayStudyDay = completedStudyDays(startDate);
        const unlocked = new Set();
        for (let d = 0; d <= todayStudyDay; d++) {
            getPlanForDay(d, courses).forEach(c => unlocked.add(c.id));
        }
        return [...unlocked];
    }

    const todayStudyDay = calcStudyDay(startDate);
    if (todayStudyDay < 0) return [];
    const unlocked = new Set();
    for (let d = 0; d <= Math.min(todayStudyDay, 29); d++) {
        getPlanForDay(d, courses).forEach(c => unlocked.add(c.id));
    }
    return [...unlocked];
}

/**
 * هل كراسة معينة متاحة؟
 * @param {number} courseId
 * @param {object[]} courses
 * @returns {boolean}
 */
export function isCourseUnlocked(courseId, courses) {
    return getUnlockedCourseIds(courses).includes(courseId);
}

/**
 * احسب تاريخ نهاية الدورة (45 يوم دراسي مع تجاهل الجمعات)
 * @param {string} startDateStr
 * @returns {Date}
 */
export function calcEndDate(startDateStr) {
    const start = new Date(startDateStr + 'T00:00:00');
    let studyCount = 0;
    const end = new Date(start);
    while (studyCount < 45) {
        if (end.getDay() !== 5) studyCount++;
        if (studyCount < 45) end.setDate(end.getDate() + 1);
    }
    return end;
}
