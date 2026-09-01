/** Paleta de busca global estilo command palette (Ctrl+K) */
export function initQuickSearch(products) {
    let palette = null;

    function build() {
        if (palette) return palette;
        palette = document.createElement('div');
        palette.id = 'quick-search';
        palette.className = 'quick-search hidden fixed inset-0 z-[110] items-start justify-center pt-[15vh] px-4';
        palette.innerHTML = `
            <div class="quick-search__backdrop absolute inset-0 bg-on-background/60" data-qs-close></div>
            <div class="relative w-full max-w-xl bg-white border-4 border-on-surface shadow-[8px_8px_0_#2aff00]">
                <div class="flex items-center gap-2 px-4 border-b-2 border-on-surface">
                    <span class="material-symbols-outlined text-outline">search</span>
                    <input type="search" data-qs-input placeholder="Buscar produtos, departamentos..." class="flex-1 py-4 font-body-md border-none focus:ring-0" autocomplete="off"/>
                    <kbd class="hidden sm:inline text-xs bg-surface-container px-2 py-1 font-label-bold">ESC</kbd>
                </div>
                <div data-qs-results class="max-h-64 overflow-y-auto"></div>
            </div>
        `;
        document.body.appendChild(palette);

        palette.querySelector('[data-qs-close]').addEventListener('click', close);
        palette.querySelector('[data-qs-input]').addEventListener('input', (e) => renderResults(e.target.value));
        palette.querySelector('[data-qs-input]').addEventListener('keydown', (e) => {
            if (e.key === 'Escape') close();
        });
        return palette;
    }

    function renderResults(q) {
        const results = palette.querySelector('[data-qs-results]');
        const term = q.trim().toLowerCase();
        const matches = term
            ? products.filter((p) => p.name.toLowerCase().includes(term)).slice(0, 8)
            : products.slice(0, 5);

        results.innerHTML = matches.length
            ? matches.map((p) => `
                <a href="busca.html?q=${encodeURIComponent(p.name)}" class="flex items-center gap-3 px-4 py-3 hover:bg-surface-container border-b border-outline-variant/20">
                    <img src="${p.image}" alt="" class="w-10 h-10 object-cover"/>
                    <span class="font-label-bold text-sm">${p.name}</span>
                    <span class="ml-auto text-primary font-label-bold text-sm">${p.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </a>
            `).join('')
            : '<p class="px-4 py-6 text-on-surface-variant text-sm">Nenhum resultado.</p>';
    }

    function open() {
        build();
        palette.classList.remove('hidden');
        palette.classList.add('flex');
        palette.querySelector('[data-qs-input]').value = '';
        renderResults('');
        palette.querySelector('[data-qs-input]').focus();
    }

    function close() {
        palette?.classList.add('hidden');
        palette?.classList.remove('flex');
    }

    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            open();
        }
    });
}
