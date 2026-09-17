import { formatPrice } from './cart.js';
import { trackEvent } from './analytics.js';

/**
 * Filtro por faixa de preço aplicado sobre o grid do catálogo.
 * Emite catalog:price-filter para que filters.js reaplique a listagem.
 */
export function initPriceRange(products) {
    const grid = document.querySelector('[data-products-grid]');
    const dept = document.body.dataset.department;
    if (!grid || !dept) return;

    const toolbar = grid.previousElementSibling;
    if (!toolbar || !toolbar.querySelector('[data-sort]')) return;

    const prices = products.map((p) => p.price);
    const min = Math.floor(Math.min(...prices));
    const max = Math.ceil(Math.max(...prices));
    if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) return;

    const wrap = document.createElement('label');
    wrap.className = 'flex items-center gap-2 font-label-bold text-sm';
    wrap.innerHTML = `
        Até <output data-price-output class="text-primary">${formatPrice(max)}</output>
        <input type="range" data-price-range min="${min}" max="${max}" step="1" value="${max}"
               class="accent-primary w-32" aria-label="Preço máximo"/>
    `;
    toolbar.appendChild(wrap);

    const input = wrap.querySelector('[data-price-range]');
    const output = wrap.querySelector('[data-price-output]');

    input.addEventListener('input', () => {
        const value = Number(input.value);
        output.textContent = formatPrice(value);
        window.dispatchEvent(new CustomEvent('catalog:price-filter', { detail: { max: value } }));
    });

    input.addEventListener('change', () => {
        trackEvent('filter_price_range', { max: Number(input.value) });
    });
}
