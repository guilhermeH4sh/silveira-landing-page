import { trackEvent } from './analytics.js';
import { showToast } from './toast.js';

/**
 * Busca por voz via Web Speech API (quando disponível).
 * Envolve o input em um wrapper relativo e injeta o botão de microfone.
 */
export function initVoiceSearch() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    document.querySelectorAll('[data-search-input], [data-quick-search-input]').forEach((input) => {
        if (input.closest('.voice-search-wrap')?.querySelector('[data-voice-search]')) return;

        const wrap = document.createElement('div');
        wrap.className = 'voice-search-wrap relative flex-1';
        input.parentElement.insertBefore(wrap, input);
        wrap.appendChild(input);
        input.classList.add('w-full');
        input.style.paddingRight = '2.75rem';

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.dataset.voiceSearch = '';
        btn.className = 'voice-search-btn';
        btn.setAttribute('aria-label', 'Buscar por voz');
        btn.title = 'Buscar por voz';
        btn.innerHTML = '<span class="material-symbols-outlined text-[22px]">mic</span>';
        wrap.appendChild(btn);

        let recognition = null;
        let listening = false;

        btn.addEventListener('click', () => {
            if (listening && recognition) {
                recognition.stop();
                return;
            }

            recognition = new SpeechRecognition();
            recognition.lang = 'pt-BR';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.onstart = () => {
                listening = true;
                btn.classList.add('is-listening');
                btn.setAttribute('aria-pressed', 'true');
                showToast('Ouvindo… fale o produto');
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                input.value = transcript;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                trackEvent('voice_search', { transcript: transcript.slice(0, 60) });
                showToast(`Buscando: ${transcript}`);
            };

            recognition.onerror = () => {
                showToast('Não foi possível capturar a voz');
                trackEvent('voice_search_error');
            };

            recognition.onend = () => {
                listening = false;
                btn.classList.remove('is-listening');
                btn.setAttribute('aria-pressed', 'false');
            };

            recognition.start();
        });
    });
}
