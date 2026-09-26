import { getFavorites } from './favorites.js';
import { showToast } from './toast.js';
import { trackEvent } from './analytics.js';
import { SITE } from './config.js';

/**
 * Compartilha a lista de favoritos via URL (?fav=id1,id2) ou clipboard.
 */
export function getFavoritesFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('fav');
    if (!raw) return [];
    return raw.split(',').map((s) => s.trim()).filter(Boolean);
}

export function buildFavoritesUrl(ids = getFavorites()) {
    if (!ids.length) return `${SITE.url}/favoritos.html`;
    return `${SITE.url}/favoritos.html?fav=${encodeURIComponent(ids.join(','))}`;
}

export async function shareWishlist() {
    const ids = getFavorites();
    if (!ids.length) {
        showToast('Adicione favoritos antes de compartilhar');
        return;
    }

    const url = buildFavoritesUrl(ids);
    const data = {
        title: `Favoritos — ${SITE.name}`,
        text: `Veja minha lista de ${ids.length} favoritos no Silveira`,
        url,
    };

    try {
        if (navigator.share) {
            await navigator.share(data);
            trackEvent('share_wishlist', { count: ids.length, method: 'web_share' });
            return;
        }
    } catch (err) {
        if (err?.name === 'AbortError') return;
    }

    try {
        await navigator.clipboard.writeText(url);
        showToast('Link dos favoritos copiado!');
        trackEvent('share_wishlist', { count: ids.length, method: 'clipboard' });
    } catch {
        showToast('Não foi possível compartilhar');
    }
}

export function initWishlistShare(products) {
    document.querySelectorAll('[data-share-wishlist]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            shareWishlist();
        });
    });

    // Importa favoritos da URL compartilhada (somente visualiza / permite adicionar)
    const shared = getFavoritesFromUrl();
    if (!shared.length || !products) return;

    const grid = document.querySelector('[data-favorites-grid]');
    if (!grid) return;

    const list = products.filter((p) => shared.includes(p.id));
    if (!list.length) return;

    // Se a grade ainda estiver vazia ou o usuário não tiver favoritos locais,
    // mostra a lista compartilhada com um banner.
    const banner = document.createElement('div');
    banner.className = 'border-2 border-primary bg-primary-container/30 p-4 mb-6';
    banner.innerHTML = `
        <p class="font-label-bold text-sm uppercase mb-1">Lista compartilhada</p>
        <p class="font-body-md text-sm">${list.length} produto(s) enviados por alguém. Favoritos locais permanecem intactos.</p>
    `;
    grid.parentElement?.insertBefore(banner, grid);
}
