// ================================================================
// js/ui/progress.js — شريط التقدم العلوي
// ================================================================

const topBar = document.getElementById('topProgressBar');

/** عرض حركة شريط التقدم العلوي */
export function showTopProgress() {
    if (!topBar) return;
    topBar.style.width = '0%';
    topBar.style.display = 'block';
    let w = 0;
    const iv = setInterval(() => {
        w += Math.random() * 15;
        if (w > 85) { clearInterval(iv); w = 85; }
        topBar.style.width = w + '%';
    }, 80);
    setTimeout(() => {
        clearInterval(iv);
        topBar.style.width = '100%';
        setTimeout(() => { topBar.style.width = '0%'; }, 300);
    }, 600);
}

/**
 * تفعيل شريط التقدم عند النقر على روابط التنقل
 */
export function initProgressBar() {
    document.addEventListener('click', (e) => {
        const target = e.target.closest('[onclick]');
        if (target?.getAttribute('onclick')?.includes('navigateTo')) {
            showTopProgress();
        }
    });
}
