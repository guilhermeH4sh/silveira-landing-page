/** Exibe skeleton cards enquanto o catálogo carrega */
export function showProductSkeleton(container, count = 4) {
    if (!container) return;
    container.innerHTML = Array.from({ length: count }, () => `
        <div class="border border-on-surface p-4 bg-white" aria-hidden="true">
            <div class="skeleton h-[200px] mb-4"></div>
            <div class="skeleton h-4 w-3/4 mb-2"></div>
            <div class="skeleton h-6 w-1/3 mb-2"></div>
            <div class="skeleton h-3 w-1/4"></div>
        </div>
    `).join('');
    container.setAttribute('aria-busy', 'true');
}

export function hideProductSkeleton(container) {
    container?.removeAttribute('aria-busy');
}
