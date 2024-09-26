document.addEventListener("DOMContentLoaded", function() {

    const messageInput = document.getElementById("messageInput");
    const receivedMessageDiv = document.getElementById("receivedMessage");
    const sendButton = document.getElementById("sendMessage");
    const closeConnectionButton = document.getElementById("closeConnection");
    const openConnectionButton = document.getElementById("openConnection");
    
    let intervalId; 
    let number = 1;

    function openConnection(){
        
        openConnectionButton.disabled=true;

        const socket = new WebSocket("https://echo.websocket.org/")

        socket.onopen = function() {
            console.log('Connected to WebSocket Server');

            intervalId = setInterval(() => {
                const autoMessage = "Automated message " + number;
                number++;
                socket.send(autoMessage);
                console.log("Auto-sent: ", autoMessage);
            }, 3000);  
        };

        socket.onmessage = function(event) {
            receivedMessageDiv.textContent = event.data;
        }

        socket.onerror = function(error) {
            console.error('WebSocket error: ', error);
        };

        socket.onclose = function(event) {
            console.log('Disconnected from WebSocket server');
            receivedMessageDiv.textContent = 'Connection closed';

            clearInterval(intervalId);
        }
        function sendMessage(){
            const message = messageInput.value;
            console.warn("message", message)
            if (message) { 
                const sanitizedMessage = String(message).trim();
                socket.send(sanitizedMessage);  
                messageInput.value = '';  
            } else {
                console.error('Message is empty, cannot send');
            }
        }
        
        function closeConnection() {
            socket.close();  
            console.warn("closed connection");
    
            clearInterval(intervalId);
        }

        sendButton.addEventListener('click', sendMessage);
        closeConnectionButton.addEventListener('click', closeConnection);
    }

    openConnectionButton.addEventListener('click', openConnection);
})
