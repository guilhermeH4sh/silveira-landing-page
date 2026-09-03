import { trackEvent } from './analytics.js';

const DISMISS_KEY = 'silveira_install_dismissed';

export function initInstallPrompt() {
    let deferred = null;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferred = e;
        if (localStorage.getItem(DISMISS_KEY) === '1') return;
        showBanner(() => {
            deferred?.prompt();
            deferred?.userChoice.then((choice) => {
                trackEvent('pwa_install_choice', { outcome: choice.outcome });
                deferred = null;
                hideBanner();
            });
        });
    });

    window.addEventListener('appinstalled', () => {
        trackEvent('pwa_installed');
        hideBanner();
        deferred = null;
    });
}

function showBanner(onInstall) {
    if (document.getElementById('install-banner')) return;
    const el = document.createElement('div');
    el.id = 'install-banner';
    el.className = 'install-banner';
    el.setAttribute('role', 'status');
    el.innerHTML = `
        <div class="flex items-center gap-3 flex-wrap">
            <span class="material-symbols-outlined text-primary text-[28px]">install_mobile</span>
            <p class="font-body-md text-sm flex-1 min-w-[180px]">Instale o app Silveira para acesso rápido e offline.</p>
            <button type="button" data-install-accept class="brutalist-button bg-primary text-on-primary font-label-bold text-xs px-4 py-2 uppercase border-2 border-on-surface">Instalar</button>
            <button type="button" data-install-dismiss class="font-label-bold text-xs uppercase text-on-surface-variant hover:text-tertiary" aria-label="Dispensar">Agora não</button>
        </div>
    `;
    document.body.appendChild(el);
    el.querySelector('[data-install-accept]')?.addEventListener('click', onInstall);
    el.querySelector('[data-install-dismiss]')?.addEventListener('click', () => {
        localStorage.setItem(DISMISS_KEY, '1');
        hideBanner();
        trackEvent('pwa_install_dismiss');
    });
}

function hideBanner() {
    document.getElementById('install-banner')?.remove();
}
