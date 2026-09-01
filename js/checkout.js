/** Checkout multi-step mock */
import { getCart, getCartTotal, clearCart } from './cart.js';
import { calcDiscount } from './coupon.js';
import { saveOrder } from './orders.js';
import { trackEvent } from './analytics.js';
import { showToast } from './toast.js';

export function initCheckout() {
    const root = document.querySelector('[data-checkout]');
    if (!root) return;

    let step = 1;

    function goTo(n) {
        step = n;
        root.querySelectorAll('[data-checkout-panel]').forEach((panel) => {
            panel.classList.toggle('hidden', panel.dataset.checkoutPanel !== String(n));
        });
        root.querySelectorAll('[data-step]').forEach((el) => {
            const active = el.dataset.step === String(n);
            el.classList.toggle('bg-primary-container', active);
            el.classList.toggle('bg-surface-container', !active);
        });
        if (n === 3) {
            const cart = getCart();
            const subtotal = getCartTotal();
            const discount = calcDiscount(subtotal);
            saveOrder(cart, subtotal - discount);
            clearCart();
            trackEvent('purchase_complete', { total: subtotal - discount });
        }
    }

    root.querySelectorAll('[data-checkout-next]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const cart = getCart();
            if (step === 1 && !cart.length) {
                showToast('Seu carrinho está vazio.', 'error');
                return;
            }
            if (step < 3) goTo(step + 1);
        });
    });

    const cep = root.querySelector('[data-checkout-cep]');
    cep?.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '').slice(0, 8);
        if (v.length > 5) v = `${v.slice(0, 5)}-${v.slice(5)}`;
        e.target.value = v;
    });
}
