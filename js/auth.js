const STORAGE_KEY = 'silveira_user';

export function getUser() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    } catch {
        return null;
    }
}

export function login(email, name) {
    const user = { email, name: name || email.split('@')[0], loggedAt: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent('auth:updated', { detail: user }));
    return user;
}

export function logout() {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('auth:updated', { detail: null }));
}

export function syncAuthUI() {
    const user = getUser();
    document.querySelectorAll('[data-auth-greeting]').forEach((el) => {
        el.textContent = user ? `Olá, ${user.name}` : '';
        el.classList.toggle('hidden', !user);
    });
    document.querySelectorAll('[data-auth-login]').forEach((el) => {
        el.classList.toggle('hidden', !!user);
    });
    document.querySelectorAll('[data-auth-logout]').forEach((el) => {
        el.classList.toggle('hidden', !user);
    });
}

export function initAuthForm() {
    const form = document.querySelector('[data-login-form]');
    if (!form) return;

    syncAuthUI();

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('[name=email]')?.value?.trim();
        const name = form.querySelector('[name=name]')?.value?.trim();
        if (!email || !email.includes('@')) return;
        login(email, name);
        syncAuthUI();
    });

    document.querySelector('[data-logout-btn]')?.addEventListener('click', () => {
        logout();
        syncAuthUI();
    });
}
