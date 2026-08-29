import { SITE } from './config.js';
import { formatPrice, getCartTotal } from './cart.js';

const FREE_SHIPPING_MIN = SITE.freeShippingMin;

/** Barra de progresso para frete grátis no carrinho */
export function renderShippingBar() {
    const container = document.querySelector('[data-shipping-bar]');
    if (!container) return;

    const total = getCartTotal();
    const remaining = Math.max(0, FREE_SHIPPING_MIN - total);
    const progress = Math.min(100, (total / FREE_SHIPPING_MIN) * 100);
    const qualified = total >= FREE_SHIPPING_MIN;

    container.innerHTML = `
        <div class="border-2 border-on-surface bg-white p-4 mb-6">
            <div class="flex justify-between items-center mb-2">
                <span class="font-label-bold text-sm uppercase">${qualified ? 'Frete grátis garantido!' : 'Progresso frete grátis'}</span>
                <span class="font-label-bold text-sm text-primary">${Math.round(progress)}%</span>
            </div>
            <div class="h-3 bg-surface-container border border-on-surface overflow-hidden">
                <div class="h-full bg-primary-container transition-all duration-500" style="width:${progress}%"></div>
            </div>
            <p class="font-body-md text-sm mt-2 text-on-surface-variant">
                ${qualified
                    ? `Pedido acima de ${formatPrice(FREE_SHIPPING_MIN)} — entrega gratuita aplicada.`
                    : `Faltam ${formatPrice(remaining)} para frete grátis acima de ${formatPrice(FREE_SHIPPING_MIN)}.`}
            </p>
        </div>
    `;
}
