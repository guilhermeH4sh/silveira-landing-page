/**
 * Swipe horizontal em carrosséis [data-swipe-carousel] / overflow-x-auto snap.
 * Suporta pointer events (mouse + touch) sem depender de libs.
 */
export function initSwipeCarousel() {
    const carousels = document.querySelectorAll(
        '[data-swipe-carousel], .snap-x, [data-recent-products]'
    );

    carousels.forEach((el) => {
        if (el.dataset.swipeReady) return;
        el.dataset.swipeReady = '1';

        let startX = 0;
        let scrollLeft = 0;
        let dragging = false;

        el.addEventListener('pointerdown', (e) => {
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            dragging = true;
            startX = e.clientX;
            scrollLeft = el.scrollLeft;
            el.classList.add('is-swiping');
            el.setPointerCapture?.(e.pointerId);
        });

        el.addEventListener('pointermove', (e) => {
            if (!dragging) return;
            const dx = e.clientX - startX;
            el.scrollLeft = scrollLeft - dx;
        });

        const end = () => {
            if (!dragging) return;
            dragging = false;
            el.classList.remove('is-swiping');
        };

        el.addEventListener('pointerup', end);
        el.addEventListener('pointercancel', end);
        el.addEventListener('pointerleave', end);
    });
}
