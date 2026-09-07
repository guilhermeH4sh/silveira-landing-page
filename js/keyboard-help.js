import { trackEvent } from './analytics.js';

/**
 * Overlay de atalhos de teclado (tecla ?).
 */
export function initKeyboardHelp() {
    let panel = null;

    function ensure() {
        if (panel) return panel;
        panel = document.createElement('div');
        panel.id = 'keyboard-help';
        panel.className = 'keyboard-help hidden';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-modal', 'true');
        panel.setAttribute('aria-label', 'Atalhos de teclado');
        panel.innerHTML = `
            <div class="keyboard-help__backdrop" data-help-close></div>
            <div class="keyboard-help__panel">
                <button type="button" data-help-close class="absolute top-3 right-3 p-1" aria-label="Fechar">
                    <span class="material-symbols-outlined">close</span>
                </button>
                <h2 class="font-headline-md text-xl uppercase mb-4">Atalhos</h2>
                <dl class="space-y-3 font-body-md text-sm">
                    <div class="flex justify-between gap-4 border-b border-outline-variant pb-2">
                        <dt>Busca rápida</dt><dd><kbd>Ctrl</kbd> + <kbd>K</kbd></dd>
                    </div>
                    <div class="flex justify-between gap-4 border-b border-outline-variant pb-2">
                        <dt>Este painel</dt><dd><kbd>?</kbd></dd>
                    </div>
                    <div class="flex justify-between gap-4 border-b border-outline-variant pb-2">
                        <dt>Fechar overlays</dt><dd><kbd>Esc</kbd></dd>
                    </div>
                    <div class="flex justify-between gap-4">
                        <dt>Ir ao carrinho</dt><dd><kbd>G</kbd> depois <kbd>C</kbd></dd>
                    </div>
                </dl>
            </div>
        `;
        document.body.appendChild(panel);
        panel.querySelectorAll('[data-help-close]').forEach((el) => {
            el.addEventListener('click', close);
        });
        return panel;
    }

    function open() {
        ensure().classList.remove('hidden');
        trackEvent('open_keyboard_help');
    }

    function close() {
        panel?.classList.add('hidden');
    }

    let chord = '';
    let chordTimer = null;

    document.addEventListener('keydown', (e) => {
        const tag = e.target?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return;

        if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            if (panel && !panel.classList.contains('hidden')) close();
            else open();
            return;
        }

        if (e.key === 'Escape') close();

        if (e.key.toLowerCase() === 'g' || e.key.toLowerCase() === 'c') {
            chord += e.key.toLowerCase();
            clearTimeout(chordTimer);
            chordTimer = setTimeout(() => {
                chord = '';
            }, 800);
            if (chord === 'gc') {
                chord = '';
                window.location.href = 'carrinho.html';
            }
        }
    });
}
