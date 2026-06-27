// ================================================================
// js/ui/modal.js — النوافذ المنبثقة (Modals)
// ================================================================

import {
    saveMode, saveStartDate, markSetupDone, loadMode, loadStartDate, resetCourseSetup,
    isLessonDone
} from '../services/storage.js';
import {
    toLocalDateStr, calcStudyDay, calcEndDate, isTodayFriday,
    completedStudyDays, getPlanForDay
} from '../services/scheduler.js';
import { DAY_NAMES_AR, MONTH_NAMES_AR } from '../config/constants.js';
import { updateModeBadge } from './navigation.js';

/** الوضع المختار مؤقتاً في خطوات الترحيب */
let selectedMode = null;

// ----------------------------------------------------------------
// نافذة التشجيع (Cheer Modal)
// ----------------------------------------------------------------

/**
 * عرض رسالة تشجيع
 * @param {string} stars
 * @param {string} title
 * @param {string} desc
 */
export function showCheerMessage(stars, title, desc) {
    document.querySelector('#cheerModal .stars').textContent = stars;
    document.getElementById('cheerMessage').textContent = title;
    document.querySelector('#cheerModal p').textContent = desc;
    document.getElementById('cheerModal').style.display = 'flex';
}

/** إغلاق نافذة التشجيع */
export function closeModal() {
    document.getElementById('cheerModal').style.display = 'none';
}

// ----------------------------------------------------------------
// نافذة الجمعة (Friday Modal)
// ----------------------------------------------------------------

/**
 * عرض نافذة يوم الجمعة
 * @param {object[]} courses
 */
export function showFridayModal(courses) {
    const mode = loadMode();
    if (mode !== 'course') return;

    const startDate = loadStartDate();
    const studyDay = startDate ? completedStudyDays(startDate) : 0;

    let totalLessons = 0;
    let completedLessons = 0;
    courses.forEach(course => {
        course.lessons.forEach((_, idx) => {
            totalLessons++;
            if (isLessonDone(course.id, idx)) completedLessons++;
        });
    });

    document.getElementById('fridayStats').innerHTML = `
        <div class="friday-stat">
            <span class="fs-num">${studyDay}</span>
            <span class="fs-lbl">يوم دراسي مضى</span>
        </div>
        <div class="friday-stat">
            <span class="fs-num">${completedLessons}</span>
            <span class="fs-lbl">درس أتممته</span>
        </div>
        <div class="friday-stat">
            <span class="fs-num">${Math.max(0, 45 - studyDay)}</span>
            <span class="fs-lbl">يوم متبقي</span>
        </div>
    `;

    document.getElementById('fridayModal').classList.add('show');
}

/** إغلاق نافذة الجمعة */
export function closeFridayModal() {
    document.getElementById('fridayModal').classList.remove('show');
}

// ----------------------------------------------------------------
// نافذة الترحيب (Welcome Modal)
// ----------------------------------------------------------------

/** عرض نافذة الترحيب */
export function showWelcomeModal() {
    const ov = document.getElementById('welcomeOverlay');
    if (ov) ov.style.display = 'flex';
    const picker = document.getElementById('startDatePicker');
    if (picker) picker.value = toLocalDateStr(new Date());
}

/** إخفاء نافذة الترحيب */
export function hideWelcomeModal() {
    const ov = document.getElementById('welcomeOverlay');
    if (ov) {
        ov.style.opacity = '0';
        ov.style.transition = 'opacity 0.4s';
        setTimeout(() => {
            ov.style.display = 'none';
            ov.style.opacity = '';
            ov.style.transition = '';
        }, 400);
    }
}

/**
 * اختيار الوضع في خطوة 1
 * @param {'course'|'free'} mode
 */
export function selectMode(mode) {
    selectedMode = mode;
    document.querySelectorAll('.wc-option').forEach(o => o.classList.remove('selected'));
    document.querySelectorAll('.opt-check').forEach(c => { c.innerHTML = ''; });

    const optEl   = document.getElementById('opt-' + mode);
    const checkEl = document.getElementById('check-' + mode);
    if (optEl)   optEl.classList.add('selected');
    if (checkEl) checkEl.innerHTML = '<i class="fas fa-check" style="font-size:0.7rem;color:#000;"></i>';

    const btnNext = document.getElementById('btn-step1-next');
    const btnFree = document.getElementById('btn-step1-free');
    if (mode === 'course') {
        if (btnNext) btnNext.style.display = 'block';
        if (btnFree) btnFree.style.display = 'none';
    } else {
        if (btnNext) btnNext.style.display = 'none';
        if (btnFree) btnFree.style.display = 'block';
    }
}

/**
 * الانتقال إلى خطوة معينة في wizard الترحيب
 * @param {number} step - 1 | 2 | 3
 * @param {object[]} courses
 */
