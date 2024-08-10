document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const themeRadios = document.querySelectorAll('input[name="theme"]');
    const logoutButton = document.getElementById('logout-button');
    const loginFirstScreen = document.getElementById('login-first-screen');
    const settingsContent = document.getElementById('settings-content');

    // Handle tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-tab');
            tabContents.forEach(content => {
                if (content.id === targetId) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // Default to the first tab
    if (tabs.length > 0) {
        tabs[0].click();
    }

    // Handle theme toggle
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeRadios.forEach(radio => {
        if (radio.value === currentTheme) {
            radio.checked = true;
        }
    });

    themeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const newTheme = radio.value;
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    });

    // Check if logged in
    const session = localStorage.getItem('session');
    if (!session) {
        settingsContent.style.display = 'none';
        loginFirstScreen.style.display = 'flex';
    } else {
        loginFirstScreen.style.display = 'none';
    }

    // Logout functionality
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('session');
            window.location.href = '../Login/index.html';
        });
    }
});
