const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 4001; // Different port for settings server

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Define paths
const accountDataPath = path.join(__dirname, '..', 'login', 'AccountData');

// Test connectivity endpoint
app.get('/test-connection', (req, res) => {
    res.status(200).send('OK');
});

// Change password endpoint
app.post('/change-password', (req, res) => {
    const { newPassword } = req.body;
    fs.readFile(path.join(accountDataPath, 'accounts.json'), (err, data) => {
        if (err) return res.status(500).json({ success: false, message: 'Server error' });
        const accounts = JSON.parse(data);
        const email = req.headers['email']; // Example, you'll need actual user identification
        const user = accounts.find(acc => acc.email === email);
        if (user) {
            user.password = newPassword;
            fs.writeFile(path.join(accountDataPath, 'accounts.json'), JSON.stringify(accounts), (err) => {
                if (err) return res.status(500).json({ success: false, message: 'Server error' });
                res.json({ success: true });
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    });
});

// Delete account endpoint
app.post('/delete-account', (req, res) => {
    const { email } = req.body;
    fs.readFile(path.join(accountDataPath, 'accounts.json'), (err, data) => {
        if (err) return res.status(500).json({ success: false, message: 'Server error' });
        let accounts = JSON.parse(data);
        const accountIndex = accounts.findIndex(acc => acc.email === email);
        if (accountIndex !== -1) {
            accounts.splice(accountIndex, 1);
            fs.writeFile(path.join(accountDataPath, 'accounts.json'), JSON.stringify(accounts), (err) => {
                if (err) return res.status(500).json({ success: false, message: 'Server error' });
                res.json({ success: true });
            });
        } else {
            res.status(404).json({ success: false, message: 'Account not found' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Settings server is running on http://localhost:${PORT}`);
});
