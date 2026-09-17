/**
 * Normaliza preços para uma base comparável (R$ por kg / litro / unidade).
 */
const WEIGHT_RE = /(\d+(?:[.,]\d+)?)\s*(kg|g|l|ml|un|unid)/i;

export function parseUnit(unitText = '') {
    const match = String(unitText).match(WEIGHT_RE);
    if (!match) return null;

    const value = parseFloat(match[1].replace(',', '.'));
    const suffix = match[2].toLowerCase();

    if (suffix === 'kg') return { qty: value, base: 'kg' };
    if (suffix === 'g') return { qty: value / 1000, base: 'kg' };
    if (suffix === 'l') return { qty: value, base: 'L' };
    if (suffix === 'ml') return { qty: value / 1000, base: 'L' };
    return { qty: value, base: 'un' };
}

export function unitPriceLabel(product) {
    const parsed = parseUnit(product.unit) || parseUnit(product.name);
    if (!parsed || !parsed.qty || parsed.qty <= 0) return '';

    const perBase = product.price / parsed.qty;
    if (Math.abs(perBase - product.price) < 0.01) return '';

    return `${perBase.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} / ${parsed.base}`;
}

export function renderUnitPrice(product) {
    const label = unitPriceLabel(product);
    if (!label) return '';
    return `<p class="font-body-md text-[11px] text-on-surface-variant" data-unit-price>${label}</p>`;
}
