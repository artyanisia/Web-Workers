self.onmessage = async function (event) {

  const { type, url, page, pageSize , direction } = event.data;

  if (isNaN(page)) {
    throw new Error("cannot load non number pages");
  }

    if(type === "initialLoad"){
        const currentPageUrl = `${url}?skip=${(page-1)*pageSize}&limit=${pageSize}`;
        const nextPageUrl = `${url}?skip=${page*pageSize}&limit=${pageSize}`;
        try {
            // Fetch current page data first
            const currentPageResponse = await fetch(currentPageUrl);
            const currentPageData = await currentPageResponse.json();
      
            // Fetch next page data
            const nextPageResponse = await fetch(nextPageUrl);
            const nextPageData = await nextPageResponse.json();
            
        
            self.postMessage({
              type: "initialLoadData",
              data: { currentPageData, nextPageData },
              pageSize,
              pageNumber: page,
            });
          } catch (error) {
           
            self.postMessage({
              type: "error",
              message: error.message,
            });
          }

    } else if(type === "navigate"){
        
        let targetPageUrl;

        if(direction === "prev"){
            targetPageUrl = `${url}?limit=${pageSize}&skip=${(page-2) * pageSize}`;
        }
        else {
            targetPageUrl = `${url}?limit=${pageSize}&skip=${page * pageSize}`;
        }

        try {
     
        const pageResponse = await fetch(targetPageUrl);
        const pageData = await pageResponse.json();

       
        self.postMessage({
            type: "navigationData",
            data: { pageData },
            pageSize,
            pageNumber: page,
            direction,
        });
        } catch (error) {
        // Handle any error
        self.postMessage({
            type: "error",
            message: error.message,
        });
        }
    }
};
