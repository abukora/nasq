// ================================================================
// js/app.js — نقطة الدخول الرئيسية
// ================================================================

// ── البيانات والمعالجة ──────────────────────────────────────────
import { rawCourses }          from './data/courses.js';
import { parseSectionsFromContent } from './services/parser.js';

// ── الحالة والإجراءات ────────────────────────────────────────────
import { store }               from './state/store.js';
import { navigateTo }          from './state/actions.js';

// ── الخدمات ──────────────────────────────────────────────────────
import {
    isLessonDone, setLessonDone, getProgressKey,
    isSetupDone
} from './services/storage.js';
import { isTodayFriday, toLocalDateStr } from './services/scheduler.js';

// ── المكونات ─────────────────────────────────────────────────────
import { renderHome }          from './components/home.js';
import { renderCoursesGrid }   from './components/courses.js';
import { renderCourseDetail }  from './components/course-detail.js';
import { renderPlan }          from './components/plan.js';
import { renderContact }       from './components/contact.js';

// ── واجهة المستخدم ───────────────────────────────────────────────
import { updateModeBadge, initHamburger } from './ui/navigation.js';
import { initProgressBar }     from './ui/progress.js';
import {
    showCheerMessage, closeModal,
    showFridayModal, closeFridayModal,
    showWelcomeModal, hideWelcomeModal,
    selectMode, goToStep, onDateChange,
    buildConfirmStep, launchFreeMode, launchCourseMode,
    resetSetup
} from './ui/modal.js';

// ================================================================
// 1. معالجة البيانات الخام وتحويلها إلى أقسام منظمة
// ================================================================

/** مصفوفة الكراسات الكاملة مع الأقسام المحوّلة */
const courses = rawCourses.map(course => ({
    ...course,
    lessons: course.lessons.map(lesson => ({
        title: lesson.title,
        sections: parseSectionsFromContent(lesson.content),
        _raw: lesson.content,
    })),
}));

// ================================================================
// 2. تسجيل المكونات كدوال عامة (للاستخدام من onclick في HTML)
// ================================================================

// التنقل — متاح عالمياً لأن HTML يستخدمه في onclick
window.navigateTo = (section, params) => {
    navigateTo(section, params);
};

// نوافذ الترحيب — يستخدمها HTML مباشرة
window.selectMode      = selectMode;
window.goToStep        = (step) => goToStep(step, courses);
window.onDateChange    = onDateChange;
window.launchFreeMode  = () => launchFreeMode(window.navigateTo);
window.launchCourseMode = () => launchCourseMode(window.navigateTo, courses);
window.resetSetup      = () => resetSetup(window.navigateTo, courses);

// نافذة الجمعة
window.showFridayModal = () => showFridayModal(courses);
window.closeFridayModal = closeFridayModal;

// نافذة التشجيع
window.closeModal      = closeModal;

// أحداث الدروس
window.toggleLesson    = toggleLesson;
window.completeLesson  = completeLesson;

// ================================================================
// 3. عرض القسم الحالي — يستمع لتغييرات store
// ================================================================

const appContainer = document.getElementById('appContainer');

function renderSection(state) {
    let html = '';
    switch (state.section) {
        case 'home':    html = renderHome(courses);                                         break;
        case 'plan':    html = renderPlan(courses);                                         break;
        case 'courses': html = renderCoursesGrid(courses);                                  break;
        case 'contact': html = renderContact();                                             break;
        case 'course':  html = renderCourseDetail(courses, state.courseId, state.lessonIndex); break;
        default:        html = renderHome(courses);
    }
    appContainer.innerHTML = html;
}

// الاشتراك في store لإعادة العرض تلقائياً عند تغيير الحالة
store.subscribe(renderSection);

// ================================================================
// 4. دوال التفاعل مع الدروس
// ================================================================

/**
 * تبديل فتح/إغلاق محتوى درس
 * @param {HTMLElement} header
 */
function toggleLesson(header) {
    const body = header.nextElementSibling;
    body.classList.toggle('active');
    const icon = header.querySelector('.lesson-meta i');
    if (body.classList.contains('active')) {
        icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
    } else {
        icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
    }
}

/**
 * تعيين درس كمكتمل وعرض رسالة تشجيع
 * @param {Event} event
 * @param {number} courseId
 * @param {number} lessonIndex
 * @param {string} courseTitle
 * @param {string} lessonTitle
 */
