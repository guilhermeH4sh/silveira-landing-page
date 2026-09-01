/** Accordion acessível reutilizável */
export function initAccordions() {
    document.querySelectorAll('[data-accordion]').forEach((accordion) => {
        accordion.querySelectorAll('[data-accordion-trigger]').forEach((trigger) => {
            const panel = trigger.nextElementSibling;
            if (!panel) return;

            trigger.setAttribute('aria-expanded', 'false');
            panel.hidden = true;

            trigger.addEventListener('click', () => {
                const open = trigger.getAttribute('aria-expanded') === 'true';
                trigger.setAttribute('aria-expanded', String(!open));
                panel.hidden = open;
            });
        });
    });
}
