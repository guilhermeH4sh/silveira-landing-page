/** Toolbar de acessibilidade: alto contraste e escala de fonte */
export function initA11yToolbar() {
    if (document.getElementById('a11y-toolbar')) return;

    const toolbar = document.createElement('div');
    toolbar.id = 'a11y-toolbar';
    toolbar.className = 'fixed bottom-6 left-6 z-50 flex flex-col gap-2';
    toolbar.setAttribute('role', 'toolbar');
    toolbar.setAttribute('aria-label', 'Ferramentas de acessibilidade');
    toolbar.innerHTML = `
        <button type="button" data-a11y-contrast class="a11y-btn" title="Alto contraste" aria-pressed="false">
            <span class="material-symbols-outlined text-[20px]">contrast</span>
        </button>
        <button type="button" data-a11y-font-up class="a11y-btn" title="Aumentar fonte">
            <span class="material-symbols-outlined text-[20px]">text_increase</span>
        </button>
        <button type="button" data-a11y-font-down class="a11y-btn" title="Diminuir fonte">
            <span class="material-symbols-outlined text-[20px]">text_decrease</span>
        </button>
    `;
    document.body.appendChild(toolbar);

    let fontScale = parseFloat(localStorage.getItem('silveira_font_scale') || '1');

    function applyFontScale() {
        document.documentElement.style.fontSize = `${fontScale * 100}%`;
        localStorage.setItem('silveira_font_scale', String(fontScale));
    }

    if (localStorage.getItem('silveira_high_contrast') === '1') {
        document.body.classList.add('high-contrast');
        toolbar.querySelector('[data-a11y-contrast]').setAttribute('aria-pressed', 'true');
    }
    applyFontScale();

    toolbar.querySelector('[data-a11y-contrast]').addEventListener('click', (e) => {
        const active = document.body.classList.toggle('high-contrast');
        localStorage.setItem('silveira_high_contrast', active ? '1' : '0');
        e.currentTarget.setAttribute('aria-pressed', String(active));
    });

    toolbar.querySelector('[data-a11y-font-up]').addEventListener('click', () => {
        fontScale = Math.min(1.3, fontScale + 0.05);
        applyFontScale();
    });

    toolbar.querySelector('[data-a11y-font-down]').addEventListener('click', () => {
        fontScale = Math.max(0.85, fontScale - 0.05);
        applyFontScale();
    });
}
