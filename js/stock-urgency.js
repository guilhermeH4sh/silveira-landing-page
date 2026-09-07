/**
 * Destaca visualmente produtos com estoque baixo (urgência).
 */
export function initStockUrgency() {
    const mark = () => {
        document.querySelectorAll('[data-product-id]').forEach((card) => {
            const stock = card.querySelector('.font-label-bold.text-tertiary');
            if (!stock || !/estoque baixo/i.test(stock.textContent || '')) return;
            card.classList.add('stock-urgency');
            if (!card.querySelector('[data-stock-urgency]')) {
                const badge = document.createElement('span');
                badge.dataset.stockUrgency = '';
                badge.className = 'stock-urgency__pulse';
                badge.textContent = 'Últimas unidades';
                card.appendChild(badge);
            }
        });
    };

    mark();
    const grid = document.querySelector('[data-products-grid]');
    if (grid) {
        const obs = new MutationObserver(mark);
        obs.observe(grid, { childList: true, subtree: true });
    }
}
