import { trackEvent } from './analytics.js';

const PAGE_SIZE = 12;

/**
 * Paginação incremental ("carregar mais") para grids longos de catálogo.
 * Opera sobre os cards já renderizados, sem reprocessar o dataset.
 */
export function initPagination() {
    const grid = document.querySelector('[data-products-grid]');
    if (!grid) return;

    let button = document.querySelector('[data-load-more]');
    if (!button) {
        button = document.createElement('button');
        button.type = 'button';
        button.dataset.loadMore = '';
        button.className =
            'brutalist-button mx-auto mt-8 block bg-secondary-container text-on-secondary-container font-label-bold py-3 px-8 uppercase border-2 border-on-surface';
        grid.after(button);
    }

    let visible = PAGE_SIZE;

    function apply() {
        const cards = [...grid.children];
        cards.forEach((card, i) => {
            card.classList.toggle('hidden', i >= visible);
        });

        const remaining = Math.max(0, cards.length - visible);
        button.textContent = `Carregar mais (${remaining})`;
        button.classList.toggle('hidden', remaining === 0);
    }

    button.addEventListener('click', () => {
        visible += PAGE_SIZE;
        apply();
        trackEvent('catalog_load_more', { visible });
    });

    const observer = new MutationObserver(() => {
        visible = PAGE_SIZE;
        apply();
    });
    observer.observe(grid, { childList: true });

    apply();
}
