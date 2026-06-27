// ================================================================
// js/config/constants.js — الثوابت العامة
// ================================================================

/** عدد الأيام الدراسية الإجمالية في الدورة */
export const TOTAL_STUDY_DAYS = 45;

/** أيام الأسبوع الدراسية (بدون الجمعة) */
export const DAYS_OF_WEEK = ['السبت','الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس'];

/** أسماء الأيام للعرض بالترتيب (0=الأحد ... 6=السبت) */
export const DAY_NAMES_AR = ['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];

/** أسماء الشهور بالعربية */
export const MONTH_NAMES_AR = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

/** مفاتيح localStorage */
export const LS_MODE       = 'hosoon_mode';        // 'course' | 'free'
export const LS_START_DATE = 'hosoon_start_date';  // 'YYYY-MM-DD'
export const LS_SETUP_DONE = 'hosoon_setup_done';  // '1'

/** خريطة تحديد نوع القسم من النص */
export const TYPE_MAP = {
    'الفقرة الأساسية': 'paragraph',
    'الفقرة': 'paragraph',
    'الدليل': 'quote',
    'الشرح': 'explanation',
    'النموذج التطبيقي': 'application',
    'النموذج': 'application',
    'الفائدة': 'benefit'
};

/** خريطة الأيقونات لكل نوع قسم */
export const ICON_MAP = {
    'paragraph':   'fa-paragraph',
    'quote':       'fa-quote-right',
    'explanation': 'fa-lightbulb',
    'application': 'fa-check-circle',
    'benefit':     'fa-gem'
};

/** خريطة التسميات لكل نوع قسم */
export const LABEL_MAP = {
    'paragraph':   '📌 الفقرة الأساسية',
    'quote':       '📖 الدليل',
    'explanation': '💡 الشرح',
    'application': '✅ النموذج التطبيقي',
    'benefit':     '🎯 الفائدة'
};
