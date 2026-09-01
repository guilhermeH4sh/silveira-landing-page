const STORAGE_KEY = 'silveira_recent';
const MAX = 6;

export function trackRecentProduct(productId) {
    let recent = getRecentProducts();
    recent = recent.filter((id) => id !== productId);
    recent.unshift(productId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recent.slice(0, MAX)));
}

export function getRecentProducts() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
        return [];
    }
}

export function renderRecentSection(products) {
    const container = document.querySelector('[data-recent-products]');
    if (!container) return;

    const ids = getRecentProducts();
    const list = ids.map((id) => products.find((p) => p.id === id)).filter(Boolean);
    if (!list.length) {
        container.closest('section')?.classList.add('hidden');
        return;
    }

    container.innerHTML = list.map((p) => `
        <article class="product-card flex-none w-[260px] snap-start bg-white border border-on-surface p-4">
            <img src="${p.image}" alt="${p.name}" class="h-32 w-full object-cover mb-3" loading="lazy"/>
            <h3 class="font-label-bold text-sm mb-1">${p.name}</h3>
            <p class="font-price-display text-primary text-lg">${p.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            <button type="button" data-product-detail="${p.id}" class="mt-3 font-label-bold text-secondary text-sm hover:underline">Ver detalhes</button>
        </article>
    `).join('');
}
