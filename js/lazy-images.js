/**
 * Fade-in progressivo das imagens conforme entram no viewport,
 * evitando layout shift e reduzindo carga inicial de rede.
 */
export function initLazyImages() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const img = entry.target;
                if (img.complete) {
                    img.classList.add('img-loaded');
                } else {
                    img.addEventListener('load', () => img.classList.add('img-loaded'), { once: true });
                    img.addEventListener('error', () => img.classList.add('img-loaded'), { once: true });
                }
                obs.unobserve(img);
            });
        },
        { rootMargin: '150px' }
    );

    function observe(root = document) {
        root.querySelectorAll('img:not(.img-observed)').forEach((img) => {
            img.classList.add('img-observed', 'img-fade');
            if (!img.getAttribute('loading')) img.setAttribute('loading', 'lazy');
            if (!img.getAttribute('decoding')) img.setAttribute('decoding', 'async');
            observer.observe(img);
        });
    }

    observe();

    const mo = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
            m.addedNodes.forEach((node) => {
                if (node.nodeType === 1) observe(node);
            });
        });
    });
    mo.observe(document.body, { childList: true, subtree: true });
}
