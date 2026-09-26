import { updateQty, getCart } from './cart.js';
import { trackEvent } from './analytics.js';

/**
 * Substitui o display de quantidade do carrinho por input editável,
 * permitindo digitar a quantidade desejada (1–99).
 */
export function initQtyInput() {
    document.addEventListener('change', (e) => {
        const input = e.target.closest('[data-qty-input]');
        if (!input) return;

        const id = input.dataset.qtyInput;
        let qty = parseInt(input.value, 10);
        if (Number.isNaN(qty) || qty < 0) qty = 0;
        if (qty > 99) qty = 99;
        input.value = String(qty);

        updateQty(id, qty);
        trackEvent('cart_qty_input', { product_id: id, qty });
    });

    document.addEventListener('keydown', (e) => {
        const input = e.target.closest?.('[data-qty-input]');
        if (!input || e.key !== 'Enter') return;
        e.preventDefault();
        input.blur();
    });
}

/** HTML do input de quantidade para uso em renderCartItem. */
export function qtyInputHtml(item) {
    return `<input type="number" min="0" max="99" value="${item.qty}" data-qty-input="${item.id}"
        class="qty-input w-12 h-8 border-2 border-on-surface text-center font-label-bold"
        aria-label="Quantidade de ${item.name}"/>`;
}

export function syncQtyInputs() {
    getCart().forEach((item) => {
        document.querySelectorAll(`[data-qty-input="${item.id}"]`).forEach((el) => {
            if (document.activeElement !== el) el.value = String(item.qty);
        });
    });
}
