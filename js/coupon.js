import { showToast } from './toast.js';

const COUPONS = {
    SILVEIRA10: { discount: 0.10, label: '10% de desconto' },
    FRESCOR15: { discount: 0.15, label: '15% de desconto' },
    BAIRRO5: { discount: 0.05, label: '5% de desconto' },
};

const STORAGE_KEY = 'silveira_coupon';

export function getAppliedCoupon() {
    const code = localStorage.getItem(STORAGE_KEY);
    if (!code || !COUPONS[code]) return null;
    return { code, ...COUPONS[code] };
}

export function applyCoupon(code) {
    const upper = code.trim().toUpperCase();
    if (!COUPONS[upper]) return { ok: false, message: 'Cupom inválido ou expirado.' };
    localStorage.setItem(STORAGE_KEY, upper);
    return { ok: true, message: `Cupom ${upper} aplicado!`, coupon: { code: upper, ...COUPONS[upper] } };
}

export function removeCoupon() {
    localStorage.removeItem(STORAGE_KEY);
}

export function calcDiscount(subtotal) {
    const coupon = getAppliedCoupon();
    if (!coupon) return 0;
    return subtotal * coupon.discount;
}

export function initCouponForm(onUpdate) {
    const form = document.querySelector('[data-coupon-form]');
    const display = document.querySelector('[data-coupon-display]');
    if (!form) return;

    function refresh() {
        const coupon = getAppliedCoupon();
        if (display) {
            display.innerHTML = coupon
                ? `<span class="text-primary font-label-bold">${coupon.code}: ${coupon.label}</span>
                   <button type="button" data-coupon-remove class="ml-2 text-tertiary text-sm underline">Remover</button>`
                : '';
            display.querySelector('[data-coupon-remove]')?.addEventListener('click', () => {
                removeCoupon();
                refresh();
                onUpdate?.();
            });
        }
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('[name=coupon]');
        const result = applyCoupon(input?.value || '');
        showToast(result.ok ? result.message : result.message, result.ok ? 'success' : 'error');
        if (result.ok) {
            input.value = '';
            refresh();
            onUpdate?.();
        }
        return result;
    });

    refresh();
}
