import { trackEvent } from './analytics.js';

/**
 * Countdown de ofertas flash baseado em data/promotions.json.
 * Atualiza a cada segundo e esconde o bloco quando a promoção expira.
 */
export async function initFlashCountdown() {
    const root = document.querySelector('[data-flash-countdown]');
    if (!root) return;

    let promotions = [];
    try {
        const res = await fetch('data/promotions.json');
        const data = await res.json();
        promotions = data.promotions || [];
    } catch {
        return;
    }

    const active = promotions.find((p) => new Date(p.endsAt).getTime() > Date.now());
    if (!active) {
        root.classList.add('hidden');
        return;
    }

    root.classList.remove('hidden');
    root.innerHTML = `
        <div class="flash-countdown">
            <div>
                <p class="font-label-bold text-xs uppercase tracking-wider text-tertiary mb-1">Oferta relâmpago</p>
                <p class="font-headline-md text-xl">${active.title}</p>
                <p class="font-body-md text-sm text-on-surface-variant">${active.description}</p>
            </div>
            <div class="flash-countdown__timer" aria-live="polite">
                <span data-cd-h>00</span>:<span data-cd-m>00</span>:<span data-cd-s>00</span>
            </div>
        </div>
    `;

    const ends = new Date(active.endsAt).getTime();
    const hEl = root.querySelector('[data-cd-h]');
    const mEl = root.querySelector('[data-cd-m]');
    const sEl = root.querySelector('[data-cd-s]');

    function tick() {
        const diff = Math.max(0, ends - Date.now());
        const totalSec = Math.floor(diff / 1000);
        const h = Math.floor(totalSec / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = totalSec % 60;
        hEl.textContent = String(h).padStart(2, '0');
        mEl.textContent = String(m).padStart(2, '0');
        sEl.textContent = String(s).padStart(2, '0');
        if (diff === 0) {
            clearInterval(timer);
            root.classList.add('hidden');
            trackEvent('flash_offer_expired', { id: active.id });
        }
    }

    tick();
    const timer = setInterval(tick, 1000);
    trackEvent('flash_offer_view', { id: active.id });
}
