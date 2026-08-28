let cache = null;

export async function loadProducts() {
    if (cache) return cache;
    const res = await fetch('data/products.json');
    const data = await res.json();
    cache = data.products;
    return cache;
}

export function getByDepartment(products, department) {
    if (department === 'ofertas') {
        return products.filter((p) => p.badge === 'OFERTA');
    }
    return products.filter((p) => p.department === department);
}

export function searchProducts(products, query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter(
        (p) =>
            p.name.toLowerCase().includes(q) ||
            p.department.toLowerCase().includes(q) ||
            p.unit.toLowerCase().includes(q)
    );
}

export function getProductById(products, id) {
    return products.find((p) => p.id === id);
}
