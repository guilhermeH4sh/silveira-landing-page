import { addToCart, getCart, getCartTotal, removeFromCart, updateCartBadge, updateQty, clearCart, formatPrice } from './cart.js';
import { getFavorites, syncFavoriteButtons, toggleFavorite } from './favorites.js';
import { initCookieConsent } from './cookie-consent.js';
import { initMobileNav } from './mobile-nav.js';
import { loadProducts, getByDepartment, searchProducts } from './products.js';
import { renderProductCard, renderCartItem, setReviewsForRender } from './render.js';
import { showToast } from './toast.js';
import { initScrollHeader } from './scroll-header.js';
import { initBreadcrumbs } from './breadcrumbs.js';
import { initCatalogFilters } from './filters.js';
import { injectSchema } from './schema.js';
import { renderShippingBar } from './shipping.js';
import { initAuthForm, syncAuthUI } from './auth.js';
import { initBackToTop } from './back-to-top.js';
import { initFormValidation } from './forms.js';
import { initSearchEnhancements } from './search-enhance.js';
import { showProductSkeleton, hideProductSkeleton } from './loading.js';
import { initA11yToolbar } from './a11y-toolbar.js';
import { injectSeoMeta, registerServiceWorker } from './seo-enhance.js';
import { initProductModal } from './product-modal.js';
import { renderRecentSection, trackRecentProduct } from './recent-products.js';
import { initCouponForm, calcDiscount } from './coupon.js';
import { renderOrderHistory } from './orders.js';
import { initQuickSearch } from './quick-search.js';
import { initAccordions } from './faq-accordion.js';
import { initCompareBar, renderComparePage } from './compare.js';
import { initPageAnimations } from './page-animate.js';
import { trackEvent } from './analytics.js';
import { loadStores, renderStoreLocator } from './store-locator.js';
import { initCheckout } from './checkout.js';
import { initMiniCart } from './mini-cart.js';
import { initWhatsAppShare } from './whatsapp-share.js';
import { initPrintList } from './print-list.js';
import { loadReviews } from './reviews.js';
import { initDeliverySlot } from './delivery-slot.js';
import { initInstallPrompt } from './install-prompt.js';
import { initCartReminder } from './cart-reminder.js';
import { initPrefetch } from './prefetch.js';
import { initErrorHandler } from './error-handler.js';
import { initShareProduct } from './share-product.js';

async function bindCartActions(products) {
    document.addEventListener('click', (e) => {
        const recent = e.target.closest('[data-track-recent]');
        if (recent) trackRecentProduct(recent.dataset.trackRecent);

        const addBtn = e.target.closest('[data-add-cart]');
        if (addBtn) {
            const product = products.find((p) => p.id === addBtn.dataset.addCart);
            if (product) {
                addToCart(product);
                trackRecentProduct(product.id);
                updateCartBadge();
                renderShippingBar();
                renderCartPage(products);
                showToast(`${product.name} adicionado ao carrinho`);
                trackEvent('add_to_cart', { product_id: product.id });
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

    showProductSkeleton(container);
    requestAnimationFrame(() => {
        hideProductSkeleton(container);
        initCatalogFilters(products, () => getByDepartment(products, dept));
        syncFavoriteButtons();
    });
}

function renderCartPage(products) {
    const listEl = document.querySelector('[data-cart-list]');
    const totalEl = document.querySelector('[data-cart-total]');
    const subtotalEl = document.querySelector('[data-cart-subtotal]');
    const discountEl = document.querySelector('[data-cart-discount]');
    const discountRow = document.querySelector('[data-cart-discount-row]');
    const emptyEl = document.querySelector('[data-cart-empty]');
    const checkoutEl = document.querySelector('[data-cart-checkout]');
    if (!listEl) return;

    const cart = getCart();
    renderShippingBar();

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

    const subtotal = getCartTotal();
    const discount = calcDiscount(subtotal);
    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    if (discountEl) discountEl.textContent = `- ${formatPrice(discount)}`;
    discountRow?.classList.toggle('hidden', discount === 0);
    if (totalEl) totalEl.textContent = formatPrice(subtotal - discount);
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
        form.dataset.validateForm = '';
        form.dataset.successMessage = 'Cadastro realizado! Em breve você receberá nossas ofertas.';
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
    initErrorHandler();
    injectSeoMeta();
    injectSkipLink();
    markMainContent();
    initScrollHeader();
    initBreadcrumbs();
    initMobileNav();
    initCookieConsent();
    initBackToTop();
    initA11yToolbar();
    initFormValidation();
    initAuthForm();
    initAccordions();
    initCheckout();
    syncAuthUI();
    updateCartBadge();
    registerServiceWorker();
    initPageAnimations();
    initPrefetch();
    initInstallPrompt();
    initMiniCart();
    initCartReminder();

    const grid = document.querySelector('[data-products-grid]');
    if (grid) showProductSkeleton(grid);

    const [products, stores, reviews] = await Promise.all([
        loadProducts(),
        loadStores().catch(() => []),
        loadReviews(),
    ]);

    setReviewsForRender(reviews);
    if (grid) hideProductSkeleton(grid);

    bindCartActions(products);
    initProductModal(products, reviews);
    initQuickSearch(products);
    initCompareBar(products);
    initShareProduct(products);
    initWhatsAppShare();
    initPrintList();
    initDeliverySlot();
    renderDepartmentPage(products);
    renderCartPage(products);
    renderFavoritesPage(products);
    renderSearchPage(products);
    renderRecentSection(products);
    renderComparePage(products);
    renderStoreLocator(stores);
    renderOrderHistory();
    initSearchEnhancements(products);
    initCouponForm(() => renderCartPage(products));
    initNewsletter();
    syncFavoriteButtons();
    injectSchema(products);

    window.addEventListener('cart:updated', () => {
        updateCartBadge();
        renderCartPage(products);
    });

    window.addEventListener('auth:updated', syncAuthUI);
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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
