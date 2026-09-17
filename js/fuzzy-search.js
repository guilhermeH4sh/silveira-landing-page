/**
 * Distância de Levenshtein com limite, usada para busca tolerante a erros.
 */
export function levenshtein(a, b, limit = 3) {
    if (a === b) return 0;
    if (Math.abs(a.length - b.length) > limit) return limit + 1;

    let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i += 1) {
        const curr = [i];
        let rowMin = i;
        for (let j = 1; j <= b.length; j += 1) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
            rowMin = Math.min(rowMin, curr[j]);
        }
        if (rowMin > limit) return limit + 1;
        prev = curr;
    }
    return prev[b.length];
}

function normalize(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Busca produtos tolerando erros de digitação e acentuação.
 */
export function fuzzySearch(products, query, { maxDistance = 2, limit = 12 } = {}) {
    const q = normalize(query.trim());
    if (!q) return [];

    const scored = products
        .map((p) => {
            const name = normalize(p.name);
            if (name.includes(q)) return { product: p, score: 0 };

            const words = name.split(/\s+/);
            const best = Math.min(...words.map((w) => levenshtein(q, w, maxDistance)));
            return { product: p, score: best };
        })
        .filter((s) => s.score <= maxDistance)
        .sort((a, b) => a.score - b.score || a.product.name.localeCompare(b.product.name, 'pt-BR'));

    return scored.slice(0, limit).map((s) => s.product);
}

/**
 * Sugere o termo mais próximo quando a busca exata não retorna nada.
 */
export function suggestTerm(products, query, maxDistance = 3) {
    const q = normalize(query.trim());
    if (!q) return null;

    let best = null;
    let bestScore = maxDistance + 1;

    products.forEach((p) => {
        normalize(p.name)
            .split(/\s+/)
            .forEach((word) => {
                const d = levenshtein(q, word, maxDistance);
                if (d < bestScore && d > 0) {
                    bestScore = d;
                    best = word;
                }
            });
    });

    return best;
}
