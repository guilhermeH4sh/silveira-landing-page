import { getCart, getCartTotal, formatPrice } from './cart.js';
import { SITE } from './config.js';
import { showToast } from './toast.js';
import { trackEvent } from './analytics.js';

export function printShoppingList() {
    const cart = getCart();
    if (!cart.length) {
        showToast('Carrinho vazio — nada para imprimir');
        return;
    }

    const rows = cart
        .map(
            (i) =>
                `<tr><td>${i.name}</td><td>${i.qty}</td><td>${i.unit || ''}</td><td>${formatPrice(i.price * i.qty)}</td></tr>`
        )
        .join('');

    const win = window.open('', '_blank', 'width=720,height=800');
    if (!win) {
        showToast('Permita pop-ups para imprimir a lista');
        return;
    }

    win.document.write(`<!DOCTYPE html><html lang="pt-BR"><head>
        <meta charset="utf-8"/>
        <title>Lista de compras — ${SITE.name}</title>
        <style>
            body{font-family:system-ui,sans-serif;padding:24px;color:#141a32}
            h1{font-size:1.5rem;margin:0 0 8px}
            p{color:#555;margin:0 0 24px}
            table{width:100%;border-collapse:collapse}
            th,td{border:1px solid #141a32;padding:8px 12px;text-align:left}
            th{background:#e8f5e9}
            tfoot td{font-weight:700}
            @media print{button{display:none}}
        </style>
    </head><body>
        <h1>${SITE.name}</h1>
        <p>${SITE.slogan} · Lista gerada em ${new Date().toLocaleString('pt-BR')}</p>
        <table>
            <thead><tr><th>Produto</th><th>Qtd</th><th>Unidade</th><th>Subtotal</th></tr></thead>
            <tbody>${rows}</tbody>
            <tfoot><tr><td colspan="3">Total</td><td>${formatPrice(getCartTotal())}</td></tr></tfoot>
        </table>
        <p style="margin-top:24px"><button onclick="window.print()">Imprimir</button></p>
    </body></html>`);
    win.document.close();
    trackEvent('print_shopping_list', { items: cart.length });
    setTimeout(() => win.print(), 300);
}

export function initPrintList() {
    document.querySelectorAll('[data-print-list]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            printShoppingList();
        });
    });
}
