/**
 * Zoom leve na imagem do modal de produto ao passar o mouse / toque.
 */
export function initImageZoom() {
    document.addEventListener(
        'pointermove',
        (e) => {
            const img = e.target.closest?.('.product-modal__panel img');
            if (!img) return;
            const rect = img.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            img.style.transformOrigin = `${x}% ${y}%`;
            img.classList.add('img-zoom--active');
        },
        true
    );

    document.addEventListener(
        'pointerleave',
        (e) => {
            const img = e.target.closest?.('.product-modal__panel img');
            if (img) img.classList.remove('img-zoom--active');
        },
        true
    );
}
