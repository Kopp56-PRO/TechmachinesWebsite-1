document.getElementById('create-account-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;

    // Display loading message
    document.getElementById('message').textContent = 'Creating account...';

    try {
        const response = await fetch('../api/create-account', { // Update the URL if necessary
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, username })
        });

        if (response.ok) {
            window.location.href = 'loggedin.html'; // Redirect to account created page
        } else {
            document.getElementById('message').textContent = 'Failed to create account. Please try again.';
        }
    } catch (error) {
        document.getElementById('message').textContent = 'An error occurred. Please try again later.';
    }
});
