import { trackEvent } from './analytics.js';

const STORAGE_KEY = 'silveira_theme';

function systemPrefersDark() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function getTheme() {
    return localStorage.getItem(STORAGE_KEY) || (systemPrefersDark() ? 'dark' : 'light');
}

export function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0b1020' : '#0d6e00');
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
        btn.setAttribute('aria-pressed', String(theme === 'dark'));
        const icon = btn.querySelector('.material-symbols-outlined');
        if (icon) icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
    });
}

/**
 * Tema claro/escuro com respeito à preferência do sistema até escolha explícita.
 */
export function initTheme() {
    applyTheme(getTheme());

    const toolbar = document.getElementById('a11y-toolbar');
    if (toolbar && !toolbar.querySelector('[data-theme-toggle]')) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.dataset.themeToggle = '';
        btn.className = 'a11y-btn';
        btn.title = 'Alternar tema claro/escuro';
        btn.setAttribute('aria-pressed', String(getTheme() === 'dark'));
        btn.innerHTML = '<span class="material-symbols-outlined text-[20px]">dark_mode</span>';
        toolbar.appendChild(btn);
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('[data-theme-toggle]')) return;
        const next = getTheme() === 'dark' ? 'light' : 'dark';
        localStorage.setItem(STORAGE_KEY, next);
        applyTheme(next);
        trackEvent('toggle_theme', { theme: next });
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (localStorage.getItem(STORAGE_KEY)) return;
        applyTheme(e.matches ? 'dark' : 'light');
    });
}
