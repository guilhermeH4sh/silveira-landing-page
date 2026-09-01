export async function loadStores() {
    const res = await fetch('data/stores.json');
    const data = await res.json();
    return data.stores;
}

export function renderStoreLocator(stores) {
    const container = document.querySelector('[data-stores-list]');
    if (!container) return;

    container.innerHTML = stores.map((s) => `
        <article class="border-2 border-on-surface bg-white p-6">
            <h2 class="font-headline-md text-xl mb-2">${s.name}</h2>
            <p class="font-body-md text-on-surface-variant mb-2">${s.address}</p>
            <p class="font-body-md text-sm mb-2"><strong>Horário:</strong> ${s.hours}</p>
            <p class="font-body-md text-sm mb-3"><strong>Tel:</strong> ${s.phone}</p>
            <div class="flex flex-wrap gap-2">
                ${s.services.map((svc) => `<span class="text-xs font-label-bold bg-primary-container text-on-primary-container px-2 py-1 uppercase">${svc}</span>`).join('')}
            </div>
        </article>
    `).join('');
}
