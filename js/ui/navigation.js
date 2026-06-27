// ================================================================
// js/ui/navigation.js — دوال التنقل وبادج الوضع
// ================================================================

import { loadMode, loadStartDate } from '../services/storage.js';
import { calcStudyDay } from '../services/scheduler.js';

/**
 * تحديث بادج الوضع في شريط التنقل
 */
export function updateModeBadge() {
    const badge = document.getElementById('modeBadge');
    if (!badge) return;
    const mode = loadMode();
    if (mode === 'course') {
        const startDate = loadStartDate();
        const day = startDate ? Math.min(calcStudyDay(startDate) + 1, 45) : 1;
        badge.innerHTML = `<span class="mode-badge"><i class="fas fa-graduation-cap"></i> يوم ${Math.max(1, day)} من 45</span>`;
    } else if (mode === 'free') {
        badge.innerHTML = `<span class="mode-badge free-mode"><i class="fas fa-search"></i> تصفح حر</span>`;
    } else {
        badge.innerHTML = '';
    }
}

/**
 * تفعيل قائمة الهامبرغر
 */
export function initHamburger() {
    document.getElementById('hamburger')?.addEventListener('click', function () {
        document.getElementById('navLinks').classList.toggle('active');
    });
}
