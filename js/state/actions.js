// ================================================================
// js/state/actions.js — دوال تغيير الحالة
// ================================================================

import { store } from './store.js';

/**
 * الانتقال إلى قسم معين
 * @param {string} section - 'home' | 'courses' | 'plan' | 'contact' | 'course'
 * @param {{ courseId?: number, lessonIndex?: number }} [params]
 */
export function navigateTo(section, params = {}) {
    if (section === 'course') {
        store.setState({
            section: 'course',
            courseId: params.courseId,
            lessonIndex: params.lessonIndex ?? 0,
        });
    } else {
        store.setState({
            section,
            courseId: null,
            lessonIndex: 0,
        });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('navLinks')?.classList.remove('active');
}

/**
 * فتح كراسة معينة عند درس محدد
 * @param {number} courseId
 * @param {number} [lessonIndex=0]
 */
export function openCourse(courseId, lessonIndex = 0) {
    navigateTo('course', { courseId, lessonIndex });
}

/**
 * إعادة ضبط الحالة إلى الصفحة الرئيسية
 */
export function resetState() {
    store.setState({ section: 'home', courseId: null, lessonIndex: 0 });
}
