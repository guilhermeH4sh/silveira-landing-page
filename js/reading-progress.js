/**
 * Barra de progresso de leitura em páginas de conteúdo longo.
 */
export function initReadingProgress() {
    const main = document.querySelector('main');
    if (!main) return;

    const longPages = ['politica-privacidade', 'termos', 'sobre', 'faq', 'trocas'];
    const isLong = longPages.some((p) => window.location.pathname.includes(p));
    if (!isLong && main.scrollHeight < window.innerHeight * 1.4) return;

    let bar = document.getElementById('reading-progress');
    if (!bar) {
        bar = document.createElement('div');
        bar.id = 'reading-progress';
        bar.className = 'reading-progress';
        bar.setAttribute('role', 'progressbar');
        bar.setAttribute('aria-valuemin', '0');
        bar.setAttribute('aria-valuemax', '100');
        bar.setAttribute('aria-valuenow', '0');
        bar.setAttribute('aria-label', 'Progresso de leitura');
        document.body.appendChild(bar);
    }

    function update() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? Math.min(100, Math.round((scrollTop / docHeight) * 100)) : 0;
        bar.style.width = `${pct}%`;
        bar.setAttribute('aria-valuenow', String(pct));
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
}
