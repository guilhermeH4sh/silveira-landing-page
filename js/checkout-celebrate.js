import { trackEvent } from './analytics.js';

/**
 * Animação de celebração ao concluir o checkout (passo 3).
 */
export function celebrateCheckout() {
    const root = document.querySelector('[data-checkout-panel="3"]');
    if (!root || root.classList.contains('hidden')) return;

    const layer = document.createElement('div');
    layer.className = 'celebrate-layer';
    layer.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 24; i += 1) {
        const piece = document.createElement('span');
        piece.className = 'celebrate-piece';
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.animationDelay = `${Math.random() * 0.6}s`;
        piece.style.background = i % 3 === 0 ? '#0d6e00' : i % 3 === 1 ? '#2aff00' : '#c0000a';
        layer.appendChild(piece);
    }
    document.body.appendChild(layer);
    trackEvent('checkout_celebrate');
    setTimeout(() => layer.remove(), 2200);
}

export function initCheckoutCelebrate() {
    const root = document.querySelector('[data-checkout]');
    if (!root) return;

    const observer = new MutationObserver(() => {
        const panel = root.querySelector('[data-checkout-panel="3"]');
        if (panel && !panel.classList.contains('hidden')) {
            celebrateCheckout();
            observer.disconnect();
        }
    });

    observer.observe(root, { attributes: true, subtree: true, attributeFilter: ['class'] });
}
