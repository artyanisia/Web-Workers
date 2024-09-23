const EXPIRY_TIME = 1000 * 60 * 5;

const worker = new Worker("fetchWorker.js");

function fetchDataWithExpiry(url, pageSize) {
    const now = new Date();
    const storedData = JSON.parse(sessionStorage.getItem("currentPageData"));
    
    // Check if stored data exists and is still valid
    if (storedData && (now.getTime() < storedData.expiry)) {
        // Data is still valid, use it
        createTable(storedData.value, tableContainer, output);
        console.log("Using cached data");
    } else {
        // Data is expired or doesn't exist, send message to worker to fetch new data
        worker.postMessage({ type: "refetchAllPages", url, pageSize });
    }
}

worker.onmessage = function(event) {

    const { type, data } = event.data;

    if(type === "allDataFetched"){

        const now = new Date();
        const expiryTime = now.getTime() + EXPIRY_TIME;

        sessionStorage.setItem("currentPageData", JSON.stringify({ value: data.currentData, expiry: expiryTime}));
        sessionStorage.setItem("previousPageData", JSON.stringify({ value: data.previousData, expiry: expiryTime}));
        sessionStorage.setItem("nextPageData", JSON.stringify({ value: data.nextData, expiry: expiryTime}));

        createTable(data.currentData, tableContainer, output);
        console.warn("Updated table with new current data");
    }
    else if ( type === "error"){
        console.error("Error fetching data: ", data.message);
    }
}