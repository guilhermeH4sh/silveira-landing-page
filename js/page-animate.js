/** Animação de entrada suave ao carregar páginas */
export function initPageAnimations() {
    document.querySelectorAll('main > section, main > div:not([data-no-animate])').forEach((el, i) => {
        el.classList.add('page-fade-in');
        el.style.animationDelay = `${Math.min(i * 0.08, 0.4)}s`;
    });
}
