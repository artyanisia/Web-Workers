self.onmessage = function (event) {

    const { type, url,  page, pageSize } = event.data;
   // console.log('Received message:', event.data);

    function fetchPage(pageNumber) {
        const pageOffset = (pageNumber) * pageSize;
        const fetchUrl = `${url}?skip=${pageOffset}&limit=${pageSize}`;
        // console.log(`Fetching URL: ${fetchUrl}`);

        return fetch(fetchUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                //console.log(`Data fetched for page ${pageNumber}:`, data);
                return { pageNumber, products: data.products };
            })
            .catch(error => {
                console.error(`Error fetching page ${pageNumber}:`, error.message);
                return { pageNumber, error: error.message };
            });
    }

    const pagesToFetch = [
        page,
        page > 1 ? page - 1 : null,
        page + 1
    ].filter(p => p !== null); //filters null pages
    
    //console.log('Pages to fetch:', pagesToFetch);

    const results = {};
    let pending = pagesToFetch.length;

    if (pending === 0) {
        self.postMessage({ type: 'pagesData', data: results, pageSize });
        //console.log('Results to be posted:', results);
        return;
    }

    pagesToFetch.forEach(pageNumber => {
        //console.log(`Fetching page ${pageNumber}`);
        fetchPage(pageNumber)
            .then(result => {
                //console.log(`Result for page ${pageNumber}:`, result);
                if (result.error) {
                    results[`page${result.pageNumber}`] = { error: result.error };
                } else {
                    results[`page${result.pageNumber}`] = result.products;
                }

                pending--;
                if (pending === 0) {
                    //console.log('All pages fetched:', results);
                    self.postMessage({ type: 'pagesData', data: results, pageSize });
                }
            })
            .catch(error => {
                console.error('Error fetching page:', error);
                pending--; // Ensure pending count is adjusted
                if (pending === 0) {
                    self.postMessage({ type: 'pagesData', data: results, pageSize });
                    //console.log('Results to be posted:', results);
                }
            });
    });
}