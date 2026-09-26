/**
 * Labels dietéticas / selos de produto (orgânico, integral, zero lactose…).
 */
const LABEL_META = {
    organico: { label: 'Orgânico', className: 'dietary--organico' },
    integral: { label: 'Integral', className: 'dietary--integral' },
    'zero-lactose': { label: 'Zero lactose', className: 'dietary--lactose' },
    vegano: { label: 'Vegano', className: 'dietary--vegano' },
    'sem-gluten': { label: 'Sem glúten', className: 'dietary--gluten' },
};

export function renderDietaryLabels(labels = []) {
    if (!Array.isArray(labels) || !labels.length) return '';
    return `<div class="dietary-labels" aria-label="Selos do produto">
        ${labels
            .map((id) => {
                const meta = LABEL_META[id];
                if (!meta) return '';
                return `<span class="dietary-label ${meta.className}">${meta.label}</span>`;
            })
            .join('')}
    </div>`;
}

export function dietaryFilterOptions() {
    return Object.entries(LABEL_META).map(([id, meta]) => ({ id, label: meta.label }));
}

/**
 * Injeta filtro por selo dietético na toolbar do catálogo.
 */
export function initDietaryFilter() {
    const grid = document.querySelector('[data-products-grid]');
    if (!grid) return;
    const toolbar = grid.previousElementSibling;
    if (!toolbar?.querySelector('[data-sort]')) return;
    if (toolbar.querySelector('[data-dietary-filter]')) return;

    const wrap = document.createElement('div');
    wrap.className = 'flex flex-wrap gap-2 items-center';
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', 'Filtrar por selo');
    wrap.innerHTML = `
        <span class="font-label-bold text-sm">Selos:</span>
        <button type="button" data-dietary-filter="all" class="dietary-filter-btn is-active font-label-bold text-xs uppercase px-3 py-1 border-2 border-on-surface">Todos</button>
        ${dietaryFilterOptions()
            .map(
                (o) =>
                    `<button type="button" data-dietary-filter="${o.id}" class="dietary-filter-btn font-label-bold text-xs uppercase px-3 py-1 border-2 border-on-surface">${o.label}</button>`
            )
            .join('')}
    `;
    toolbar.appendChild(wrap);

    wrap.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-dietary-filter]');
        if (!btn) return;
        wrap.querySelectorAll('.dietary-filter-btn').forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        window.dispatchEvent(
            new CustomEvent('catalog:dietary-filter', { detail: { dietary: btn.dataset.dietaryFilter } })
        );
    });
}
