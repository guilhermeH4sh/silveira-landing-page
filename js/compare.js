const STORAGE_KEY = 'silveira_compare';
const MAX = 3;

export function getCompareList() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
        return [];
    }
}

export function toggleCompare(productId) {
    let list = getCompareList();
    if (list.includes(productId)) {
        list = list.filter((id) => id !== productId);
    } else if (list.length < MAX) {
        list.push(productId);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('compare:updated'));
    return list;
}

export function initCompareBar(products) {
    let bar = document.getElementById('compare-bar');

    function render() {
        const ids = getCompareList();
        if (!ids.length) {
            bar?.remove();
            bar = null;
            return;
        }

        if (!bar) {
            bar = document.createElement('div');
            bar.id = 'compare-bar';
            bar.className = 'fixed bottom-0 left-0 right-0 z-50 bg-inverse-surface text-surface-variant border-t-4 border-primary p-4';
            document.body.appendChild(bar);
        }

        const items = ids.map((id) => products.find((p) => p.id === id)).filter(Boolean);
        bar.innerHTML = `
            <div class="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
                <span class="font-label-bold text-primary-fixed">Comparar (${items.length}/${MAX})</span>
                <div class="flex gap-2 flex-wrap">${items.map((p) => `<span class="text-sm">${p.name}</span>`).join(' · ')}</div>
                <a href="comparar.html" class="brutalist-button bg-primary-fixed text-on-primary-fixed font-label-bold px-4 py-2 text-sm uppercase border-2 border-on-surface">Ver comparação</a>
            </div>
        `;
    }

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-compare-id]');
        if (!btn) return;
        toggleCompare(btn.dataset.compareId);
        render();
    });

    window.addEventListener('compare:updated', render);
    render();
}

export function renderComparePage(products) {
    const container = document.querySelector('[data-compare-table]');
    if (!container) return;

    const items = getCompareList().map((id) => products.find((p) => p.id === id)).filter(Boolean);
    if (!items.length) {
        container.innerHTML = '<p class="font-body-lg">Selecione produtos para comparar.</p>';
        return;
    }

    const rows = [
        ['Produto', ...items.map((p) => p.name)],
        ['Preço', ...items.map((p) => p.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))],
        ['Unidade', ...items.map((p) => p.unit)],
        ['Estoque', ...items.map((p) => p.stock ?? '—')],
    ];

    container.innerHTML = `
        <div class="overflow-x-auto border-2 border-on-surface">
            <table class="w-full text-left font-body-md">
                ${rows.map(([label, ...cols]) => `
                    <tr class="border-b border-outline-variant/30">
                        <th class="p-4 bg-surface-container font-label-bold">${label}</th>
                        ${cols.map((c) => `<td class="p-4">${c}</td>`).join('')}
                    </tr>
                `).join('')}
            </table>
        </div>
    `;
}
