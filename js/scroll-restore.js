/**
 * Restaura a posição de scroll ao voltar para páginas de catálogo,
 * usando sessionStorage keyed pela pathname.
 */
const PREFIX = 'silveira_scroll:';

export function initScrollRestore() {
    const key = PREFIX + window.location.pathname;
    const isCatalog =
        document.querySelector('[data-products-grid]') ||
        window.location.pathname.includes('busca') ||
        window.location.pathname.includes('favoritos');

    if (!isCatalog) return;

    const saved = sessionStorage.getItem(key);
    if (saved) {
        const y = parseInt(saved, 10);
        if (Number.isFinite(y) && y > 0) {
            requestAnimationFrame(() => {
                window.scrollTo({ top: y, behavior: 'instant' in window ? 'instant' : 'auto' });
            });
            // Retry after products render
            setTimeout(() => window.scrollTo(0, y), 120);
        }
    }

    let ticking = false;
    window.addEventListener(
        'scroll',
        () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                sessionStorage.setItem(key, String(Math.round(window.scrollY)));
                ticking = false;
            });
        },
        { passive: true }
    );

    window.addEventListener('pagehide', () => {
        sessionStorage.setItem(key, String(Math.round(window.scrollY)));
    });
}
