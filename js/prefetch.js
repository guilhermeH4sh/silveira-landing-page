/**
 * Prefetch de páginas internas ao hover/focus para navegação mais rápida.
 */
export function initPrefetch() {
    const seen = new Set();

    function prefetch(href) {
        if (!href || seen.has(href) || href.startsWith('http') || href.startsWith('#')) return;
        if (!href.endsWith('.html') && href !== '/' && !href.includes('.html?')) return;
        const clean = href.split('#')[0].split('?')[0];
        if (seen.has(clean)) return;
        seen.add(clean);

        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = clean;
        link.as = 'document';
        document.head.appendChild(link);
    }

    document.addEventListener(
        'pointerenter',
        (e) => {
            const a = e.target.closest?.('a[href]');
            if (a) prefetch(a.getAttribute('href'));
        },
        true
    );

    document.addEventListener(
        'focusin',
        (e) => {
            const a = e.target.closest?.('a[href]');
            if (a) prefetch(a.getAttribute('href'));
        },
        true
    );
}
