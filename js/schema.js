import { SITE } from './config.js';

/** Injeta JSON-LD para SEO (Organization + produtos na página) */
export function injectSchema(products = []) {
    const org = {
        '@context': 'https://schema.org',
        '@type': 'GroceryStore',
        name: SITE.name,
        slogan: SITE.slogan,
        url: SITE.url,
        image: `${SITE.url}/assets/silveira-brocolis-mascote.png`,
        priceRange: '$$',
        openingHours: 'Mo-Su 07:00-22:00',
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'BR',
        },
    };

    appendScript(org);

    const dept = document.body.dataset.department;
    if (dept && products.length) {
        const list = products.slice(0, 8).map((p) => ({
            '@type': 'Product',
            name: p.name,
            image: p.image,
            offers: {
                '@type': 'Offer',
                price: p.price,
                priceCurrency: 'BRL',
                availability: 'https://schema.org/InStock',
            },
        }));

        appendScript({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: list.map((item, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                item,
            })),
        });
    }
}

function appendScript(data) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
}
