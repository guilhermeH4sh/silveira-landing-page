const STORAGE_KEY = 'silveira_favorites';

export function getFavorites() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
        return [];
    }
}

function saveFavorites(favorites) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    window.dispatchEvent(new CustomEvent('favorites:updated', { detail: favorites }));
}

export function isFavorite(productId) {
    return getFavorites().includes(productId);
}

export function toggleFavorite(productId) {
    const favorites = getFavorites();
    const index = favorites.indexOf(productId);
    if (index >= 0) {
        favorites.splice(index, 1);
    } else {
        favorites.push(productId);
    }
    saveFavorites(favorites);
    return favorites;
}

export function syncFavoriteButtons() {
    const favorites = getFavorites();
    document.querySelectorAll('[data-favorite-id]').forEach((btn) => {
        const id = btn.dataset.favoriteId;
        const active = favorites.includes(id);
        btn.classList.toggle('text-tertiary', active);
        btn.classList.toggle('icon-fill', active);
        btn.setAttribute('aria-pressed', String(active));
    });
}
