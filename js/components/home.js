// ================================================================
// js/components/home.js — الصفحة الرئيسية
// ================================================================

import { renderCourseCard } from './shared/CourseCard.js';
import { loadMode, loadStartDate } from '../services/storage.js';
import { calcStudyDay, isTodayFriday, getPlanForDay } from '../services/scheduler.js';
import { DAY_NAMES_AR } from '../config/constants.js';

/**
 * بناء HTML للصفحة الرئيسية
 * @param {object[]} courses
 * @returns {string}
 */
export function renderHome(courses) {
    const mode = loadMode();
    const startDate = loadStartDate();
    let todayBanner = '';

    if (mode === 'course' && startDate) {
        const studyDay = calcStudyDay(startDate);
        if (isTodayFriday()) {
            todayBanner = `
                <div style="background:linear-gradient(135deg,rgba(46,139,87,0.15),rgba(46,139,87,0.05));border:1px solid rgba(46,139,87,0.3);border-radius:16px;padding:18px 22px;margin-bottom:24px;display:flex;align-items:center;gap:14px;">
                    <span style="font-size:2rem;">🌙</span>
                    <div>
                        <strong style="color:#2E8B57;display:block;font-size:1rem;">يوم الجمعة — يوم المراجعة</strong>
                        <span style="color:rgba(255,255,255,0.6);font-size:0.85rem;">راجع دروس الأسبوع واستعد لأسبوع جديد من الإنجاز</span>
                    </div>
                    <button onclick="showFridayModal()" style="margin-right:auto;background:rgba(46,139,87,0.2);border:1px solid rgba(46,139,87,0.4);color:#2E8B57;padding:8px 16px;border-radius:20px;cursor:pointer;font-family:'Cairo',sans-serif;font-weight:700;font-size:0.85rem;white-space:nowrap;">
                        إحصائياتي
                    </button>
                </div>
            `;
        } else if (studyDay >= 0 && studyDay <= 29) {
            const todayCourses = getPlanForDay(studyDay, courses);
            todayBanner = `
                <div style="background:linear-gradient(135deg,rgba(212,175,55,0.12),rgba(212,175,55,0.04));border:1px solid rgba(212,175,55,0.25);border-radius:16px;padding:18px 22px;margin-bottom:24px;">
                    <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
                        <span style="font-size:1.5rem;">📅</span>
                        <strong style="color:#D4AF37;font-size:1rem;">دروسك اليوم — ${DAY_NAMES_AR[new Date().getDay()]} (اليوم ${studyDay+1})</strong>
                    </div>
                    <div style="display:flex;flex-wrap:wrap;gap:8px;">
                        ${todayCourses.map(c => `
                            <button onclick="navigateTo('course',{courseId:${c.id},lessonIndex:0})"
                                style="background:rgba(212,175,55,0.12);border:1px solid rgba(212,175,55,0.3);color:rgba(255,255,255,0.85);padding:8px 16px;border-radius:20px;cursor:pointer;font-family:'Cairo',sans-serif;font-size:0.85rem;display:flex;align-items:center;gap:6px;">
                                <i class="fas fa-book-open" style="color:#D4AF37;font-size:0.75rem;"></i>${c.title}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }

    return `
        ${todayBanner}
        <div class="hero">
            <h1>حصون الإيمان</h1>
            <p>المنهج الصيفي المتكامل لبناء شخصية ابنك المسلمة</p>
            <p class="sub-meta">📚 10 كراسات &nbsp;|&nbsp; 130 درساً &nbsp;|&nbsp; 45 يوماً &nbsp;|&nbsp; للفئة 9-15 سنة</p>
            <div class="hero-actions">
                <a class="btn-hero btn-game" href="game.html">
                    <i class="fas fa-gamepad"></i> ابدأ السباق الآن
                </a>
                <button class="btn-hero" onclick="navigateTo('courses')">
                    <i class="fas fa-book-open"></i> تصفح الكراسات
                </button>
            </div>
        </div>

        <div class="author-card">
            <div class="author-emblem">🛡️</div>
            <div class="author-label">إعداد وتأليف المادة العلمية</div>
            <div class="author-name">محمد أبو عبد الرحمن</div>
            <div class="author-dua">عفا الله عنه ووالديه والمسلمين</div>
            <div class="author-divider"></div>
            <span class="author-edition">
                <i class="fas fa-medal" style="color:#D4AF37"></i>
                الإصدار الأول — 2026م
            </span>
        </div>

        <h2 class="section-title">الكراسات العشر</h2>
        <div class="courses-grid">
            ${courses.map(c => renderCourseCard(c, courses)).join('')}
        </div>
    `;
}
