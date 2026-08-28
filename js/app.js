import { addToCart, getCart, getCartCount, getCartTotal, removeFromCart, updateCartBadge, updateQty } from './cart.js';
import { getFavorites, syncFavoriteButtons, toggleFavorite } from './favorites.js';
import { initCookieConsent } from './cookie-consent.js';
import { initMobileNav } from './mobile-nav.js';
import { loadProducts, getByDepartment, searchProducts } from './products.js';
import { renderCartItem, renderProductCard } from './render.js';
import { showToast } from './toast.js';
import { formatPrice } from './cart.js';

async function bindCartActions(products) {
    document.addEventListener('click', (e) => {
        const addBtn = e.target.closest('[data-add-cart]');
        if (addBtn) {
            const product = products.find((p) => p.id === addBtn.dataset.addCart);
            if (product) {
                addToCart(product);
                updateCartBadge();
                showToast(`${product.name} adicionado ao carrinho`);
            }
        }

        const favBtn = e.target.closest('[data-favorite-id]');
        if (favBtn) {
            const id = favBtn.dataset.favoriteId;
            toggleFavorite(id);
            syncFavoriteButtons();
            const active = getFavorites().includes(id);
            showToast(active ? 'Adicionado aos favoritos' : 'Removido dos favoritos');
        }

        const minus = e.target.closest('[data-qty-minus]');
        if (minus) {
            const item = getCart().find((i) => i.id === minus.dataset.qtyMinus);
            if (item) {
                updateQty(item.id, item.qty - 1);
                renderCartPage(products);
            }
        }

        const plus = e.target.closest('[data-qty-plus]');
        if (plus) {
            const item = getCart().find((i) => i.id === plus.dataset.qtyPlus);
            if (item) {
                updateQty(item.id, item.qty + 1);
                renderCartPage(products);
            }
        }

        const remove = e.target.closest('[data-remove-cart]');
        if (remove) {
            removeFromCart(remove.dataset.removeCart);
            renderCartPage(products);
            showToast('Item removido do carrinho');
        }
    });
}

function renderDepartmentPage(products) {
    const container = document.querySelector('[data-products-grid]');
    const dept = document.body.dataset.department;
    if (!container || !dept) return;

    const list = getByDepartment(products, dept);
    container.innerHTML = list.map((p) => renderProductCard(p, { compact: true })).join('');
    syncFavoriteButtons();
}

function renderCartPage(products) {
    const listEl = document.querySelector('[data-cart-list]');
    const totalEl = document.querySelector('[data-cart-total]');
    const emptyEl = document.querySelector('[data-cart-empty]');
    const checkoutEl = document.querySelector('[data-cart-checkout]');
    if (!listEl) return;

    const cart = getCart();
    if (cart.length === 0) {
        listEl.innerHTML = '';
        emptyEl?.classList.remove('hidden');
        checkoutEl?.classList.add('hidden');
        if (totalEl) totalEl.textContent = formatPrice(0);
        return;
    }

    emptyEl?.classList.add('hidden');
    checkoutEl?.classList.remove('hidden');
    listEl.innerHTML = cart.map(renderCartItem).join('');
    if (totalEl) totalEl.textContent = formatPrice(getCartTotal());
}

function renderFavoritesPage(products) {
    const container = document.querySelector('[data-favorites-grid]');
    if (!container) return;

    const ids = getFavorites();
    const list = products.filter((p) => ids.includes(p.id));
    container.innerHTML = list.length
        ? list.map((p) => renderProductCard(p, { compact: true })).join('')
        : '<p class="font-body-lg text-on-surface-variant col-span-full">Nenhum favorito ainda. Explore nossos departamentos!</p>';
    syncFavoriteButtons();
}

function renderSearchPage(products) {
    const input = document.querySelector('[data-search-input]');
    const results = document.querySelector('[data-search-results]');
    if (!input || !results) return;

    const params = new URLSearchParams(window.location.search);
    const initial = params.get('q') || '';
    input.value = initial;

    function run() {
        const q = input.value;
        const list = searchProducts(products, q);
        results.innerHTML = list.length
            ? list.map((p) => renderProductCard(p, { compact: true })).join('')
            : `<p class="font-body-md text-on-surface-variant col-span-full">${q ? 'Nenhum produto encontrado.' : 'Digite para buscar produtos.'}</p>`;
        syncFavoriteButtons();
        const url = new URL(window.location);
        if (q) url.searchParams.set('q', q);
        else url.searchParams.delete('q');
        history.replaceState(null, '', url);
    }

    input.addEventListener('input', run);
    document.querySelector('[data-search-form]')?.addEventListener('submit', (e) => {
        e.preventDefault();
        run();
    });
    if (initial) run();
}

function initNewsletter() {
    document.querySelectorAll('[data-newsletter-form]').forEach((form) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Cadastro realizado! Em breve você receberá nossas ofertas.');
            form.reset();
        });
    });
}

function injectSkipLink() {
    if (document.querySelector('.skip-link')) return;
    const link = document.createElement('a');
    link.href = '#conteudo-principal';
    link.className = 'skip-link';
    link.textContent = 'Ir para o conteúdo principal';
    document.body.prepend(link);
}

function markMainContent() {
    const main = document.querySelector('main');
    if (main && !main.id) main.id = 'conteudo-principal';
}

async function init() {
    injectSkipLink();
    markMainContent();
    initMobileNav();
    initCookieConsent();
    updateCartBadge();

    const products = await loadProducts();
    bindCartActions(products);
    renderDepartmentPage(products);
    renderCartPage(products);
    renderFavoritesPage(products);
    renderSearchPage(products);
    initNewsletter();
    syncFavoriteButtons();

    window.addEventListener('cart:updated', () => {
        updateCartBadge();
        renderCartPage(products);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
