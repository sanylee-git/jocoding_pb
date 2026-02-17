(() => {
    const THEME_KEY = 'theme';

    function setTheme(theme) {
        const root = document.documentElement;
        if (theme === 'system') {
            root.removeAttribute('data-theme');
            localStorage.removeItem(THEME_KEY);
        } else {
            root.setAttribute('data-theme', theme);
            localStorage.setItem(THEME_KEY, theme);
        }
    }

    // Set theme immediately on script load to prevent FOUC
    const savedTheme = localStorage.getItem(THEME_KEY);
    setTheme(savedTheme || 'system');

    // Listen for changes to the system theme
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        // Only update if the theme is currently set to 'system'
        if (!localStorage.getItem(THEME_KEY)) {
            setTheme('system');
        }
    });

    // Add event listeners after the DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        const themeSwitcherBtns = document.querySelectorAll('[data-theme-switcher]');
        themeSwitcherBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                setTheme(btn.dataset.themeSwitcher);
            });
        });
    });
})();
