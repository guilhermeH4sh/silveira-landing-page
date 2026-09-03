import { SITE } from './config.js';
import { showToast } from './toast.js';
import { trackEvent } from './analytics.js';

export async function shareProduct(product) {
    if (!product) return;

    const deptPage = {
        hortifruti: 'hortifruti.html',
        acougue: 'acougue-peixaria.html',
        padaria: 'padaria.html',
        mercearia: 'mercearia.html',
        bebidas: 'bebidas.html',
    }[product.department] || 'ofertas.html';
    const url = `${SITE.url}/${deptPage}`;
    const data = {
        title: `${product.name} — ${SITE.name}`,
        text: `${product.name} por R$ ${product.price.toFixed(2).replace('.', ',')} no ${SITE.name}`,
        url,
    };

    try {
        if (navigator.share) {
            await navigator.share(data);
            trackEvent('share_product', { product_id: product.id, method: 'web_share' });
            return;
        }
    } catch (err) {
        if (err?.name === 'AbortError') return;
    }

    try {
        await navigator.clipboard.writeText(`${data.text}\n${data.url}`);
        showToast('Link do produto copiado!');
        trackEvent('share_product', { product_id: product.id, method: 'clipboard' });
    } catch {
        showToast('Não foi possível compartilhar');
    }
}

export function initShareProduct(products) {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-share-product]');
        if (!btn) return;
        e.preventDefault();
        const product = products.find((p) => p.id === btn.dataset.shareProduct);
        if (product) shareProduct(product);
    });
}
