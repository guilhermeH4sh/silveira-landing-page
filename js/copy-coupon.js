import { showToast } from './toast.js';
import { trackEvent } from './analytics.js';

const COUPONS = [
    { code: 'SILVEIRA10', desc: '10% off no carrinho' },
    { code: 'FRESCOR15', desc: '15% em hortifruti (mock)' },
    { code: 'BAIRRO5', desc: 'R$5 de desconto' },
];

/**
 * Renderiza chips de cupom com cópia em um clique.
 */
export function initCopyCoupons() {
    const root = document.querySelector('[data-coupon-board]');
    if (!root) return;

    root.innerHTML = `
        <h2 class="font-headline-md text-xl uppercase mb-4">Cupons da semana</h2>
        <div class="flex flex-wrap gap-3">
            ${COUPONS.map(
                (c) => `
                <button type="button" data-copy-coupon="${c.code}" class="coupon-chip border-2 border-dashed border-primary bg-primary-container/40 px-4 py-3 text-left hover:bg-primary-container transition-colors">
                    <span class="font-label-bold text-primary block tracking-wider">${c.code}</span>
                    <span class="font-body-md text-xs text-on-surface-variant">${c.desc} · clique para copiar</span>
                </button>`
            ).join('')}
        </div>
    `;

    root.addEventListener('click', async (e) => {
        const btn = e.target.closest('[data-copy-coupon]');
        if (!btn) return;
        const code = btn.dataset.copyCoupon;
        try {
            await navigator.clipboard.writeText(code);
            showToast(`Cupom ${code} copiado!`);
            trackEvent('copy_coupon', { code });
        } catch {
            showToast(`Use o cupom: ${code}`);
        }
    });
}
