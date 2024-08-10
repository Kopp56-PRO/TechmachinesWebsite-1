const messages = [
    "Better",
    "Faster",
    "Smarter",
    "More Reliable",
    "Top Quality"
];

function updateText() {
    const textElement = document.getElementById('updatingText');
    const randomIndex = Math.floor(Math.random() * messages.length);
    textElement.textContent = messages[randomIndex];
}

setInterval(updateText, 5000); // Update every 5 seconds
