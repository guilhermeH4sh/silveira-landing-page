const STORAGE_KEY = 'silveira_cookie_consent';

export function initCookieConsent() {
    if (localStorage.getItem(STORAGE_KEY)) return;

    const banner = document.createElement('div');
    banner.className = 'cookie-banner fixed bottom-0 left-0 right-0 z-[150] bg-inverse-surface text-surface-variant border-t-4 border-primary p-6';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Consentimento de cookies');
    banner.innerHTML = `
        <div class="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <p class="font-body-md text-sm md:text-base">
                Utilizamos cookies para melhorar sua experiência, personalizar ofertas e analisar o tráfego.
                Ao continuar, você concorda com nossa <a href="trocas.html" class="text-primary-fixed underline">política de privacidade</a>.
            </p>
            <div class="flex gap-3 shrink-0">
                <button type="button" data-cookie-reject class="font-label-bold text-sm px-4 py-2 border-2 border-surface-variant hover:bg-surface-variant/20">Recusar</button>
                <button type="button" data-cookie-accept class="brutalist-button bg-primary-fixed text-on-primary-fixed font-label-bold text-sm px-6 py-2 uppercase border-2 border-on-surface">Aceitar</button>
            </div>
        </div>
    `;
    document.body.appendChild(banner);
    requestAnimationFrame(() => banner.classList.add('is-visible'));

    banner.querySelector('[data-cookie-accept]').addEventListener('click', () => {
        localStorage.setItem(STORAGE_KEY, 'accepted');
        banner.remove();
    });
    banner.querySelector('[data-cookie-reject]').addEventListener('click', () => {
        localStorage.setItem(STORAGE_KEY, 'rejected');
        banner.remove();
    });
}
