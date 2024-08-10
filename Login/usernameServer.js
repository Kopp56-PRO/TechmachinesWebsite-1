const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 4002;

app.use(cors());
app.use(express.json());

const accountsFile = path.join(__dirname, 'AccountData', 'accounts.json');

// Helper functions to get and save accounts
function getAccounts() {
    try {
        const data = fs.readFileSync(accountsFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading accounts.json:', error);
        return [];
    }
}

function saveAccounts(accounts) {
    try {
        fs.writeFileSync(accountsFile, JSON.stringify(accounts, null, 2));
    } catch (error) {
        console.error('Error writing to accounts.json:', error);
    }
}

app.post('/get-username', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const accounts = getAccounts();
    const account = accounts.find(acc => acc.email === email);

    if (!account) {
        return res.status(404).json({ error: 'Account not found' });
    }

    res.status(200).json({ username: account.username });
});

app.listen(port, () => {
    console.log(`Username server running on port ${port}`);
});
