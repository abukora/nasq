// ================================================================
// js/state/store.js — إدارة الحالة المركزية
// ================================================================

/**
 * الحالة المركزية للتطبيق — مبدأ المصدر الوحيد للحقيقة
 * @type {{ state: object, listeners: Function[], setState: Function, subscribe: Function, getState: Function }}
 */
export const store = {
    state: {
        /** القسم الحالي: 'home' | 'courses' | 'plan' | 'contact' | 'course' */
        section: 'home',
        /** معرّف الكراسة المفتوحة حالياً (null إذا لم تكن مفتوحة) */
        courseId: null,
        /** فهرس الدرس الحالي (0-based) */
        lessonIndex: 0,
    },

    /** قائمة المستمعين على تغييرات الحالة */
    listeners: [],

    /**
     * تحديث الحالة ودفع التغييرات إلى جميع المستمعين
     * @param {Partial<typeof store.state>} newState
     */
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.listeners.forEach(listener => listener(this.state));
    },

    /**
     * الاشتراك في تغييرات الحالة
     * @param {Function} listener
     * @returns {Function} دالة لإلغاء الاشتراك
     */
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    },

    /**
     * قراءة الحالة الحالية
     * @returns {typeof store.state}
     */
    getState() {
        return this.state;
    }
};
