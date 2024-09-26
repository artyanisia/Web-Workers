self.onmessage = async function (event) {
    
    const { type, url, page, pageSize } = event.data;
    
    //console.warn("Expiry worker recieved message")

    if(type === "initalRefetch"){
            try{  
                const currentPageUrl = `${url}?limit=${pageSize}&skip=${(page - 1) * pageSize}`;
                const nextPageUrl  = `${url}?limit=${pageSize}&skip=${(page) * pageSize}`;

                const [currentResponse, nextResponse] = await Promise.all([
                    fetch(currentPageUrl),
                    fetch(nextPageUrl),
                ]);
                const currentData = await currentResponse.json();
                const nextData = await nextResponse.json();
                self.postMessage({
                    type: "allDataFetched",
                    data:{
                        currentData,
                        nextData,
                    },
                });
            } catch (error) {
                self.postMessage({
                    type: "error",
                    message: error.message,
                });
            }
    } else if(type === "refetch") {
            try{
                const currentPageUrl = `${url}?limit=${pageSize}&skip=${(page - 1) * pageSize}`;
                const previousPageUrl  = `${url}?limit=${pageSize}&skip=${(page - 2) * pageSize}`;
                const nextPageUrl  = `${url}?limit=${pageSize}&skip=${(page) * pageSize}`;

                const [currentResponse, previousResponse, nextResponse] = await Promise.all([
                    fetch(currentPageUrl),
                    fetch(previousPageUrl),
                    fetch(nextPageUrl),
                ]);

                const currentData = await currentResponse.json();
                const previousData = await previousResponse.json();
                const nextData = await nextResponse.json();

                self.postMessage({
                    type: "allDataFetched",
                    data:{
                        currentData,
                        previousData,
                        nextData,
                    },
                });
            }catch (error) {
                self.postMessage({
                    type: "error",
                    message: error.message,
                });
            }
        }
    }
