import { showToast } from './toast.js';
import { trackEvent } from './analytics.js';

const STORAGE_KEY = 'silveira_order_notes';

export function getOrderNotes() {
    return localStorage.getItem(STORAGE_KEY) || '';
}

export function setOrderNotes(text) {
    const clean = String(text || '').slice(0, 280);
    localStorage.setItem(STORAGE_KEY, clean);
    window.dispatchEvent(new CustomEvent('notes:updated', { detail: clean }));
    return clean;
}

/**
 * Campo de observações do pedido (interfone, portaria, etc.)
 * Persistido e reexibido no checkout.
 */
export function initCartNotes() {
    const roots = document.querySelectorAll('[data-order-notes]');
    if (!roots.length) return;

    roots.forEach((root) => {
        if (root.dataset.ready) return;
        root.dataset.ready = '1';
        root.innerHTML = `
            <label class="block font-label-bold text-sm mb-2" for="order-notes">
                Observações do pedido
            </label>
            <textarea id="order-notes" data-notes-field maxlength="280" rows="3"
                placeholder="Ex.: deixar na portaria, não tocar a campainha…"
                class="w-full border-2 border-on-surface px-3 py-2 font-body-md resize-y">${getOrderNotes()}</textarea>
            <p class="font-body-md text-xs text-on-surface-variant mt-1">
                <span data-notes-count>0</span>/280 caracteres
            </p>
        `;

        const field = root.querySelector('[data-notes-field]');
        const count = root.querySelector('[data-notes-count]');

        function sync() {
            count.textContent = String(field.value.length);
        }

        sync();
        field.addEventListener('input', () => {
            setOrderNotes(field.value);
            sync();
        });
        field.addEventListener('blur', () => {
            if (field.value.trim()) {
                showToast('Observação salva');
                trackEvent('save_order_notes', { length: field.value.length });
            }
        });
    });
}
