import { formatPrice } from './cart.js';
import { renderCardRating } from './reviews.js';

let reviewsMap = {};

export function setReviewsForRender(reviews) {
    reviewsMap = reviews || {};
}

function badgeHtml(badge) {
    if (!badge) return '';
    const isOffer = badge === 'OFERTA';
    const cls = isOffer
        ? 'bg-tertiary text-on-tertiary'
        : 'bg-primary-container text-on-primary-container';
    return `<div class="absolute top-4 left-4 ${cls} font-label-bold text-[12px] px-2 py-1 uppercase z-10 shadow-[2px_2px_0px_0px_#141a32]">${badge}</div>`;
}

function stockHtml(stock) {
    if (!stock) return '';
    const low = stock === 'baixo';
    const cls = low ? 'text-tertiary' : 'text-primary';
    const label = low ? 'Estoque baixo' : 'Em estoque';
    return `<p class="font-label-bold text-[11px] ${cls} uppercase mb-2">${label}</p>`;
}

export function renderProductCard(product, options = {}) {
    const { compact = false } = options;
    const width = compact ? 'w-full' : 'flex-none w-[300px] snap-start';
    const deptHref = {
        hortifruti: 'hortifruti.html',
        acougue: 'acougue-peixaria.html',
        padaria: 'padaria.html',
        mercearia: 'mercearia.html',
        bebidas: 'bebidas.html',
    }[product.department] || 'ofertas.html';

    return `
    <article class="product-card ${width} bg-white border border-on-surface relative p-4 transition-all duration-300 group" data-product-id="${product.id}">
        ${badgeHtml(product.badge)}
        <button type="button" data-favorite-id="${product.id}" class="absolute top-4 right-4 z-10 text-outline hover:text-tertiary" aria-label="Favoritar ${product.name}" aria-pressed="false">
            <span class="material-symbols-outlined">favorite</span>
        </button>
        <button type="button" data-product-detail="${product.id}" class="absolute top-14 right-4 z-10 text-outline hover:text-primary text-xs font-label-bold" aria-label="Detalhes">+ info</button>
        <a href="${deptHref}" class="block h-[200px] bg-surface-container mb-4 overflow-hidden" data-track-recent="${product.id}">
            <img class="object-cover h-full w-full" alt="${product.name}" src="${product.image}" loading="lazy" decoding="async" width="300" height="200"/>
        </a>
        <h3 class="font-label-bold text-label-bold mb-1">${product.name}</h3>
        ${renderCardRating(reviewsMap, product.id)}
        ${stockHtml(product.stock)}
        <div class="font-price-display text-price-display text-primary mb-1">${formatPrice(product.price)}</div>
        <div class="font-body-md text-[12px] text-on-surface-variant mb-3">${product.unit}</div>
        <div class="flex gap-2">
            <button type="button" data-add-cart="${product.id}" class="brutalist-button flex-1 bg-secondary-container text-on-secondary-container py-3 font-label-bold uppercase border border-on-surface shadow-[2px_2px_0px_0px_#141a32] text-sm">
                Adicionar
            </button>
            <button type="button" data-compare-id="${product.id}" class="px-3 py-3 border-2 border-on-surface font-label-bold text-xs uppercase" aria-label="Comparar" title="Comparar">
                <span class="material-symbols-outlined text-[18px]">compare_arrows</span>
            </button>
        </div>
    </article>`;
}

export function renderCartItem(item) {
    return `
    <div class="flex justify-between items-center border-b border-outline-variant pb-4 gap-4" data-cart-item="${item.id}">
        <div class="flex-1">
            <p class="font-label-bold">${item.name}</p>
            <p class="text-sm text-on-surface-variant">${formatPrice(item.price)} · ${item.unit}</p>
            <div class="flex items-center gap-2 mt-2">
                <button type="button" data-qty-minus="${item.id}" class="w-8 h-8 border-2 border-on-surface font-bold" aria-label="Diminuir quantidade">−</button>
                <span data-qty-value="${item.id}" class="font-label-bold w-8 text-center">${item.qty}</span>
                <button type="button" data-qty-plus="${item.id}" class="w-8 h-8 border-2 border-on-surface font-bold" aria-label="Aumentar quantidade">+</button>
                <button type="button" data-remove-cart="${item.id}" class="ml-4 text-tertiary text-sm font-label-bold hover:underline">Remover</button>
            </div>
        </div>
        <p class="font-price-display text-primary shrink-0">${formatPrice(item.price * item.qty)}</p>
    </div>`;
}
