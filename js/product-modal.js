import { formatPrice } from './cart.js';
import { addToCart } from './cart.js';
import { showToast } from './toast.js';
import { trackEvent } from './analytics.js';

let modal = null;

function ensureModal() {
    if (modal) return modal;
    modal = document.createElement('div');
    modal.id = 'product-modal';
    modal.className = 'product-modal fixed inset-0 z-[100] hidden items-center justify-center p-4';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
        <div class="product-modal__backdrop absolute inset-0 bg-on-background/70" data-modal-close></div>
        <div class="product-modal__panel relative bg-white border-4 border-on-surface max-w-lg w-full p-6 shadow-[8px_8px_0_#2aff00] max-h-[90vh] overflow-y-auto">
            <button type="button" data-modal-close class="absolute top-4 right-4 p-1 hover:text-tertiary" aria-label="Fechar">
                <span class="material-symbols-outlined">close</span>
            </button>
            <div data-modal-content></div>
        </div>
    `;
    document.body.appendChild(modal);

    modal.querySelectorAll('[data-modal-close]').forEach((el) => {
        el.addEventListener('click', closeProductModal);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeProductModal();
    });
    return modal;
}

export function openProductModal(product) {
    const m = ensureModal();
    const content = m.querySelector('[data-modal-content]');
    content.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover mb-4 border-2 border-on-surface" loading="lazy"/>
        <h2 class="font-headline-md text-headline-md mb-2">${product.name}</h2>
        <p class="font-price-display text-price-display text-primary mb-2">${formatPrice(product.price)}</p>
        <p class="font-body-md text-on-surface-variant mb-4">${product.unit}</p>
        ${product.description ? `<p class="font-body-md mb-4">${product.description}</p>` : ''}
        <button type="button" data-modal-add="${product.id}" class="brutalist-button w-full bg-secondary-container text-on-secondary-container py-3 font-label-bold uppercase border border-on-surface">
            Adicionar ao carrinho
        </button>
    `;
    m.querySelector('[data-modal-add]')?.addEventListener('click', () => {
        addToCart(product);
        showToast(`${product.name} adicionado ao carrinho`);
        trackEvent('add_to_cart', { product_id: product.id, source: 'modal' });
        closeProductModal();
    });
    m.classList.remove('hidden');
    m.classList.add('flex');
    trackEvent('view_product_modal', { product_id: product.id });
}

export function closeProductModal() {
    modal?.classList.add('hidden');
    modal?.classList.remove('flex');
}

export function initProductModal(products) {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-product-detail]');
        if (!btn) return;
        e.preventDefault();
        const product = products.find((p) => p.id === btn.dataset.productDetail);
        if (product) openProductModal(product);
    });
}
