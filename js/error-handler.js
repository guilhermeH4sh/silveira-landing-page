import { showToast } from './toast.js';
import { trackEvent } from './analytics.js';

/**
 * Handler global para erros não tratados e rejeições de Promise.
 */
export function initErrorHandler() {
    window.addEventListener('error', (event) => {
        console.error('[Silveira]', event.error || event.message);
        trackEvent('js_error', { message: String(event.message || 'unknown').slice(0, 120) });
    });

    window.addEventListener('unhandledrejection', (event) => {
        console.error('[Silveira] unhandledrejection', event.reason);
        trackEvent('js_unhandled_rejection', {
            message: String(event.reason?.message || event.reason || 'unknown').slice(0, 120),
        });
    });

    document.addEventListener('click', (e) => {
        const broken = e.target.closest('[data-show-error-demo]');
        if (broken) {
            showToast('Algo deu errado. Tente novamente.');
        }
    });
}
