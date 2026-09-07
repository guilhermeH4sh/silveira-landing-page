import { formatPrice } from './cart.js';
import { addToCart } from './cart.js';
import { showToast } from './toast.js';
import { trackEvent } from './analytics.js';

let recipesCache = null;

export async function loadRecipes() {
    if (recipesCache) return recipesCache;
    try {
        const res = await fetch('data/recipes.json');
        const data = await res.json();
        recipesCache = data.recipes || [];
    } catch {
        recipesCache = [];
    }
    return recipesCache;
}

export function renderRecipes(recipes, products) {
    const root = document.querySelector('[data-recipes]');
    if (!root) return;

    const byId = Object.fromEntries(products.map((p) => [p.id, p]));

    root.innerHTML = recipes
        .map((r) => {
            const ingredients = r.ingredients.map((id) => byId[id]).filter(Boolean);
            return `
            <article class="border-2 border-on-surface bg-white overflow-hidden" data-recipe="${r.id}">
                <img src="${r.image}" alt="" class="w-full h-48 object-cover" loading="lazy"/>
                <div class="p-5">
                    <h2 class="font-headline-md text-xl mb-2">${r.title}</h2>
                    <p class="font-label-bold text-xs uppercase text-on-surface-variant mb-4">${r.time} · ${r.servings} porções</p>
                    <h3 class="font-label-bold text-sm uppercase mb-2">Ingredientes</h3>
                    <ul class="space-y-2 mb-4">
                        ${ingredients
                            .map(
                                (p) => `
                            <li class="flex justify-between items-center gap-2 text-sm">
                                <span>${p.name}</span>
                                <span class="font-label-bold text-primary">${formatPrice(p.price)}</span>
                            </li>`
                            )
                            .join('')}
                    </ul>
                    <ol class="list-decimal pl-5 space-y-1 font-body-md text-sm mb-4">
                        ${r.steps.map((s) => `<li>${s}</li>`).join('')}
                    </ol>
                    <button type="button" data-add-recipe="${r.id}" class="brutalist-button w-full bg-secondary-container text-on-secondary-container py-3 font-label-bold uppercase border-2 border-on-surface text-sm">
                        Adicionar ingredientes ao carrinho
                    </button>
                </div>
            </article>`;
        })
        .join('');

    root.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-add-recipe]');
        if (!btn) return;
        const recipe = recipes.find((r) => r.id === btn.dataset.addRecipe);
        if (!recipe) return;
        let count = 0;
        recipe.ingredients.forEach((id) => {
            const p = byId[id];
            if (p) {
                addToCart(p);
                count += 1;
            }
        });
        showToast(`${count} item(ns) da receita adicionados`);
        trackEvent('add_recipe_to_cart', { recipe_id: recipe.id, items: count });
    });
}
