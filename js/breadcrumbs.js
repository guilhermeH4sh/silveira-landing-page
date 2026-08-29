const LABELS = {
    'index.html': 'Início',
    'hortifruti.html': 'Hortifruti',
    'acougue-peixaria.html': 'Açougue & Peixaria',
    'padaria.html': 'Padaria',
    'mercearia.html': 'Mercearia',
    'bebidas.html': 'Bebidas',
    'ofertas.html': 'Ofertas',
    'carrinho.html': 'Carrinho',
    'favoritos.html': 'Favoritos',
    'busca.html': 'Busca',
    'conta.html': 'Minha conta',
    'contato.html': 'Contato',
    'horarios.html': 'Horários',
    'trocas.html': 'Trocas',
};

/** Insere breadcrumbs semânticos nas páginas internas */
export function initBreadcrumbs() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    if (page === 'index.html' || page === '') return;

    const main = document.querySelector('main');
    if (!main || main.querySelector('[data-breadcrumbs]')) return;

    const label = LABELS[page] || document.title.split('|')[0]?.trim() || 'Página';
    const nav = document.createElement('nav');
    nav.className = 'mb-6 font-label-bold text-[13px] text-on-surface-variant';
    nav.setAttribute('aria-label', 'Breadcrumb');
    nav.dataset.breadcrumbs = '';
    nav.innerHTML = `
        <ol class="flex flex-wrap items-center gap-2">
            <li><a href="index.html" class="hover:text-primary transition-colors">Início</a></li>
            <li aria-hidden="true" class="text-outline">/</li>
            <li aria-current="page" class="text-on-surface">${label}</li>
        </ol>
    `;
    main.prepend(nav);
}
