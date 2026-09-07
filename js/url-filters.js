/**
 * Sincroniza ordenação/filtro do catálogo com query string (?sort=&filter=).
 */
export function initUrlFilters() {
    const grid = document.querySelector('[data-products-grid]');
    if (!grid) return;

    const params = new URLSearchParams(window.location.search);
    const sort = params.get('sort');
    const filter = params.get('filter');

    requestAnimationFrame(() => {
        const sortEl = document.querySelector('[data-sort]');
        if (sortEl && sort) {
            sortEl.value = sort;
            sortEl.dispatchEvent(new Event('change', { bubbles: true }));
        }
        if (filter) {
            const btn = document.querySelector(`[data-filter="${filter}"]`);
            btn?.click();
        }
    });

    document.addEventListener('change', (e) => {
        if (!e.target.matches?.('[data-sort]')) return;
        const url = new URL(window.location);
        const value = e.target.value;
        if (value && value !== 'default') url.searchParams.set('sort', value);
        else url.searchParams.delete('sort');
        history.replaceState(null, '', url);
    });

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-filter]');
        if (!btn) return;
        const url = new URL(window.location);
        const value = btn.dataset.filter;
        if (value && value !== 'all') url.searchParams.set('filter', value);
        else url.searchParams.delete('filter');
        history.replaceState(null, '', url);
    });
}
