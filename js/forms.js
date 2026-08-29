import { showToast } from './toast.js';

function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/** Validação de formulários com feedback acessível */
export function initFormValidation() {
    document.querySelectorAll('[data-validate-form]').forEach((form) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let valid = true;

            form.querySelectorAll('[required]').forEach((field) => {
                const errorEl = field.parentElement.querySelector('[data-field-error]') || createError(field);
                field.removeAttribute('aria-invalid');
                errorEl.textContent = '';

                if (!field.value.trim()) {
                    valid = false;
                    field.setAttribute('aria-invalid', 'true');
                    errorEl.textContent = 'Campo obrigatório.';
                } else if (field.type === 'email' && !validateEmail(field.value)) {
                    valid = false;
                    field.setAttribute('aria-invalid', 'true');
                    errorEl.textContent = 'Informe um e-mail válido.';
                }
            });

            if (valid) {
                showToast(form.dataset.successMessage || 'Enviado com sucesso!');
                form.reset();
            } else {
                showToast('Verifique os campos destacados.', 'error');
            }
        });
    });
}

function createError(field) {
    const el = document.createElement('span');
    el.className = 'text-tertiary text-sm font-label-bold mt-1 block';
    el.dataset.fieldError = '';
    el.setAttribute('role', 'alert');
    field.parentElement.appendChild(el);
    return el;
}
