import { showToast } from './toast.js';
import { trackEvent } from './analytics.js';

/**
 * Autocomplete de endereço via ViaCEP no checkout.
 */
export function initCepLookup() {
    const cepInput = document.querySelector('[data-checkout-cep]');
    const addressInput = document.querySelector('[data-checkout-address]');
    if (!cepInput) return;

    let timer = null;

    async function lookup(cep) {
        const digits = cep.replace(/\D/g, '');
        if (digits.length !== 8) return;

        cepInput.setAttribute('aria-busy', 'true');
        try {
            const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
            const data = await res.json();
            if (data.erro) {
                showToast('CEP não encontrado');
                trackEvent('cep_not_found', { cep: digits });
                return;
            }
            const composed = [data.logradouro, data.bairro, data.localidade, data.uf]
                .filter(Boolean)
                .join(', ');
            if (addressInput) {
                addressInput.value = composed;
                addressInput.dispatchEvent(new Event('input', { bubbles: true }));
            } else {
                const fallback = document.querySelector('[data-checkout-panel="1"] input[type="text"]:not([data-checkout-cep])');
                if (fallback) fallback.value = composed;
            }
            showToast(`Endereço preenchido: ${data.localidade}/${data.uf}`);
            trackEvent('cep_lookup_ok', { uf: data.uf });
        } catch {
            showToast('Não foi possível consultar o CEP');
            trackEvent('cep_lookup_error');
        } finally {
            cepInput.removeAttribute('aria-busy');
        }
    }

    cepInput.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(() => lookup(cepInput.value), 400);
    });

    cepInput.addEventListener('blur', () => lookup(cepInput.value));
}
