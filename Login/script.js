document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Show loading text
    const loadingText = document.createElement('p');
    loadingText.id = 'loading-text';
    loadingText.innerText = 'Processing, please wait...';
    document.getElementById('login-form').appendChild(loadingText);

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // First fetch: Check credentials with primary server
        const loginResponse = await fetch('http://localhost:4000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (loginResponse.ok) {
            // Wait for 5 seconds
            await new Promise(resolve => setTimeout(resolve, 5000));

            // Fetch username from the username server
            const usernameResponse = await fetch('http://localhost:4002/get-username', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            if (usernameResponse.ok) {
                const data = await usernameResponse.json();
                // Save session info including username
                localStorage.setItem('session', JSON.stringify({
                    email: email,
                    username: data.username
                }));
                // Redirect to homepage
                window.location.href = '../homepage.html';
            } else {
                document.getElementById('error-message').innerText = 'Error retrieving username';
            }
        } else {
            document.getElementById('error-message').innerText = 'Invalid email or password';
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Remove loading text
        const loadingText = document.getElementById('loading-text');
        if (loadingText) {
            loadingText.remove();
        }
    }
});
