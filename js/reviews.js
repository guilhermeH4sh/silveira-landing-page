let reviewsCache = null;

export async function loadReviews() {
    if (reviewsCache) return reviewsCache;
    try {
        const res = await fetch('data/reviews.json');
        if (!res.ok) throw new Error('reviews fetch failed');
        reviewsCache = await res.json();
    } catch {
        reviewsCache = {};
    }
    return reviewsCache;
}

export function getProductReviews(reviews, productId) {
    return reviews[productId] || [];
}

export function avgRating(list) {
    if (!list.length) return 0;
    return list.reduce((s, r) => s + r.rating, 0) / list.length;
}

export function renderStars(rating) {
    const full = Math.round(rating);
    return Array.from({ length: 5 }, (_, i) =>
        i < full
            ? '<span class="material-symbols-outlined text-[16px] text-primary icon-fill" aria-hidden="true">star</span>'
            : '<span class="material-symbols-outlined text-[16px] text-outline" aria-hidden="true">star</span>'
    ).join('');
}

export function renderReviewsHtml(list) {
    if (!list.length) {
        return '<p class="font-body-md text-on-surface-variant text-sm mt-4">Ainda sem avaliações para este produto.</p>';
    }
    const avg = avgRating(list);
    return `
        <div class="mt-4 pt-4 border-t border-outline-variant" data-product-reviews>
            <div class="flex items-center gap-2 mb-3">
                <div class="flex" aria-label="Nota média ${avg.toFixed(1)} de 5">${renderStars(avg)}</div>
                <span class="font-label-bold text-sm">${avg.toFixed(1)} · ${list.length} avaliação${list.length > 1 ? 'ões' : ''}</span>
            </div>
            <ul class="space-y-3">
                ${list
                    .map(
                        (r) => `
                    <li class="border-l-2 border-primary pl-3">
                        <div class="flex items-center gap-1 mb-1">${renderStars(r.rating)}</div>
                        <p class="font-body-md text-sm">${r.comment}</p>
                        <cite class="font-label-bold text-xs text-on-surface-variant not-italic">— ${r.author}</cite>
                    </li>`
                    )
                    .join('')}
            </ul>
        </div>`;
}

export function renderCardRating(reviews, productId) {
    const list = getProductReviews(reviews, productId);
    if (!list.length) return '';
    const avg = avgRating(list);
    return `<div class="flex items-center gap-1 mb-1" aria-label="Nota ${avg.toFixed(1)}">${renderStars(avg)}<span class="text-[10px] text-on-surface-variant">(${list.length})</span></div>`;
}
