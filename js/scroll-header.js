/** Compacta o header ao rolar a página */
export function initScrollHeader() {
    const header = document.querySelector('header');
    if (!header) return;

    let ticking = false;
    const threshold = 80;

    function update() {
        header.classList.toggle('header--compact', window.scrollY > threshold);
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }, { passive: true });

    update();
}