function completeLesson(event, courseId, lessonIndex, courseTitle, lessonTitle) {
    event.stopPropagation();
    if (isLessonDone(courseId, lessonIndex)) {
        showCheerMessage("🎯", "الدرس مكتمل بالفعل!", "أنت ممتاز! واصل التقدم.");
        return;
    }
    setLessonDone(courseId, lessonIndex);
    navigateTo('course', { courseId, lessonIndex });

    const msgs = [
        "أحسنت يا بطل! 🌟", "ممتاز! استمر! 💪",
        "رائع! أنت تتقدم بثبات 🚀", "ما شاء الله عليك! 👏",
        "أنت بطل حصون الإيمان! 🏆"
    ];
    showCheerMessage(
        "🌟🌟🌟🌟🌟",
        msgs[Math.floor(Math.random() * msgs.length)],
        "لقد أتممت الدرس بنجاح، واصل رحلتك الإيمانية!"
    );
}

// ================================================================
// 5. تهيئة التطبيق عند التحميل
// ================================================================

window.onload = function () {
    // إخفاء شاشة البداية
    setTimeout(() => {
        const splash = document.getElementById('splashScreen');
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => splash.remove(), 500);
        }
    }, 1300);

    // تفعيل عناصر UI
    initHamburger();
    initProgressBar();
    updateModeBadge();

    // العرض الأولي
    navigateTo('home');

    // نافذة الترحيب أو الجمعة
    setTimeout(() => {
        if (!isSetupDone()) {
            showWelcomeModal();
        } else if (isTodayFriday() && localStorage.getItem('hosoon_mode') === 'course') {
            const fridayKey = 'hosoon_friday_' + toLocalDateStr(new Date());
            if (!localStorage.getItem(fridayKey)) {
                localStorage.setItem(fridayKey, '1');
                setTimeout(() => showFridayModal(courses), 1600);
            }
        }
    }, 1500);

    // إغلاق نافذة التشجيع بالنقر خارجها
    document.getElementById('cheerModal')?.addEventListener('click', function (e) {
        if (e.target === this) closeModal();
    });
};

// ================================================================
// 6. Service Worker
// ================================================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('[PWA] Service Worker مسجّل:', reg.scope))
            .catch(err => console.warn('[PWA] فشل:', err));
    });
}

// ================================================================
// 7. تثبيت التطبيق (PWA Install Banner)
// ================================================================

let deferredPrompt = null;
const installBanner = document.getElementById('installBanner');
const btnInstall    = document.getElementById('btnInstall');
const btnDismiss    = document.getElementById('btnDismiss');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    setTimeout(() => {
        if (!localStorage.getItem('pwa_dismissed')) installBanner?.classList.add('show');
    }, 3000);
});

btnInstall?.addEventListener('click', async () => {
    installBanner.classList.remove('show');
    if (deferredPrompt) {
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
    }
});

btnDismiss?.addEventListener('click', () => {
    installBanner.classList.remove('show');
    localStorage.setItem('pwa_dismissed', '1');
});

// تلميح تثبيت iOS
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
if (isIOS && !isStandalone && !localStorage.getItem('ios_hint_shown')) {
    setTimeout(() => {
        const iosHint = document.createElement('div');
        iosHint.style.cssText = `
            position:fixed;bottom:20px;left:50%;transform:translateX(-50%);
            background:#1B3A4B;color:white;padding:14px 20px;border-radius:16px;
            box-shadow:0 8px 30px rgba(0,0,0,0.4);z-index:9999;
            text-align:center;max-width:300px;width:calc(100% - 40px);
            border:1px solid rgba(212,175,55,0.4);font-family:'Cairo',sans-serif;
        `;
        iosHint.innerHTML = `
            <div style="font-size:1.5rem;margin-bottom:8px">📲</div>
            <strong style="color:#D4AF37;display:block;margin-bottom:4px">ثبّت التطبيق على iPhone</strong>
            <span style="font-size:0.85rem;color:rgba(255,255,255,0.8)">
                اضغط على <strong>مشاركة</strong> ⬆️ ثم <strong>"إضافة إلى الشاشة الرئيسية"</strong>
            </span>
            <button onclick="this.parentElement.remove();localStorage.setItem('ios_hint_shown','1')"
                style="margin-top:10px;background:#D4AF37;color:#000;border:none;padding:7px 20px;border-radius:20px;font-weight:700;cursor:pointer;font-family:'Cairo',sans-serif;">
                فهمت ✓
            </button>
        `;
        document.body.appendChild(iosHint);
        localStorage.setItem('ios_hint_shown', '1');
    }, 3000);
}
