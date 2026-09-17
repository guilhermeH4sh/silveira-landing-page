import { showToast } from './toast.js';
import { trackEvent } from './analytics.js';

const STORAGE_KEY = 'silveira_newsletter';

export function getSubscriber() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    } catch {
        return null;
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Newsletter com validação, persistência local e estado de já inscrito.
 */
export function initNewsletterSignup() {
    const forms = document.querySelectorAll('[data-newsletter-form]');
    if (!forms.length) return;

    const existing = getSubscriber();

    forms.forEach((form) => {
        const input = form.querySelector('input[type="email"], input[name="email"]');
        if (existing && input) {
            input.value = existing.email;
            const hint = document.createElement('p');
            hint.className = 'font-label-bold text-xs uppercase text-primary mt-2';
            hint.textContent = 'Você já está inscrito nas ofertas Silveira.';
            form.appendChild(hint);
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = (input?.value || '').trim();

            if (!isValidEmail(email)) {
                showToast('Informe um e-mail válido');
                input?.focus();
                trackEvent('newsletter_invalid');
                return;
            }

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ email, at: new Date().toISOString() })
            );
            showToast('Inscrição confirmada! Ofertas a caminho.');
            trackEvent('newsletter_subscribe', { domain: email.split('@')[1] });
            form.reset();
        });
    });
}
