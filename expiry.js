
const expiryWorker = new Worker ("expiryWorker.js");

export function startExpiryTimer(intervalTime, page) {
    const pageSize = Number(sessionStorage.getItem("PageSize"));
    
    let type;
    if( page === 1){
        type = "initialRefetch";
    } 
    else{
        type = 'refetch';
    }
    console.warn("Expiry timer starter", type)
    setInterval(() => {
        expiryWorker.postMessage({
          type: type,
          page: page,
          url: "https://dummyjson.com/products",
          pageSize: pageSize,
        });
      }, intervalTime);

    expiryWorker.onmessage = function(event) {

        const { type, data } = event.data;

        if(type === "allDataFetched"){
            console.warn("Refectched data:", data);
        }
        else if ( type === "error"){
            console.error("Error fetching data: ", data.message);
        }
    }
}
