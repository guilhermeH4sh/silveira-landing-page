import { showToast } from './toast.js';
import { trackEvent } from './analytics.js';

/**
 * Banner de status de rede (online/offline) com reatividade a eventos do browser.
 */
export function initNetworkStatus() {
    let banner = document.getElementById('network-status');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'network-status';
        banner.className = 'network-status hidden';
        banner.setAttribute('role', 'status');
        banner.setAttribute('aria-live', 'polite');
        document.body.appendChild(banner);
    }

    function setOffline() {
        banner.textContent = 'Você está offline. Algumas funções podem ficar indisponíveis.';
        banner.classList.remove('hidden', 'network-status--online');
        banner.classList.add('network-status--offline');
        trackEvent('network_offline');
    }

    function setOnline() {
        banner.textContent = 'Conexão restabelecida.';
        banner.classList.remove('hidden', 'network-status--offline');
        banner.classList.add('network-status--online');
        trackEvent('network_online');
        showToast('Você está online novamente');
        setTimeout(() => banner.classList.add('hidden'), 2500);
    }

    window.addEventListener('offline', setOffline);
    window.addEventListener('online', setOnline);

    if (!navigator.onLine) setOffline();
}
