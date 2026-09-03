import { getCart } from './cart.js';
import { showToast } from './toast.js';
import { trackEvent } from './analytics.js';

const IDLE_MS = 90_000;
const SESSION_KEY = 'silveira_cart_reminded';

/**
 * Lembra o usuário de um carrinho abandonado após período de inatividade.
 */
export function initCartReminder() {
    if (sessionStorage.getItem(SESSION_KEY) === '1') return;
    if (window.location.pathname.includes('carrinho') || window.location.pathname.includes('checkout')) {
        return;
    }

    let timer = null;

    function reset() {
        clearTimeout(timer);
        timer = setTimeout(maybeRemind, IDLE_MS);
    }

    function maybeRemind() {
        const cart = getCart();
        if (!cart.length || sessionStorage.getItem(SESSION_KEY) === '1') return;
        sessionStorage.setItem(SESSION_KEY, '1');
        showToast(`Você tem ${cart.length} item(ns) no carrinho. Finalize sua compra!`);
        trackEvent('cart_idle_reminder', { items: cart.length });
    }

    ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach((evt) => {
        window.addEventListener(evt, reset, { passive: true });
    });
    reset();
}
