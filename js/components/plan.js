// ================================================================
// js/components/plan.js — خطة التدريس اليومية
// ================================================================

import { loadMode, loadStartDate } from '../services/storage.js';
import { calcStudyDay, isTodayFriday, getPlanForDay } from '../services/scheduler.js';
import { DAYS_OF_WEEK } from '../config/constants.js';

/**
 * بناء HTML لصفحة خطة التدريس
 * @param {object[]} courses
 * @returns {string}
 */
export function renderPlan(courses) {
    const startDate = loadStartDate();
    const mode = loadMode();

    let rows = '';
    for (let i = 0; i < 30; i++) {
        const week    = Math.floor(i / 6) + 1;
        const dayName = DAYS_OF_WEEK[i % 6];
        const [_r1, _r2, _r3] = getPlanForDay(i, courses);

        const todayStudy = startDate ? calcStudyDay(startDate) : -1;
        const isToday = (mode === 'course' && i === todayStudy && !isTodayFriday());

        rows += `
            <tr style="${isToday ? 'background:rgba(212,175,55,0.12);font-weight:700;' : ''}">
                <td>${isToday ? '📍 ' : ''}${dayName} (أسبوع ${week})</td>
                <td>${_r1.title}</td>
                <td>${_r2.title}</td>
                <td>${_r3.title}</td>
            </tr>
        `;
    }

    return `
        <h2 class="section-title">📅 خطة التدريس اليومية</h2>
        <div class="plan-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>اليوم</th>
                        <th>الحصة الأولى</th>
                        <th>الحصة الثانية</th>
                        <th>الحصة الثالثة</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
        <p style="text-align:center;margin-top:16px;color:var(--text-light);">
            <i class="fas fa-info-circle"></i> خطة مرنة – يمكن تعديلها حسب رغبة المعلم
        </p>
    `;
}
