import { showToast } from './toast.js';
import { trackEvent } from './analytics.js';

const STORAGE_KEY = 'silveira_delivery_slot';

const SLOTS = [
    { id: 'hoje-manha', label: 'Hoje · 9h–12h' },
    { id: 'hoje-tarde', label: 'Hoje · 14h–18h' },
    { id: 'hoje-noite', label: 'Hoje · 18h–21h' },
    { id: 'amanha-manha', label: 'Amanhã · 9h–12h' },
    { id: 'amanha-tarde', label: 'Amanhã · 14h–18h' },
];

export function getDeliverySlot() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    } catch {
        return null;
    }
}

export function setDeliverySlot(slot) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slot));
    window.dispatchEvent(new CustomEvent('delivery:updated', { detail: slot }));
}

export function initDeliverySlot() {
    const root = document.querySelector('[data-delivery-slots]');
    if (!root) return;

    const selected = getDeliverySlot();
    root.innerHTML = `
        <h2 class="font-label-bold text-sm uppercase mb-3">Horário de entrega</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2" role="radiogroup" aria-label="Escolha o horário">
            ${SLOTS.map(
                (s) => `
                <label class="delivery-slot border-2 border-on-surface p-3 cursor-pointer flex items-center gap-2 hover:bg-surface-container has-[:checked]:bg-primary-container has-[:checked]:border-primary">
                    <input type="radio" name="delivery-slot" value="${s.id}" class="accent-primary" ${selected?.id === s.id ? 'checked' : ''}/>
                    <span class="font-body-md text-sm">${s.label}</span>
                </label>`
            ).join('')}
        </div>
        <p class="font-body-md text-xs text-on-surface-variant mt-2" data-slot-feedback>
            ${selected ? `Selecionado: ${selected.label}` : 'Escolha um horário para agendar a entrega.'}
        </p>
    `;

    root.querySelectorAll('input[name="delivery-slot"]').forEach((input) => {
        input.addEventListener('change', () => {
            const slot = SLOTS.find((s) => s.id === input.value);
            if (!slot) return;
            setDeliverySlot(slot);
            const feedback = root.querySelector('[data-slot-feedback]');
            if (feedback) feedback.textContent = `Selecionado: ${slot.label}`;
            showToast(`Entrega: ${slot.label}`);
            trackEvent('select_delivery_slot', { slot_id: slot.id });
        });
    });
}
