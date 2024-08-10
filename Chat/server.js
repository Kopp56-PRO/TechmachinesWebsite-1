const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Import cors
const app = express();
const port = 3000;

// Paths for storage files
const ticketsFilePath = path.join(__dirname, 'tickets.json');
const accountsFilePath = path.join(__dirname, 'Login', 'accounts.json');

// Use cors middleware
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware for serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for user authentication
const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        // Simulate token validation and user extraction
        req.user = { email: 'test@gmail.com', admin: true }; // Replace with actual token logic
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

// Get all tickets
app.get('/tickets', authenticate, (req, res) => {
    fs.readFile(ticketsFilePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ message: 'Error reading tickets file' });
        } else {
            const tickets = JSON.parse(data);
            const user = req.user;
            const accessibleTickets = {};

            // Filter tickets based on user permissions
            for (const [ticketId, ticket] of Object.entries(tickets)) {
                if (ticket.creator === user.email || user.admin) {
                    accessibleTickets[ticketId] = ticket;
                }
            }

            res.json(accessibleTickets);
        }
    });
});

// Get a specific ticket
app.get('/tickets/:ticketId', authenticate, (req, res) => {
    const { ticketId } = req.params;

    fs.readFile(ticketsFilePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ message: 'Error reading tickets file' });
        } else {
            const tickets = JSON.parse(data);

            if (tickets[ticketId]) {
                const user = req.user;
                // Check if the user can view this ticket
                if (tickets[ticketId].creator === user.email || user.admin) {
                    res.json(tickets[ticketId]);
                } else {
                    res.status(403).json({ message: 'Forbidden' });
                }
            } else {
                res.status(404).json({ message: 'Ticket not found' });
            }
        }
    });
});

// Create a new ticket with the first available ID
app.post('/tickets', authenticate, (req, res) => {
    const { creator, description } = req.body;

    fs.readFile(ticketsFilePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ message: 'Error reading tickets file' });
        } else {
            const tickets = JSON.parse(data);
            let ticketId = 1;

            // Find the first available ID
            while (tickets[ticketId] && ticketId <= 20) {
                ticketId++;
            }

            if (ticketId > 20) {
                res.status(400).json({ message: 'All ticket spaces are in use! Please try again later.' });
                return;
            }

            tickets[ticketId] = {
                creator,
                description,
                messages: []
            };

            fs.writeFile(ticketsFilePath, JSON.stringify(tickets), 'utf8', (err) => {
                if (err) {
                    res.status(500).json({ message: 'Error creating ticket' });
                } else {
                    res.status(201).json({ ticketId });
                }
            });
        }
    });
});

// Add a message to a ticket
app.post('/tickets/:ticketId/messages', authenticate, (req, res) => {
    const { ticketId } = req.params;
    const { sender, text } = req.body;

    fs.readFile(ticketsFilePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ message: 'Error reading tickets file' });
        } else {
            const tickets = JSON.parse(data);

            if (tickets[ticketId]) {
                tickets[ticketId].messages.push({ sender, text });

                fs.writeFile(ticketsFilePath, JSON.stringify(tickets), 'utf8', (err) => {
                    if (err) {
                        res.status(500).json({ message: 'Error adding message' });
                    } else {
                        res.status(200).json({ message: 'Message added' });
                    }
                });
            } else {
                res.status(404).json({ message: 'Ticket not found' });
            }
        }
    });
});

// Delete a ticket
app.delete('/tickets/:ticketId', authenticate, (req, res) => {
    const { ticketId } = req.params;

    fs.readFile(ticketsFilePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ message: 'Error reading tickets file' });
        } else {
            let tickets = JSON.parse(data);

            if (tickets[ticketId]) {
                const user = req.user;
                // Check if the user is authorized to delete this ticket
                if (tickets[ticketId].creator === user.email || user.admin) {
                    delete tickets[ticketId];
                    fs.writeFile(ticketsFilePath, JSON.stringify(tickets), 'utf8', (err) => {
                        if (err) {
                            res.status(500).json({ message: 'Error deleting ticket' });
                        } else {
                            // Notify users about ticket deletion
                            res.json({ message: 'Ticket deleted' });
                            // Send notifications to users (if necessary)
                        }
                    });
                } else {
                    res.status(403).json({ message: 'Forbidden' });
                }
            } else {
                res.status(404).json({ message: 'Ticket not found' });
            }
        }
    });
});

// Serve the ticket does not exist page
app.get('/ticket-not-found', (req, res) => {
    res.send('<h1>Ticket Does Not Exist</h1><p>The ticket may be deleted</p>');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
