// ================================================================
// js/services/parser.js — تحليل محتوى HTML إلى أقسام منظمة
// ================================================================

import { TYPE_MAP } from '../config/constants.js';

/**
 * تحليل محتوى HTML واستخراج أقسام منظمة
 * يعالج وجود وسوم <strong> ويستخرج النصوص الصحيحة
 * @param {string} htmlText - نص HTML للدرس
 * @returns {{ type: string, content: string, source?: string }[]}
 */
export function parseSectionsFromContent(htmlText) {
    const sections = [];
    const div = document.createElement('div');
    div.innerHTML = htmlText;

    const paragraphs = div.querySelectorAll('p');

    paragraphs.forEach(p => {
        const fullText = p.textContent.trim();
        if (!fullText) return;

        const strongEl = p.querySelector('strong');
        let matchedType = null;
        let contentText = fullText;

        if (strongEl) {
            const strongText = strongEl.textContent.trim();
            const cleanStrong = strongText.replace(/:$/, '').trim();

            for (const [key, type] of Object.entries(TYPE_MAP)) {
                if (cleanStrong === key) {
                    matchedType = type;
                    const regex = new RegExp(strongText + '\\s*:?\\s*');
                    contentText = fullText.replace(regex, '').trim();
                    break;
                }
            }
        }

        if (!matchedType) {
            for (const [key, type] of Object.entries(TYPE_MAP)) {
                if (fullText.startsWith(key + ':')) {
                    matchedType = type;
                    contentText = fullText.substring(key.length + 1).trim();
                    break;
                }
            }
        }

        const section = { type: matchedType || 'paragraph', content: contentText || fullText };

        if (section.type === 'quote') {
            const sourceMatch = section.content.match(/\(([^)]+)\)/);
            if (sourceMatch) {
                section.source = sourceMatch[1];
                section.content = section.content.replace(/\([^)]+\)/, '').trim();
            }
        }

        sections.push(section);
    });

    if (sections.length === 0 && div.textContent.trim()) {
        sections.push({ type: 'paragraph', content: div.textContent.trim() });
    }

    return sections;
}
