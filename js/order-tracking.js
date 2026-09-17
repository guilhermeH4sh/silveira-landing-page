import { getOrders } from './orders.js';
import { formatPrice } from './cart.js';
import { trackEvent } from './analytics.js';

const STAGES = [
    { id: 'confirmado', label: 'Pedido confirmado', icon: 'check_circle' },
    { id: 'separacao', label: 'Em separação', icon: 'inventory_2' },
    { id: 'rota', label: 'Saiu para entrega', icon: 'local_shipping' },
    { id: 'entregue', label: 'Entregue', icon: 'home' },
];

/**
 * Deriva o estágio a partir do tempo decorrido desde a criação do pedido.
 */
export function stageForOrder(order, now = Date.now()) {
    const elapsedMin = (now - new Date(order.date).getTime()) / 60000;
    if (elapsedMin < 5) return 0;
    if (elapsedMin < 20) return 1;
    if (elapsedMin < 60) return 2;
    return 3;
}

function renderTimeline(order) {
    const current = stageForOrder(order);
    return `
        <div class="border-2 border-on-surface bg-white p-6" data-order-id="${order.id}">
            <div class="flex justify-between items-start mb-6 gap-4 flex-wrap">
                <div>
                    <p class="font-label-bold text-lg">${order.id}</p>
                    <p class="text-sm text-on-surface-variant">${new Date(order.date).toLocaleString('pt-BR')} · ${order.items.length} item(ns)</p>
                </div>
                <span class="font-price-display text-primary">${formatPrice(order.total)}</span>
            </div>
            <ol class="order-timeline">
                ${STAGES.map(
                    (s, i) => `
                    <li class="order-timeline__step ${i <= current ? 'is-done' : ''}">
                        <span class="material-symbols-outlined">${s.icon}</span>
                        <span class="font-label-bold text-sm">${s.label}</span>
                    </li>`
                ).join('')}
            </ol>
            <ul class="mt-6 space-y-1 font-body-md text-sm border-t border-outline-variant pt-4">
                ${order.items
                    .map((i) => `<li class="flex justify-between gap-3"><span>${i.name} × ${i.qty}</span><span>${formatPrice(i.price * i.qty)}</span></li>`)
                    .join('')}
            </ul>
        </div>`;
}

export function renderOrderTracking() {
    const root = document.querySelector('[data-order-tracking]');
    if (!root) return;

    const params = new URLSearchParams(window.location.search);
    const wanted = params.get('id');
    const orders = getOrders();
    const list = wanted ? orders.filter((o) => o.id === wanted) : orders.slice(0, 3);

    if (!list.length) {
        root.innerHTML = `<div class="border-2 border-on-surface bg-white p-8 text-center">
            <p class="font-body-lg mb-4">${wanted ? `Pedido ${wanted} não encontrado.` : 'Você ainda não tem pedidos para acompanhar.'}</p>
            <a href="ofertas.html" class="font-label-bold text-secondary hover:underline">Ver ofertas da semana</a>
        </div>`;
        return;
    }

    root.innerHTML = list.map(renderTimeline).join('');
    trackEvent('view_order_tracking', { orders: list.length });
}
