import { getCart, addToCart, formatPrice } from './cart.js';
import { showToast } from './toast.js';
import { trackEvent } from './analytics.js';

const STORAGE_KEY = 'silveira_saved_lists';

export function getSavedLists() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
        return [];
    }
}

function persist(lists) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists.slice(0, 12)));
    window.dispatchEvent(new CustomEvent('lists:updated', { detail: lists }));
}

export function saveCurrentCart(name) {
    const cart = getCart();
    if (!cart.length) return null;

    const lists = getSavedLists();
    const entry = {
        id: `LST-${Date.now().toString(36).toUpperCase()}`,
        name: name || `Lista de ${new Date().toLocaleDateString('pt-BR')}`,
        createdAt: new Date().toISOString(),
        items: cart.map(({ id, name: n, qty, price, unit }) => ({ id, name: n, qty, price, unit })),
    };
    lists.unshift(entry);
    persist(lists);
    return entry;
}

export function deleteList(id) {
    persist(getSavedLists().filter((l) => l.id !== id));
}

function listTotal(list) {
    return list.items.reduce((sum, i) => sum + i.price * i.qty, 0);
}

export function renderSavedLists() {
    const root = document.querySelector('[data-saved-lists]');
    if (!root) return;

    const lists = getSavedLists();
    if (!lists.length) {
        root.innerHTML =
            '<p class="font-body-md text-on-surface-variant">Nenhuma lista salva. Monte um carrinho e clique em "Salvar lista".</p>';
        return;
    }

    root.innerHTML = lists
        .map(
            (l) => `
        <div class="border-2 border-on-surface bg-white p-4 mb-3" data-list-id="${l.id}">
            <div class="flex justify-between items-start gap-3 mb-2">
                <div>
                    <p class="font-label-bold">${l.name}</p>
                    <p class="text-xs text-on-surface-variant">${new Date(l.createdAt).toLocaleDateString('pt-BR')} · ${l.items.length} item(ns)</p>
                </div>
                <span class="font-price-display text-primary text-base">${formatPrice(listTotal(l))}</span>
            </div>
            <div class="flex gap-2 flex-wrap">
                <button type="button" data-list-restore="${l.id}" class="brutalist-button bg-secondary-container text-on-secondary-container font-label-bold text-xs px-3 py-2 uppercase border-2 border-on-surface">Adicionar ao carrinho</button>
                <button type="button" data-list-delete="${l.id}" class="font-label-bold text-xs uppercase text-tertiary hover:underline px-2">Excluir</button>
            </div>
        </div>`
        )
        .join('');
}

/**
 * Listas de compras recorrentes persistidas em localStorage.
 */
export function initSavedLists() {
    renderSavedLists();

    document.addEventListener('click', (e) => {
        const saveBtn = e.target.closest('[data-save-list]');
        if (saveBtn) {
            e.preventDefault();
            if (!getCart().length) {
                showToast('Carrinho vazio — adicione itens antes de salvar');
                return;
            }
            const name = window.prompt('Nome da lista:', `Compras de ${new Date().toLocaleDateString('pt-BR')}`);
            if (name === null) return;
            const entry = saveCurrentCart(name.trim());
            if (entry) {
                showToast(`Lista "${entry.name}" salva`);
                trackEvent('save_shopping_list', { items: entry.items.length });
                renderSavedLists();
            }
        }

        const restore = e.target.closest('[data-list-restore]');
        if (restore) {
            const list = getSavedLists().find((l) => l.id === restore.dataset.listRestore);
            if (!list) return;
            list.items.forEach((item) => addToCart(item, item.qty));
            showToast(`${list.items.length} item(ns) de "${list.name}" no carrinho`);
            trackEvent('restore_shopping_list', { list_id: list.id });
        }

        const del = e.target.closest('[data-list-delete]');
        if (del) {
            deleteList(del.dataset.listDelete);
            renderSavedLists();
            showToast('Lista removida');
        }
    });

    window.addEventListener('lists:updated', renderSavedLists);
}
