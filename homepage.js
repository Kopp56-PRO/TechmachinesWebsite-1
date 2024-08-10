// homepage.js

document.addEventListener('DOMContentLoaded', () => {
    const session = JSON.parse(localStorage.getItem('session'));

    const usernameElement = document.getElementById('username');
    const signInButton = document.getElementById('sign-in-button');
    const settingsLink = document.getElementById('settings-link');

    if (session && session.username) {
        usernameElement.textContent = session.username;
        signInButton.style.display = 'none';
        settingsLink.style.display = 'block';
    } else {
        usernameElement.textContent = '';
        signInButton.style.display = 'block';
        settingsLink.style.display = 'none';
    }

    // Load and apply theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.add(savedTheme);
        document.querySelector('header').classList.add(savedTheme);
    }
});
