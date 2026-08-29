import { renderProductCard } from './render.js';
import { syncFavoriteButtons } from './favorites.js';

function sortProducts(list, sortBy) {
    const sorted = [...list];
    switch (sortBy) {
        case 'price-asc':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-desc':
            return sorted.sort((a, b) => b.price - a.price);
        case 'name':
            return sorted.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
        default:
            return sorted;
    }
}

function filterProducts(list, filter) {
    if (filter === 'ofertas') return list.filter((p) => p.badge === 'OFERTA');
    if (filter === 'novos') return list.filter((p) => p.badge === 'NOVO');
    return list;
}

/** Toolbar de ordenação e filtros para páginas de departamento */
export function initCatalogFilters(products, onRender) {
    const grid = document.querySelector('[data-products-grid]');
    const dept = document.body.dataset.department;
    if (!grid || !dept) return;

    const toolbar = document.createElement('div');
    toolbar.className = 'flex flex-wrap gap-4 mb-8 items-center';
    toolbar.innerHTML = `
        <label class="flex items-center gap-2 font-label-bold text-sm">
            Ordenar:
            <select data-sort class="border-2 border-on-surface px-3 py-2 bg-white font-body-md focus:ring-2 focus:ring-primary">
                <option value="default">Relevância</option>
                <option value="price-asc">Menor preço</option>
                <option value="price-desc">Maior preço</option>
                <option value="name">Nome A–Z</option>
            </select>
        </label>
        <div class="flex gap-2" role="group" aria-label="Filtrar produtos">
            <button type="button" data-filter="all" class="filter-btn filter-btn--active px-4 py-2 border-2 border-on-surface font-label-bold text-sm uppercase">Todos</button>
            <button type="button" data-filter="ofertas" class="filter-btn px-4 py-2 border-2 border-on-surface font-label-bold text-sm uppercase">Ofertas</button>
            <button type="button" data-filter="novos" class="filter-btn px-4 py-2 border-2 border-on-surface font-label-bold text-sm uppercase">Novos</button>
        </div>
        <span data-result-count class="ml-auto font-body-md text-on-surface-variant text-sm"></span>
    `;
    grid.parentElement.insertBefore(toolbar, grid);

    let currentSort = 'default';
    let currentFilter = 'all';

    function apply() {
        let list = onRender();
        list = filterProducts(list, currentFilter);
        list = sortProducts(list, currentSort);
        grid.innerHTML = list.length
            ? list.map((p) => renderProductCard(p, { compact: true })).join('')
            : '<p class="col-span-full font-body-lg text-on-surface-variant">Nenhum produto encontrado com este filtro.</p>';
        toolbar.querySelector('[data-result-count]').textContent = `${list.length} produto(s)`;
        syncFavoriteButtons();
    }

    toolbar.querySelector('[data-sort]').addEventListener('change', (e) => {
        currentSort = e.target.value;
        apply();
    });

    toolbar.querySelectorAll('[data-filter]').forEach((btn) => {
        btn.addEventListener('click', () => {
            currentFilter = btn.dataset.filter;
            toolbar.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('filter-btn--active'));
            btn.classList.add('filter-btn--active');
            apply();
        });
    });

    apply();
}
