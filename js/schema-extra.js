import { SITE } from './config.js';

function appendScript(data) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
}

/**
 * BreadcrumbList a partir da navegação semântica já renderizada.
 */
export function injectBreadcrumbSchema() {
    const items = [...document.querySelectorAll('nav[aria-label="Breadcrumb"] a, [data-breadcrumbs] a')];
    if (items.length < 2) return;

    appendScript({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((a, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: a.textContent.trim(),
            item: new URL(a.getAttribute('href'), `${SITE.url}/`).href,
        })),
    });
}

/**
 * FAQPage extraído do accordion de faq.html.
 */
export function injectFaqSchema() {
    const root = document.querySelector('[data-accordion]');
    if (!root || !window.location.pathname.includes('faq')) return;

    const triggers = [...root.querySelectorAll('[data-accordion-trigger]')];
    if (!triggers.length) return;

    appendScript({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: triggers.map((t) => ({
            '@type': 'Question',
            name: t.textContent.trim(),
            acceptedAnswer: {
                '@type': 'Answer',
                text: (t.nextElementSibling?.textContent || '').trim(),
            },
        })),
    });
}

/**
 * WebSite + SearchAction para sitelinks searchbox no Google.
 */
export function injectSearchActionSchema() {
    appendScript({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE.name,
        url: `${SITE.url}/`,
        potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE.url}/busca.html?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
        },
    });
}

export function injectExtraSchema() {
    injectBreadcrumbSchema();
    injectFaqSchema();
    injectSearchActionSchema();
}
