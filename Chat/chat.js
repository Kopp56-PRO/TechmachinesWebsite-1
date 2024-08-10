document.addEventListener('DOMContentLoaded', () => {
    const messageContainer = document.getElementById('messageContainer');
    const ticketList = document.getElementById('ticketList');
    const ticketId = new URLSearchParams(window.location.search).get('ticket');

    if (ticketId) {
        fetch(`/tickets/${ticketId}`, {
            headers: {
                'Authorization': 'Bearer YOUR_TOKEN' // Replace with actual token logic
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.messages) {
                data.messages.forEach(message => {
                    const messageElement = document.createElement('div');
                    messageElement.classList.add('message', message.sender === 'Test User' ? 'user' : '');
                    messageElement.textContent = message.text;
                    messageContainer.appendChild(messageElement);
                });
            }
        })
        .catch(error => console.error('Error fetching ticket messages:', error));
    }

    function sendMessage() {
        const messageInput = document.getElementById('messageInput');

        if (messageInput.value.trim() !== "") {
            fetch(`/tickets/${ticketId}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer YOUR_TOKEN' // Replace with actual token logic
                },
                body: JSON.stringify({
                    sender: 'Test User',
                    text: messageInput.value
                })
            })
            .then(response => response.json())
            .then(() => {
                const newMessage = document.createElement('div');
                newMessage.classList.add('message', 'user');
                newMessage.textContent = messageInput.value;
                messageContainer.appendChild(newMessage);
                messageContainer.scrollTop = messageContainer.scrollHeight;
                messageInput.value = "";
            })
            .catch(error => console.error('Error sending message:', error));
        }
    }

    function deleteTicket() {
        fetch(`/tickets/${ticketId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer YOUR_TOKEN' // Replace with actual token logic
            }
        })
        .then(response => {
            if (response.ok) {
                alert('Ticket deleted');
                window.location.href = 'ticket-deleted.html'; // Redirect to ticket deleted page
            } else {
                alert('Error deleting ticket');
            }
        })
        .catch(error => console.error('Error deleting ticket:', error));
    }

    document.getElementById('messageInput').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    // Fetch and display all tickets in the sidebar
    fetch('/tickets', {
        headers: {
            'Authorization': 'Bearer YOUR_TOKEN' // Replace with actual token logic
        }
    })
    .then(response => response.json())
    .then(tickets => {
        Object.keys(tickets).forEach(id => {
            const ticketLink = document.createElement('a');
            ticketLink.href = `chat.html?ticket=${id}`;
            ticketLink.textContent = `Ticket ${id}`;
            ticketList.appendChild(ticketLink);
        });
    })
    .catch(error => console.error('Error fetching tickets:', error));
});
