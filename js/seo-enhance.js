import { SITE } from './config.js';

/** Injeta meta tags SEO avançadas (og:image, canonical) */
export function injectSeoMeta() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    const url = `${SITE.url}/${page === 'index.html' ? '' : page}`.replace(/\/$/, '') || SITE.url;
    const image = `${SITE.url}/assets/silveira-brocolis-mascote.png`;

    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', image);
    setMeta('name', 'twitter:image', image);

    if (!document.querySelector('link[rel=canonical]')) {
        const link = document.createElement('link');
        link.rel = 'canonical';
        link.href = url.endsWith('index.html') ? SITE.url + '/' : url;
        document.head.appendChild(link);
    }
}

function setMeta(attr, key, content) {
    let el = document.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
    }
    el.content = content;
}

/** Registra service worker para cache offline */
export function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(() => {});
    }
}
