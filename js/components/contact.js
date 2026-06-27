// ================================================================
// js/components/contact.js — صفحة التواصل
// ================================================================

/**
 * بناء HTML لصفحة التواصل
 * @returns {string}
 */
export function renderContact() {
    return `
        <div class="author-card" style="margin-bottom:28px;">
            <div class="author-emblem">🛡️</div>
            <div class="author-label">إعداد وتأليف المادة العلمية والمنهج</div>
            <div class="author-name">محمد أبو عبد الرحمن</div>
            <div class="author-dua">عفا الله عنه ووالديه وجميع المسلمين</div>
            <div class="author-divider"></div>
            <span class="author-edition">
                <i class="fas fa-book-open" style="color:#D4AF37"></i>
                حصون الإيمان — الإصدار الأول 2026م
            </span>
        </div>
        <div class="contact-box">
            <h2><i class="fas fa-headset"></i> تواصل معنا</h2>
            <p style="font-size:1.1rem;color:var(--text-light);">للاستفسارات أو الدعم الفني</p>
            <div class="contact-buttons">
                <a href="https://chat.whatsapp.com/ImbpCTYkTwHJvD9akTAIPD" target="_blank" class="wa">
                    <i class="fab fa-whatsapp"></i> واتساب
                </a>
                <a href="https://t.me/+bHRjkt2DD_BmODhk" class="tg">
                    <i class="fab fa-telegram"></i> تليجرام
                </a>
                <a href="mailto:abukora8@gmail.com" class="em">
                    <i class="far fa-envelope"></i> البريد الإلكتروني
                </a>
            </div>
        </div>
    `;
}
