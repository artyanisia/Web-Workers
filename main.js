document.addEventListener('DOMContentLoaded', () => {
    
    const myWorker = new Worker("worker.js");

    const first = document.getElementById('first');
    const second = document.getElementById('second');
    const result = document.getElementById('result');

    if (window.Worker) {
        second.addEventListener('change', () => {
            myWorker.postMessage([first.value, second.value]); // Sends message
            console.log("Message posted to worker");
        });

        myWorker.addEventListener('message', (e) => {
            result.textContent = `Result: ${e.data}`;
            console.log("Message received from worker");
        });

        myWorker.addEventListener('error', (e) => {
            console.error('Error in worker:', e.message);
        });
    } else {
        console.error("Web Workers are not supported in this browser.");
    }
});