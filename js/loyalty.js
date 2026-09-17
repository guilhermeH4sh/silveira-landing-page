import { getOrders } from './orders.js';
import { formatPrice } from './cart.js';
import { showToast } from './toast.js';
import { trackEvent } from './analytics.js';

const POINTS_PER_REAL = 1;
const TIERS = [
    { id: 'bronze', label: 'Bronze', min: 0, perk: '5% em ofertas selecionadas' },
    { id: 'prata', label: 'Prata', min: 300, perk: 'Frete grátis acima de R$ 100' },
    { id: 'ouro', label: 'Ouro', min: 800, perk: 'Frete grátis sempre + cupons exclusivos' },
];

export function computePoints(orders = getOrders()) {
    return Math.floor(orders.reduce((sum, o) => sum + (o.total || 0), 0) * POINTS_PER_REAL);
}

export function tierForPoints(points) {
    return [...TIERS].reverse().find((t) => points >= t.min) || TIERS[0];
}

export function nextTier(points) {
    return TIERS.find((t) => t.min > points) || null;
}

/**
 * Programa de fidelidade derivado do histórico de pedidos local.
 */
export function renderLoyalty() {
    const root = document.querySelector('[data-loyalty]');
    if (!root) return;

    const orders = getOrders();
    const points = computePoints(orders);
    const tier = tierForPoints(points);
    const next = nextTier(points);
    const progress = next ? Math.min(100, Math.round((points / next.min) * 100)) : 100;

    root.innerHTML = `
        <div class="border-2 border-on-surface bg-white p-6">
            <div class="flex justify-between items-center mb-3 flex-wrap gap-2">
                <h2 class="font-headline-md text-xl uppercase">Clube Silveira</h2>
                <span class="loyalty-tier loyalty-tier--${tier.id}">${tier.label}</span>
            </div>
            <p class="font-price-display text-price-display text-primary mb-1">${points} pontos</p>
            <p class="font-body-md text-sm text-on-surface-variant mb-4">
                Acumulado em ${orders.length} pedido(s) · total ${formatPrice(orders.reduce((s, o) => s + (o.total || 0), 0))}
            </p>
            <div class="loyalty-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}">
                <span style="width:${progress}%"></span>
            </div>
            <p class="font-body-md text-sm mt-2">
                ${next ? `Faltam <strong>${next.min - points}</strong> pontos para o nível ${next.label}.` : 'Você atingiu o nível máximo!'}
            </p>
            <p class="font-label-bold text-xs uppercase text-primary mt-3">Benefício atual: ${tier.perk}</p>
        </div>
    `;
    trackEvent('view_loyalty', { points, tier: tier.id });
}

export function initLoyalty() {
    renderLoyalty();
    document.addEventListener('click', (e) => {
        if (!e.target.closest('[data-loyalty-info]')) return;
        showToast(`Você acumula ${POINTS_PER_REAL} ponto por real gasto.`);
    });
}
