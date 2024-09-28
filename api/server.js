import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Calculate __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Open SQLite database
let db;
const openDb = async () => {
    if (!db) {
        db = await open({
            filename: path.join(__dirname, '../AccountData', 'accounts.db'),
            driver: sqlite3.Database,
        });

        await db.exec(`
            CREATE TABLE IF NOT EXISTS accounts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            );
        `);
    }
};

// The main handler for Vercel
export default async function handler(req, res) {
    await openDb();

    switch (req.method) {
        case 'POST':
            if (req.url.endsWith('/login')) {
                const { email, password } = req.body;
                if (!email || !password) {
                    return res.status(400).json({ success: false, message: 'Email and password are required' });
                }

                const user = await db.get('SELECT * FROM accounts WHERE email = ? AND password = ?', [email, password]);
                if (user) {
                    res.json({ success: true });
                } else {
                    res.status(401).json({ success: false, message: 'Invalid email or password' });
                }
            } else if (req.url.endsWith('/create-account')) {
                const { username, email, password } = req.body;
                if (!username || !email || !password) {
                    return res.status(400).json({ success: false, message: 'All fields are required' });
                }

                const existingUser = await db.get('SELECT * FROM accounts WHERE email = ?', [email]);
                if (existingUser) {
                    return res.status(400).json({ success: false, message: 'Email already exists' });
                }

                await db.run('INSERT INTO accounts (username, email, password) VALUES (?, ?, ?)', [username, email, password]);
                res.json({ success: true });
            } else if (req.url.endsWith('/change-password')) {
                const { email, currentPassword, newPassword } = req.body;
                if (!email || !currentPassword || !newPassword) {
                    return res.status(400).json({ success: false, message: 'All fields are required' });
                }

                const user = await db.get('SELECT * FROM accounts WHERE email = ? AND password = ?', [email, currentPassword]);
                if (user) {
                    await db.run('UPDATE accounts SET password = ? WHERE email = ?', [newPassword, email]);
                    res.json({ success: true });
                } else {
                    res.status(401).json({ success: false, message: 'Invalid current password' });
                }
            } else if (req.url.endsWith('/delete-account')) {
                const { email } = req.body;
                if (!email) {
                    return res.status(400).json({ success: false, message: 'Email is required' });
                }

                const result = await db.run('DELETE FROM accounts WHERE email = ?', [email]);
                if (result.changes > 0) {
                    res.json({ success: true, message: 'Account deleted successfully' });
                } else {
                    res.status(404).json({ success: false, message: 'Account not found' });
                }
            } else if (req.url.endsWith('/get-username')) {
                const { email } = req.body;
                if (!email) {
                    return res.status(400).json({ error: 'Email is required' });
                }

                const account = await db.get('SELECT username FROM accounts WHERE email = ?', [email]);
                if (!account) {
                    return res.status(404).json({ error: 'Account not found' });
                }

                res.status(200).json({ username: account.username });
            } else {
                res.status(404).json({ error: 'Endpoint not found' });
            }
            break;

        default:
            res.setHeader('Allow', ['POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
