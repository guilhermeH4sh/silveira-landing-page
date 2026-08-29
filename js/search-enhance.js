const HISTORY_KEY = 'silveira_search_history';
const MAX_HISTORY = 5;

export function getSearchHistory() {
    try {
        return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    } catch {
        return [];
    }
}

function saveSearch(term) {
    const q = term.trim().toLowerCase();
    if (!q) return;
    const history = getSearchHistory().filter((h) => h !== q);
    history.unshift(q);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
}

/** Autocomplete e histórico de buscas */
export function initSearchEnhancements(products) {
    const input = document.querySelector('[data-search-input]');
    const listbox = document.querySelector('[data-search-suggestions]');
    if (!input || !listbox) return;

    function renderSuggestions(query) {
        const q = query.trim().toLowerCase();
        const history = getSearchHistory().filter((h) => !q || h.includes(q));
        const matches = q
            ? products.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 5)
            : [];

        const items = [
            ...history.map((h) => ({ type: 'history', label: h, value: h })),
            ...matches.map((p) => ({ type: 'product', label: p.name, value: p.name })),
        ].slice(0, 8);

        if (!items.length) {
            listbox.innerHTML = '';
            listbox.classList.add('hidden');
            return;
        }

        listbox.classList.remove('hidden');
        listbox.innerHTML = items.map((item, i) => `
            <button type="button" role="option" data-suggestion="${item.value}"
                class="w-full text-left px-4 py-2 hover:bg-surface-container font-body-md flex items-center gap-2">
                <span class="material-symbols-outlined text-sm text-outline">${item.type === 'history' ? 'history' : 'search'}</span>
                ${item.label}
            </button>
        `).join('');

        listbox.querySelectorAll('[data-suggestion]').forEach((btn) => {
            btn.addEventListener('click', () => {
                input.value = btn.dataset.suggestion;
                listbox.classList.add('hidden');
                input.dispatchEvent(new Event('input', { bubbles: true }));
            });
        });
    }

    input.addEventListener('input', () => renderSuggestions(input.value));
    input.addEventListener('focus', () => renderSuggestions(input.value));
    document.addEventListener('click', (e) => {
        if (!listbox.contains(e.target) && e.target !== input) {
            listbox.classList.add('hidden');
        }
    });

    const form = document.querySelector('[data-search-form]');
    form?.addEventListener('submit', () => saveSearch(input.value));
    input.addEventListener('change', () => saveSearch(input.value));
}
