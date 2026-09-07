import { getCart, formatPrice, getCartTotal } from './cart.js';
import { showToast } from './toast.js';
import { trackEvent } from './analytics.js';

/**
 * Exporta o carrinho atual como CSV para download.
 */
export function exportCartCsv() {
    const cart = getCart();
    if (!cart.length) {
        showToast('Carrinho vazio — nada para exportar');
        return;
    }

    const header = 'id,nome,quantidade,preco_unitario,subtotal,unidade';
    const rows = cart.map((i) =>
        [
            i.id,
            `"${String(i.name).replace(/"/g, '""')}"`,
            i.qty,
            i.price.toFixed(2),
            (i.price * i.qty).toFixed(2),
            `"${String(i.unit || '').replace(/"/g, '""')}"`,
        ].join(',')
    );
    rows.push(`TOTAL,,,,${getCartTotal().toFixed(2)},`);

    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `silveira-carrinho-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    trackEvent('export_cart_csv', { items: cart.length, total: getCartTotal() });
    showToast(`CSV gerado · total ${formatPrice(getCartTotal())}`);
}

export function initExportCart() {
    document.querySelectorAll('[data-export-cart]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            exportCartCsv();
        });
    });
}
