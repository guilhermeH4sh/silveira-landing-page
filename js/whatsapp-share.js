import { getCart, getCartTotal, formatPrice } from './cart.js';
import { SITE } from './config.js';
import { showToast } from './toast.js';
import { trackEvent } from './analytics.js';

function buildCartMessage() {
    const cart = getCart();
    if (!cart.length) return null;

    const lines = cart.map((i) => `• ${i.name} × ${i.qty} — ${formatPrice(i.price * i.qty)}`);
    return [
        `*Pedido ${SITE.name}*`,
        '',
        ...lines,
        '',
        `*Total: ${formatPrice(getCartTotal())}*`,
        '',
        'Gostaria de confirmar este pedido.',
    ].join('\n');
}

export function shareCartWhatsApp() {
    const msg = buildCartMessage();
    if (!msg) {
        showToast('Adicione itens ao carrinho primeiro');
        return;
    }
    const phone = SITE.whatsapp.replace(/\D/g, '');
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    trackEvent('share_cart_whatsapp', { items: getCart().length });
    window.open(url, '_blank', 'noopener');
}

export function initWhatsAppShare() {
    document.querySelectorAll('[data-whatsapp-cart]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            shareCartWhatsApp();
        });
    });
}
