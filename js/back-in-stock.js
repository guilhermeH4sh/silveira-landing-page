import { showToast } from './toast.js';
import { trackEvent } from './analytics.js';

const STORAGE_KEY = 'silveira_back_in_stock';

function getSubscriptions() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch {
        return {};
    }
}

function persist(map) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function isSubscribed(productId) {
    return Boolean(getSubscriptions()[productId]);
}

export function toggleSubscription(productId, email) {
    const map = getSubscriptions();
    if (map[productId]) {
        delete map[productId];
        persist(map);
        return false;
    }
    map[productId] = { email: email || null, at: new Date().toISOString() };
    persist(map);
    return true;
}

export function renderNotifyButton(product) {
    if (product.stock !== 'baixo') return '';
    const active = isSubscribed(product.id);
    return `<button type="button" data-notify-stock="${product.id}" class="notify-stock-btn font-label-bold text-[11px] uppercase underline text-secondary" aria-pressed="${active}">
        ${active ? 'Avisaremos você' : 'Avise-me quando repor'}
    </button>`;
}

/**
 * Inscrição "avise-me quando repor" para itens com estoque baixo.
 */
export function initBackInStock(products) {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-notify-stock]');
        if (!btn) return;
        e.preventDefault();

        const id = btn.dataset.notifyStock;
        const product = products.find((p) => p.id === id);
        let email = null;

        if (!isSubscribed(id)) {
            email = window.prompt('E-mail para aviso de reposição:', '');
            if (email === null) return;
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
                showToast('Informe um e-mail válido');
                return;
            }
        }

        const active = toggleSubscription(id, email?.trim());
        btn.setAttribute('aria-pressed', String(active));
        btn.textContent = active ? 'Avisaremos você' : 'Avise-me quando repor';
        showToast(
            active
                ? `Você será avisado sobre ${product?.name || 'este produto'}`
                : 'Aviso cancelado'
        );
        trackEvent(active ? 'subscribe_back_in_stock' : 'unsubscribe_back_in_stock', { product_id: id });
    });
}
