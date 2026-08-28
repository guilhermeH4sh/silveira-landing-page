const STORAGE_KEY = 'silveira_cart';

export function formatPrice(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function getCart() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }));
}

export function getCartCount() {
    return getCart().reduce((sum, item) => sum + item.qty, 0);
}

export function getCartTotal() {
    return getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
}

export function addToCart(product, qty = 1) {
    const cart = getCart();
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ ...product, qty });
    }
    saveCart(cart);
    return cart;
}

export function removeFromCart(productId) {
    const cart = getCart().filter((item) => item.id !== productId);
    saveCart(cart);
    return cart;
}

export function updateQty(productId, qty) {
    const cart = getCart();
    const item = cart.find((i) => i.id === productId);
    if (!item) return cart;
    if (qty <= 0) return removeFromCart(productId);
    item.qty = qty;
    saveCart(cart);
    return cart;
}

export function clearCart() {
    saveCart([]);
}

export function updateCartBadge() {
    const count = getCartCount();
    document.querySelectorAll('[data-cart-count]').forEach((el) => {
        el.textContent = count;
        el.classList.toggle('hidden', count === 0);
    });
}
