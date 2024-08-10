const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 4000;
const accountsFilePath = path.join(__dirname, 'AccountData', 'accounts.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to handle login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    fs.readFile(accountsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading accounts.json:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        let accounts;
        try {
            accounts = JSON.parse(data);
        } catch (jsonErr) {
            console.error('Error parsing JSON:', jsonErr);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        const user = accounts.find(acc => acc.email === email && acc.password === password);

        if (user) {
            res.json({ success: true });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    });
});

// Endpoint to handle account creation
app.post('/create-account', (req, res) => {
    const { fullName, username, email, password } = req.body;

    fs.readFile(accountsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading accounts.json:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        let accounts;
        try {
            accounts = JSON.parse(data);
        } catch (jsonErr) {
            console.error('Error parsing JSON:', jsonErr);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        // Check if email already exists
        const existingUser = accounts.find(acc => acc.email === email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        // Add new account
        const newAccount = { fullName, username, email, password };
        accounts.push(newAccount);

        fs.writeFile(accountsFilePath, JSON.stringify(accounts), (err) => {
            if (err) {
                console.error('Error writing to accounts.json:', err);
                return res.status(500).json({ success: false, message: 'Server error' });
            }
            res.json({ success: true });
        });
    });
});

// Endpoint to handle password change
app.post('/change-password', (req, res) => {
    const { currentPassword, newPassword } = req.body;

    fs.readFile(accountsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading accounts.json:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        let accounts;
        try {
            accounts = JSON.parse(data);
        } catch (jsonErr) {
            console.error('Error parsing JSON:', jsonErr);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        const user = accounts.find(acc => acc.password === currentPassword);
        if (user) {
            user.password = newPassword;
            fs.writeFile(accountsFilePath, JSON.stringify(accounts), (err) => {
                if (err) {
                    console.error('Error writing to accounts.json:', err);
                    return res.status(500).json({ success: false, message: 'Server error' });
                }
                res.json({ success: true });
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid current password' });
        }
    });
});

// Endpoint to handle account deletion
app.post('/delete-account', (req, res) => {
    const { email } = req.body;

    fs.readFile(accountsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading accounts.json:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        let accounts;
        try {
            accounts = JSON.parse(data);
        } catch (jsonErr) {
            console.error('Error parsing JSON:', jsonErr);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        // Find index of the account with the provided email
        const index = accounts.findIndex(acc => acc.email === email);

        if (index === -1) {
            return res.status(404).json({ success: false, message: 'Account not found' });
        }

        // Remove the account from the array
        accounts.splice(index, 1);

        // Write the updated accounts array back to the file
        fs.writeFile(accountsFilePath, JSON.stringify(accounts), (err) => {
            if (err) {
                console.error('Error writing to accounts.json:', err);
                return res.status(500).json({ success: false, message: 'Server error' });
            }
            res.json({ success: true, message: 'Account deleted successfully' });
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
