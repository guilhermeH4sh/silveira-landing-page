import { getCart, getCartTotal, formatPrice, updateQty, removeFromCart } from './cart.js';
import { showToast } from './toast.js';
import { trackEvent } from './analytics.js';

let drawer = null;

function ensureDrawer() {
    if (drawer) return drawer;
    drawer = document.createElement('div');
    drawer.id = 'mini-cart';
    drawer.className = 'mini-cart hidden';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-label', 'Mini carrinho');
    drawer.innerHTML = `
        <div class="mini-cart__backdrop" data-mini-close></div>
        <aside class="mini-cart__panel">
            <div class="flex justify-between items-center mb-4 border-b-2 border-on-surface pb-3">
                <h2 class="font-headline-md text-headline-md uppercase">Carrinho</h2>
                <button type="button" data-mini-close class="p-1 hover:text-tertiary" aria-label="Fechar">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            <div data-mini-list class="flex-1 overflow-y-auto space-y-3 mb-4"></div>
            <div data-mini-empty class="hidden text-center py-8">
                <p class="font-body-md text-on-surface-variant mb-4">Carrinho vazio</p>
                <a href="ofertas.html" class="font-label-bold text-secondary hover:underline">Ver ofertas</a>
            </div>
            <div data-mini-footer class="border-t-2 border-on-surface pt-4">
                <div class="flex justify-between mb-4">
                    <span class="font-label-bold uppercase">Total</span>
                    <span class="font-price-display text-primary" data-mini-total>R$ 0,00</span>
                </div>
                <a href="carrinho.html" class="brutalist-button block text-center bg-primary text-on-primary py-3 font-label-bold uppercase border-2 border-on-surface mb-2">Ver carrinho</a>
                <a href="checkout.html" class="brutalist-button block text-center bg-secondary-container text-on-secondary-container py-3 font-label-bold uppercase border-2 border-on-surface">Finalizar</a>
            </div>
        </aside>
    `;
    document.body.appendChild(drawer);
    drawer.querySelectorAll('[data-mini-close]').forEach((el) => {
        el.addEventListener('click', closeMiniCart);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !drawer.classList.contains('hidden')) closeMiniCart();
    });
    return drawer;
}

function renderMiniCart() {
    const d = ensureDrawer();
    const cart = getCart();
    const list = d.querySelector('[data-mini-list]');
    const empty = d.querySelector('[data-mini-empty]');
    const footer = d.querySelector('[data-mini-footer]');
    const total = d.querySelector('[data-mini-total]');

    if (cart.length === 0) {
        list.innerHTML = '';
        empty?.classList.remove('hidden');
        footer?.classList.add('hidden');
        return;
    }

    empty?.classList.add('hidden');
    footer?.classList.remove('hidden');
    list.innerHTML = cart
        .map(
            (item) => `
        <div class="flex gap-3 items-start border-b border-outline-variant pb-3" data-mini-item="${item.id}">
            <div class="flex-1 min-w-0">
                <p class="font-label-bold text-sm truncate">${item.name}</p>
                <p class="text-xs text-on-surface-variant">${formatPrice(item.price)} × ${item.qty}</p>
                <div class="flex items-center gap-2 mt-1">
                    <button type="button" data-mini-minus="${item.id}" class="w-6 h-6 border border-on-surface text-xs font-bold" aria-label="Diminuir">−</button>
                    <span class="text-sm font-label-bold">${item.qty}</span>
                    <button type="button" data-mini-plus="${item.id}" class="w-6 h-6 border border-on-surface text-xs font-bold" aria-label="Aumentar">+</button>
                    <button type="button" data-mini-remove="${item.id}" class="ml-auto text-tertiary text-xs font-label-bold">Remover</button>
                </div>
            </div>
            <p class="font-label-bold text-sm shrink-0">${formatPrice(item.price * item.qty)}</p>
        </div>`
        )
        .join('');
    if (total) total.textContent = formatPrice(getCartTotal());
}

export function openMiniCart() {
    const d = ensureDrawer();
    renderMiniCart();
    d.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    trackEvent('open_mini_cart');
}

export function closeMiniCart() {
    drawer?.classList.add('hidden');
    document.body.style.overflow = '';
}

export function initMiniCart() {
    ensureDrawer();

    document.addEventListener('click', (e) => {
        const cartLink = e.target.closest('a[href="carrinho.html"]');
        if (cartLink && !e.metaKey && !e.ctrlKey && window.innerWidth >= 768) {
            e.preventDefault();
            openMiniCart();
        }

        const minus = e.target.closest('[data-mini-minus]');
        if (minus) {
            const item = getCart().find((i) => i.id === minus.dataset.miniMinus);
            if (item) {
                updateQty(item.id, item.qty - 1);
                renderMiniCart();
            }
        }

        const plus = e.target.closest('[data-mini-plus]');
        if (plus) {
            const item = getCart().find((i) => i.id === plus.dataset.miniPlus);
            if (item) {
                updateQty(item.id, item.qty + 1);
                renderMiniCart();
            }
        }

        const remove = e.target.closest('[data-mini-remove]');
        if (remove) {
            removeFromCart(remove.dataset.miniRemove);
            showToast('Item removido');
            renderMiniCart();
        }
    });

    window.addEventListener('cart:updated', () => {
        if (drawer && !drawer.classList.contains('hidden')) renderMiniCart();
    });
}
