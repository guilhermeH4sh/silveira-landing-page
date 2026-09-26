import { trackEvent } from './analytics.js';

/**
 * Respeita prefers-reduced-motion de forma global:
 * - pausa animações CSS via classe no <html>
 * - permite sobrescrita manual via localStorage
 */
const STORAGE_KEY = 'silveira_reduced_motion';

export function prefersReducedMotion() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === '1') return true;
    if (stored === '0') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function applyReducedMotion(enabled) {
    document.documentElement.classList.toggle('reduce-motion', enabled);
    document.querySelectorAll('[data-motion-toggle]').forEach((btn) => {
        btn.setAttribute('aria-pressed', String(enabled));
        btn.title = enabled ? 'Reativar animações' : 'Reduzir animações';
    });
}

export function initReducedMotion() {
    applyReducedMotion(prefersReducedMotion());

    const toolbar = document.getElementById('a11y-toolbar');
    if (toolbar && !toolbar.querySelector('[data-motion-toggle]')) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.dataset.motionToggle = '';
        btn.className = 'a11y-btn';
        btn.title = 'Reduzir animações';
        btn.setAttribute('aria-pressed', String(prefersReducedMotion()));
        btn.innerHTML = '<span class="material-symbols-outlined text-[20px]">animation</span>';
        toolbar.appendChild(btn);
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('[data-motion-toggle]')) return;
        const next = !document.documentElement.classList.contains('reduce-motion');
        localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
        applyReducedMotion(next);
        trackEvent('toggle_reduced_motion', { enabled: next });
    });

    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
        if (localStorage.getItem(STORAGE_KEY)) return;
        applyReducedMotion(e.matches);
    });
}
