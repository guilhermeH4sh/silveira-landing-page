/** Stub de analytics — pronto para integrar GA4/Plausible */
const events = [];

export function trackEvent(name, payload = {}) {
    events.push({ name, payload, ts: Date.now() });
    if (localStorage.getItem('silveira_debug_analytics') === '1') {
        console.info('[analytics]', name, payload);
    }
    window.dispatchEvent(new CustomEvent('silveira:analytics', { detail: { name, payload } }));
}

export function getEventLog() {
    return [...events];
}
