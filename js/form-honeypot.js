import { trackEvent } from './analytics.js';
import { showToast } from './toast.js';

/**
 * Honeypot anti-spam para formulários [data-honeypot-form].
 * Campo oculto que bots tendem a preencher; humanos não veem.
 */
export function initFormHoneypot() {
    document.querySelectorAll('form[data-honeypot-form], form[data-login-form], form[data-newsletter-form], [data-checkout] form, form').forEach((form) => {
        if (form.dataset.honeypotReady) return;
        // Apenas formulários "reais" de contato/newsletter/login/checkout
        const isTarget =
            form.hasAttribute('data-honeypot-form') ||
            form.hasAttribute('data-login-form') ||
            form.hasAttribute('data-newsletter-form') ||
            form.closest('[data-checkout]');
        if (!isTarget) return;

        form.dataset.honeypotReady = '1';

        const trap = document.createElement('div');
        trap.className = 'hp-field';
        trap.setAttribute('aria-hidden', 'true');
        trap.innerHTML = `
            <label>Não preencha este campo
                <input type="text" name="website_url" tabindex="-1" autocomplete="off"/>
            </label>
        `;
        form.prepend(trap);

        const started = Date.now();

        form.addEventListener(
            'submit',
            (e) => {
                const value = form.querySelector('input[name="website_url"]')?.value;
                const elapsed = Date.now() - started;

                if (value) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    trackEvent('form_honeypot_triggered', { form: form.dataset.loginForm !== undefined ? 'login' : 'form' });
                    showToast('Envio bloqueado (suspeita de spam)');
                    return;
                }

                // Submissão humana improvável em < 800ms
                if (elapsed < 800 && form.hasAttribute('data-honeypot-form')) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    trackEvent('form_submit_too_fast');
                    showToast('Aguarde um instante e tente novamente');
                }
            },
            true
        );
    });
}
