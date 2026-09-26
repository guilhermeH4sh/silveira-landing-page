import { trackEvent } from './analytics.js';

/**
 * Coleta Web Vitals aproximados (LCP, CLS, INP) sem dependência externa
 * e envia para o stub de analytics.
 */
export function initWebVitals() {
    if (!('PerformanceObserver' in window)) return;

    try {
        const lcpObs = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const last = entries[entries.length - 1];
            if (last) trackEvent('web_vital_lcp', { value: Math.round(last.startTime) });
        });
        lcpObs.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch {
        /* unsupported */
    }

    try {
        let cls = 0;
        const clsObs = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (!entry.hadRecentInput) cls += entry.value;
            });
        });
        clsObs.observe({ type: 'layout-shift', buffered: true });

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                trackEvent('web_vital_cls', { value: Math.round(cls * 1000) / 1000 });
            }
        });
    } catch {
        /* unsupported */
    }

    try {
        const inpObs = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.duration > 40) {
                    trackEvent('web_vital_inp', { value: Math.round(entry.duration) });
                }
            });
        });
        inpObs.observe({ type: 'event', buffered: true, durationThreshold: 40 });
    } catch {
        /* event timing may be unsupported */
    }

    window.addEventListener('load', () => {
        const nav = performance.getEntriesByType('navigation')[0];
        if (nav) {
            trackEvent('web_vital_ttfb', { value: Math.round(nav.responseStart) });
            trackEvent('web_vital_dom', { value: Math.round(nav.domContentLoadedEventEnd) });
        }
    });
}
