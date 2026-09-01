const STORAGE_KEY = 'silveira_orders';

export function getOrders() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
        return [];
    }
}

export function saveOrder(cart, total) {
    const orders = getOrders();
    orders.unshift({
        id: `PED-${Date.now().toString(36).toUpperCase()}`,
        date: new Date().toISOString(),
        items: cart.map(({ id, name, qty, price }) => ({ id, name, qty, price })),
        total,
        status: 'confirmado',
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders.slice(0, 10)));
}

export function renderOrderHistory() {
    const container = document.querySelector('[data-order-history]');
    if (!container) return;

    const orders = getOrders();
    if (!orders.length) {
        container.innerHTML = '<p class="font-body-md text-on-surface-variant">Nenhum pedido realizado ainda.</p>';
        return;
    }

    container.innerHTML = orders.map((o) => `
        <div class="border-2 border-on-surface bg-white p-4 mb-4">
            <div class="flex justify-between items-start mb-2">
                <span class="font-label-bold">${o.id}</span>
                <span class="text-sm text-primary font-label-bold uppercase">${o.status}</span>
            </div>
            <p class="text-sm text-on-surface-variant mb-2">${new Date(o.date).toLocaleDateString('pt-BR')} · ${o.items.length} item(ns)</p>
            <p class="font-price-display text-primary">${o.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        </div>
    `).join('');
}
