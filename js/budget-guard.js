import { getCartTotal } from './cart.js';
import { formatPrice } from './cart.js';
import { showToast } from './toast.js';
import { trackEvent } from './analytics.js';

const STORAGE_KEY = 'silveira_budget_cap';

export function getBudgetCap() {
    const v = parseFloat(localStorage.getItem(STORAGE_KEY) || '');
    return Number.isFinite(v) && v > 0 ? v : null;
}

export function setBudgetCap(value) {
    if (value === null || value === '' || Number(value) <= 0) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
    }
    const cap = Math.round(Number(value) * 100) / 100;
    localStorage.setItem(STORAGE_KEY, String(cap));
    return cap;
}

function statusHtml(total, cap) {
    if (!cap) return '<p class="font-body-md text-sm text-on-surface-variant">Sem limite definido.</p>';
    const remaining = cap - total;
    const pct = Math.min(100, Math.round((total / cap) * 100));
    const over = remaining < 0;
    return `
        <div class="budget-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}">
            <span style="width:${pct}%" class="${over ? 'is-over' : ''}"></span>
        </div>
        <p class="font-body-md text-sm mt-2 ${over ? 'text-tertiary font-label-bold' : 'text-on-surface-variant'}">
            ${over
                ? `Você ultrapassou o orçamento em ${formatPrice(Math.abs(remaining))}`
                : `Restam ${formatPrice(remaining)} do limite de ${formatPrice(cap)}`}
        </p>
    `;
}

/**
 * Guardião de orçamento: alerta quando o carrinho ultrapassa o teto definido.
 */
export function initBudgetGuard() {
    const root = document.querySelector('[data-budget-guard]');
    if (!root) return;

    function render() {
        const cap = getBudgetCap();
        const total = getCartTotal();
        root.innerHTML = `
            <div class="border-2 border-on-surface bg-white p-4 mb-4">
                <div class="flex flex-wrap items-end gap-3 mb-3">
                    <label class="font-label-bold text-sm flex-1 min-w-[160px]">
                        Orçamento máximo
                        <input type="number" min="0" step="1" data-budget-input
                               value="${cap ?? ''}" placeholder="Ex.: 200"
                               class="mt-1 w-full border-2 border-on-surface px-3 py-2 font-body-md"/>
                    </label>
                    <button type="button" data-budget-save class="brutalist-button bg-primary text-on-primary font-label-bold text-xs px-4 py-2 uppercase border-2 border-on-surface">
                        Salvar
                    </button>
                    <button type="button" data-budget-clear class="font-label-bold text-xs uppercase text-tertiary hover:underline">
                        Limpar
                    </button>
                </div>
                <div data-budget-status>${statusHtml(total, cap)}</div>
            </div>
        `;
    }

    root.addEventListener('click', (e) => {
        if (e.target.closest('[data-budget-save]')) {
            const input = root.querySelector('[data-budget-input]');
            const cap = setBudgetCap(input.value);
            showToast(cap ? `Orçamento definido: ${formatPrice(cap)}` : 'Orçamento removido');
            trackEvent('set_budget_cap', { cap });
            render();
            checkBudget();
        }
        if (e.target.closest('[data-budget-clear]')) {
            setBudgetCap(null);
            showToast('Orçamento removido');
            render();
        }
    });

    function checkBudget() {
        const cap = getBudgetCap();
        if (!cap) return;
        const total = getCartTotal();
        if (total > cap) {
            showToast(`Carrinho acima do orçamento (${formatPrice(total)} / ${formatPrice(cap)})`);
            trackEvent('budget_exceeded', { total, cap });
        }
        const status = root.querySelector('[data-budget-status]');
        if (status) status.innerHTML = statusHtml(total, cap);
    }

    render();
    window.addEventListener('cart:updated', checkBudget);
}
