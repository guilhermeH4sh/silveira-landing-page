import { getCart, addToCart, updateQty } from './cart.js';
import { getUser } from './auth.js';
import { showToast } from './toast.js';
import { trackEvent } from './analytics.js';

const GUEST_KEY = 'silveira_guest_cart_backup';
const MERGED_KEY = 'silveira_cart_merged';

/**
 * Ao autenticar, mescla o backup do carrinho convidado com o carrinho atual
 * usando a maior quantidade por SKU (sem duplicar itens já presentes).
 */
function backupGuestCart() {
    const cart = getCart();
    if (cart.length) {
        localStorage.setItem(GUEST_KEY, JSON.stringify(cart));
    }
}

function mergeFromBackup() {
    if (!getUser()) return;
    if (sessionStorage.getItem(MERGED_KEY) === '1') return;

    let guest = [];
    try {
        guest = JSON.parse(localStorage.getItem(GUEST_KEY) || '[]');
    } catch {
        guest = [];
    }

    if (!guest.length) {
        sessionStorage.setItem(MERGED_KEY, '1');
        return;
    }

    const current = getCart();
    let merged = 0;

    guest.forEach((item) => {
        const existing = current.find((c) => c.id === item.id);
        const qty = item.qty || 1;
        if (!existing) {
            addToCart(item, qty);
            merged += 1;
        } else if (existing.qty < qty) {
            updateQty(item.id, qty);
            merged += 1;
        }
    });

    localStorage.removeItem(GUEST_KEY);
    sessionStorage.setItem(MERGED_KEY, '1');

    if (merged > 0) {
        showToast(`${merged} item(ns) do carrinho anterior recuperados`);
        trackEvent('cart_merged_on_login', { items: merged });
    }
}

export function initCartMerge() {
    if (!getUser()) backupGuestCart();

    window.addEventListener('cart:updated', () => {
        if (!getUser()) backupGuestCart();
    });

    window.addEventListener('auth:updated', (e) => {
        if (e.detail) {
            mergeFromBackup();
        } else {
            sessionStorage.removeItem(MERGED_KEY);
            backupGuestCart();
        }
    });

    if (getUser()) mergeFromBackup();
}
