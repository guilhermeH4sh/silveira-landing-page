import { formatPrice } from './cart.js';
import { trackEvent } from './analytics.js';

/**
 * Retorna até `limit` produtos do mesmo departamento, excluindo o atual.
 */
export function getRelatedProducts(products, product, limit = 3) {
    if (!product) return [];
    return products
        .filter((p) => p.department === product.department && p.id !== product.id)
        .slice(0, limit);
}

export function renderRelatedHtml(related) {
    if (!related.length) return '';
    return `
        <div class="mt-6 pt-4 border-t-2 border-outline-variant" data-related-products>
            <h3 class="font-label-bold text-sm uppercase mb-3">Você também pode gostar</h3>
            <div class="grid grid-cols-3 gap-2">
                ${related
                    .map(
                        (p) => `
                    <button type="button" data-product-detail="${p.id}" class="text-left border border-on-surface p-2 hover:bg-surface-container transition-colors">
                        <img src="${p.image}" alt="" class="w-full h-16 object-cover mb-1" loading="lazy"/>
                        <span class="font-label-bold text-[10px] line-clamp-2 block">${p.name}</span>
                        <span class="text-primary text-xs font-label-bold">${formatPrice(p.price)}</span>
                    </button>`
                    )
                    .join('')}
            </div>
        </div>`;
}

export function attachRelatedTracking(container) {
    container?.querySelector('[data-related-products]')?.addEventListener(
        'click',
        () => trackEvent('click_related_product'),
        { once: true }
    );
}
