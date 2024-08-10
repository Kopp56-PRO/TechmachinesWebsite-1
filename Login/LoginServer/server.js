const express = require('express');
const path = require('path');

const app = express();
const port = 4000; // You can choose any available port number

// Serve static files from the Login directory
app.use(express.static(path.join(__dirname, '../Login')));

// Serve the main login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(port, '192.168.1.9', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
});
