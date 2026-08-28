import { DEPARTMENTS } from './config.js';

export function initMobileNav() {
    const header = document.querySelector('header');
    if (!header || document.getElementById('mobile-nav-toggle')) return;

    const toggle = document.createElement('button');
    toggle.id = 'mobile-nav-toggle';
    toggle.type = 'button';
    toggle.className = 'lg:hidden p-2 text-primary hover:scale-105 transition-transform';
    toggle.setAttribute('aria-label', 'Abrir menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span class="material-symbols-outlined text-[28px]">menu</span>';

    const actions = header.querySelector('.justify-self-end, [class*="justify-self-end"]');
    if (actions) actions.prepend(toggle);

    const overlay = document.createElement('div');
    overlay.id = 'mobile-nav';
    overlay.className = 'mobile-nav-overlay fixed inset-0 z-[60] bg-on-background/60 lg:hidden';
    overlay.setAttribute('aria-hidden', 'true');

    const links = DEPARTMENTS.map((d) => {
        const cls = d.highlight
            ? 'font-label-bold text-tertiary font-black'
            : 'font-label-bold text-on-surface';
        return `<a class="${cls} py-3 border-b border-outline-variant/30 block" href="${d.href}">${d.label}</a>`;
    }).join('');

    overlay.innerHTML = `
        <div class="mobile-nav-panel absolute right-0 top-0 h-full w-[min(320px,85vw)] bg-surface border-l-4 border-on-surface shadow-[-8px_0_0_#2aff00] p-6 flex flex-col">
            <div class="flex justify-between items-center mb-8">
                <span class="font-label-bold text-primary uppercase tracking-widest">Menu</span>
                <button type="button" data-mobile-close class="p-2" aria-label="Fechar menu">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            <nav class="flex flex-col gap-1" aria-label="Menu mobile">${links}</nav>
        </div>
    `;
    document.body.appendChild(overlay);

    function open() {
        overlay.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');
        toggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        overlay.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    toggle.addEventListener('click', open);
    overlay.querySelector('[data-mobile-close]').addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}