export function goToStep(step, courses) {
    [1, 2, 3].forEach(s => {
        const el = document.getElementById('wc-step-' + s);
        if (el) el.classList.toggle('visible', s === step);
    });

    [1, 2, 3].forEach(s => {
        const item   = document.getElementById('step-item-' + s);
        const circle = document.getElementById('step-circle-' + s);
        const line   = document.getElementById('step-line-' + s);
        if (!item || !circle) return;

        item.classList.remove('active', 'done');
        circle.classList.remove('active', 'done');

        if (s < step) {
            item.classList.add('done');
            circle.classList.add('done');
            circle.innerHTML = '<i class="fas fa-check" style="font-size:0.7rem;"></i>';
            if (line) { line.classList.remove('active'); line.classList.add('done'); }
        } else if (s === step) {
            item.classList.add('active');
            circle.classList.add('active');
            circle.textContent = s;
            if (line) { line.classList.remove('done'); line.classList.add('active'); }
        } else {
            circle.textContent = s;
            if (line) line.classList.remove('active', 'done');
        }
    });

    if (step === 3) buildConfirmStep(courses);
}

/** معالجة تغيير قيمة تاريخ البداية */
export function onDateChange() {
    const picker = document.getElementById('startDatePicker');
    const btn    = document.getElementById('btn-step2-next');
    if (picker && picker.value && btn) {
        btn.disabled = false;
        btn.style.opacity = '1';
    }
}

/**
 * بناء ملخص الخطوة 3 (التأكيد)
 * @param {object[]} courses
 */
export function buildConfirmStep(courses) {
    const startDate = document.getElementById('startDatePicker').value;
    if (!startDate) return;

    const start  = new Date(startDate + 'T00:00:00');
    const endDate = calcEndDate(startDate);
    const fmt = d => `${DAY_NAMES_AR[d.getDay()]} ${d.getDate()} ${MONTH_NAMES_AR[d.getMonth()]} ${d.getFullYear()}`;

    const todayStudyDay = calcStudyDay(startDate);
    let todayCoursesHtml = '';
    if (todayStudyDay >= 0 && todayStudyDay <= 29) {
        const todayCourses = getPlanForDay(todayStudyDay, courses);
        todayCoursesHtml = todayCourses.map(c =>
            `<span class="wc-lesson-chip"><i class="fas fa-book-open"></i> ${c.title}</span>`
        ).join('');
    } else if (todayStudyDay < 0) {
        todayCoursesHtml = `<span style="color:rgba(255,255,255,0.5);font-size:0.85rem;">ستبدأ دروسك يوم ${fmt(start)}</span>`;
    }

    document.getElementById('confirmSummary').innerHTML = `
        <div class="wc-confirm-row">
            <span class="cr-label"><i class="fas fa-play-circle" style="color:#2E8B57;margin-left:6px;"></i> تاريخ البداية</span>
            <span class="cr-val">${fmt(start)}</span>
        </div>
        <div class="wc-confirm-row">
            <span class="cr-label"><i class="fas fa-flag-checkered" style="color:#D4AF37;margin-left:6px;"></i> تاريخ الانتهاء</span>
            <span class="cr-val">${fmt(endDate)}</span>
        </div>
        <div class="wc-confirm-row">
            <span class="cr-label"><i class="fas fa-calendar-week" style="color:#9932CC;margin-left:6px;"></i> أيام الدراسة</span>
            <span class="cr-val">6 أيام / أسبوع</span>
        </div>
        <div class="wc-confirm-row">
            <span class="cr-label"><i class="fas fa-book" style="color:#1a73e8;margin-left:6px;"></i> عدد الكراسات</span>
            <span class="cr-val">10 كراسات · 130 درساً</span>
        </div>
    `;

    document.getElementById('todayLessonsPreview').innerHTML = `
        <h4><i class="fas fa-sun"></i> ${todayStudyDay >= 0 ? 'دروسك اليوم:' : 'دروسك في اليوم الأول:'}</h4>
        ${todayCoursesHtml || '<span style="color:rgba(255,255,255,0.5);font-size:0.85rem;">لا توجد دروس مجدولة اليوم</span>'}
    `;
}

/**
 * إطلاق وضع التصفح الحر
 * @param {Function} navigateFn - دالة navigateTo
 */
export function launchFreeMode(navigateFn) {
    saveMode('free');
    markSetupDone();
    hideWelcomeModal();
    updateModeBadge();
    navigateFn('home');
}

/**
 * إطلاق وضع الدورة المنظمة
 * @param {Function} navigateFn
 */
export function launchCourseMode(navigateFn, courses) {
    const startDate = document.getElementById('startDatePicker').value;
    if (!startDate) return;
    saveMode('course');
    saveStartDate(startDate);
    markSetupDone();
    hideWelcomeModal();
    updateModeBadge();
    if (isTodayFriday()) showFridayModal(courses);
    navigateFn('home');
}

/**
 * إعادة ضبط الإعداد
 * @param {Function} navigateFn
 * @param {object[]} courses
 */
export function resetSetup(navigateFn, courses) {
    if (!confirm('هل تريد إعادة ضبط الإعدادات؟ سيتم الاحتفاظ بتقدمك في الدروس.')) return;
    resetCourseSetup();
    selectedMode = null;
    document.querySelectorAll('.wc-option').forEach(o => o.classList.remove('selected'));
    document.querySelectorAll('.opt-check').forEach(c => { c.innerHTML = ''; });
    ['btn-step1-next', 'btn-step1-free'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    goToStep(1, courses);
    showWelcomeModal();
    updateModeBadge();
}
