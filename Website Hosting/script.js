document.addEventListener('DOMContentLoaded', () => {
    const session = JSON.parse(localStorage.getItem('session'));

    const usernameElement = document.getElementById('username');
    const signInButton = document.getElementById('sign-in-button');
    const settingsLink = document.getElementById('settings-link');
    const contentSection = document.querySelector('.content');

    // Check if the session exists and has the username property
    if (session && session.username) {
        usernameElement.textContent = session.username;
        signInButton.style.display = 'none';
        settingsLink.style.display = 'block';
    } else {
        // Show "Log in First" message and hide the main content
        contentSection.innerHTML = `
            <div class="login-first-message">
                <h2>Please Log In First</h2>
                <p>You need to be logged in to access this content.</p>
                <button onclick="location.href='../Login/index.html'" class="btn btn-primary">Log In</button>
            </div>
        `;
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
