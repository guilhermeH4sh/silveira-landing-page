/**
 * Trap de foco para dialogs/modais (WCAG 2.1).
 * Retorna uma função dispose() para liberar o listener.
 */
export function trapFocus(container) {
    const focusable = () =>
        [
            ...container.querySelectorAll(
                'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
            ),
        ].filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);

    const nodes = focusable();
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    first?.focus();

    function onKey(e) {
        if (e.key !== 'Tab' || nodes.length === 0) return;
        const list = focusable();
        const f = list[0];
        const l = list[list.length - 1];
        if (e.shiftKey && document.activeElement === f) {
            e.preventDefault();
            l?.focus();
        } else if (!e.shiftKey && document.activeElement === l) {
            e.preventDefault();
            f?.focus();
        }
    }

    container.addEventListener('keydown', onKey);
    return () => container.removeEventListener('keydown', onKey);
}
