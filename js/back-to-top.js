/** Botão flutuante para retornar ao topo */
export function initBackToTop() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'back-to-top fixed bottom-24 left-6 z-40 p-3 bg-primary text-on-primary border-2 border-on-surface shadow-[4px_4px_0_#141a32] opacity-0 pointer-events-none transition-opacity duration-300';
    btn.setAttribute('aria-label', 'Voltar ao topo');
    btn.innerHTML = '<span class="material-symbols-outlined">keyboard_arrow_up</span>';
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        const visible = window.scrollY > 400;
        btn.classList.toggle('opacity-100', visible);
        btn.classList.toggle('pointer-events-auto', visible);
        btn.classList.toggle('opacity-0', !visible);
        btn.classList.toggle('pointer-events-none', !visible);
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
