import { loadStores } from './store-locator.js';
import { showToast } from './toast.js';
import { trackEvent } from './analytics.js';

const STORAGE_KEY = 'silveira_pickup_store';

export function getPickupStore() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    } catch {
        return null;
    }
}

export function setPickupStore(store) {
    if (!store) {
        localStorage.removeItem(STORAGE_KEY);
        return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    window.dispatchEvent(new CustomEvent('pickup:updated', { detail: store }));
}

/**
 * Seletor de retirada na loja (alternativa à entrega).
 */
export async function initPickupStore() {
    const root = document.querySelector('[data-pickup-store]');
    if (!root) return;

    const stores = await loadStores().catch(() => []);
    if (!stores.length) {
        root.innerHTML = '<p class="font-body-md text-sm text-on-surface-variant">Nenhuma loja disponível para retirada.</p>';
        return;
    }

    const selected = getPickupStore();
    const mode = localStorage.getItem('silveira_fulfillment') || 'delivery';

    root.innerHTML = `
        <fieldset class="border-2 border-on-surface p-4 mb-4">
            <legend class="font-label-bold text-sm uppercase px-2">Como deseja receber?</legend>
            <div class="flex flex-wrap gap-4 mb-4">
                <label class="flex items-center gap-2 font-body-md text-sm cursor-pointer">
                    <input type="radio" name="fulfillment" value="delivery" ${mode === 'delivery' ? 'checked' : ''}/>
                    Entrega
                </label>
                <label class="flex items-center gap-2 font-body-md text-sm cursor-pointer">
                    <input type="radio" name="fulfillment" value="pickup" ${mode === 'pickup' ? 'checked' : ''}/>
                    Retirar na loja
                </label>
            </div>
            <div data-pickup-list class="${mode === 'pickup' ? '' : 'hidden'} space-y-2">
                ${stores
                    .map(
                        (s) => `
                    <label class="flex items-start gap-3 border border-on-surface p-3 cursor-pointer hover:bg-surface-container has-[:checked]:bg-primary-container">
                        <input type="radio" name="pickup-store" value="${s.id}" ${selected?.id === s.id ? 'checked' : ''}/>
                        <span>
                            <span class="font-label-bold block">${s.name}</span>
                            <span class="font-body-md text-xs text-on-surface-variant">${s.address || ''} · ${s.hours || ''}</span>
                        </span>
                    </label>`
                    )
                    .join('')}
            </div>
        </fieldset>
    `;

    const list = root.querySelector('[data-pickup-list]');

    root.querySelectorAll('input[name="fulfillment"]').forEach((input) => {
        input.addEventListener('change', () => {
            localStorage.setItem('silveira_fulfillment', input.value);
            list.classList.toggle('hidden', input.value !== 'pickup');
            if (input.value === 'delivery') setPickupStore(null);
            trackEvent('fulfillment_mode', { mode: input.value });
        });
    });

    root.querySelectorAll('input[name="pickup-store"]').forEach((input) => {
        input.addEventListener('change', () => {
            const store = stores.find((s) => String(s.id) === input.value);
            if (!store) return;
            setPickupStore(store);
            showToast(`Retirada em: ${store.name}`);
            trackEvent('select_pickup_store', { store_id: store.id });
        });
    });
}
