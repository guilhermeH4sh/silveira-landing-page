import { trackEvent } from './analytics.js';

const KEY = 'silveira_welcome_seen';

/**
 * Dica de boas-vindas na primeira visita da sessão/dispositivo.
 */
export function initWelcomeTip() {
    if (localStorage.getItem(KEY) === '1') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        localStorage.setItem(KEY, '1');
        return;
    }

    const tip = document.createElement('div');
    tip.id = 'welcome-tip';
    tip.className = 'welcome-tip';
    tip.setAttribute('role', 'dialog');
    tip.setAttribute('aria-label', 'Dica de boas-vindas');
    tip.innerHTML = `
        <button type="button" data-welcome-close class="absolute top-2 right-2 p-1" aria-label="Fechar">
            <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
        <p class="font-label-bold text-sm uppercase text-primary mb-1">Bem-vindo ao Silveira</p>
        <p class="font-body-md text-sm mb-3">Pressione <kbd>?</kbd> para ver atalhos ou <kbd>Ctrl</kbd>+<kbd>K</kbd> para buscar.</p>
        <a href="ofertas.html" class="font-label-bold text-sm text-secondary hover:underline">Ver ofertas da semana →</a>
    `;
    document.body.appendChild(tip);

    const dismiss = () => {
        tip.remove();
        localStorage.setItem(KEY, '1');
        trackEvent('welcome_tip_dismiss');
    };

    tip.querySelector('[data-welcome-close]')?.addEventListener('click', dismiss);
    setTimeout(dismiss, 12000);
    trackEvent('welcome_tip_show');
}
