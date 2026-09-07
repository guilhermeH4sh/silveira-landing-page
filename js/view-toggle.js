import { trackEvent } from './analytics.js';

const STORAGE_KEY = 'silveira_catalog_view';

/**
 * Alterna visualização grade/lista nos grids de catálogo.
 */
export function initViewToggle() {
    const grid = document.querySelector('[data-products-grid]');
    if (!grid) return;

    const toolbar = grid.previousElementSibling;
    if (!toolbar || !toolbar.querySelector('[data-sort]')) return;

    const wrap = document.createElement('div');
    wrap.className = 'flex gap-1 ml-2';
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', 'Modo de visualização');
    wrap.innerHTML = `
        <button type="button" data-view="grid" class="view-toggle-btn px-3 py-2 border-2 border-on-surface" aria-pressed="true" title="Grade">
            <span class="material-symbols-outlined text-[20px]">grid_view</span>
        </button>
        <button type="button" data-view="list" class="view-toggle-btn px-3 py-2 border-2 border-on-surface" aria-pressed="false" title="Lista">
            <span class="material-symbols-outlined text-[20px]">view_list</span>
        </button>
    `;
    toolbar.appendChild(wrap);

    function apply(mode) {
        grid.classList.toggle('catalog-list-view', mode === 'list');
        wrap.querySelectorAll('[data-view]').forEach((btn) => {
            const active = btn.dataset.view === mode;
            btn.setAttribute('aria-pressed', String(active));
            btn.classList.toggle('view-toggle-btn--active', active);
        });
        localStorage.setItem(STORAGE_KEY, mode);
        trackEvent('catalog_view_toggle', { mode });
    }

    wrap.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-view]');
        if (btn) apply(btn.dataset.view);
    });

    apply(localStorage.getItem(STORAGE_KEY) || 'grid');
}
