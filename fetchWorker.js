self.onmessage = function (event) {
  console.warn("message fetchWorker", event);

  const { type, url, page, pageSize } = event.data;
  // console.log('Received message:', event.data);

  if (isNaN(page)) {
    throw new Error("cannot load non number pages");
  }

  function fetchPage(pageNumber) {
    const pageOffset = pageNumber * pageSize;
    const fetchUrl = `${url}?skip=${pageOffset}&limit=${pageSize}`;
    // console.log(`Fetching URL: ${fetchUrl}`);

    return fetch(fetchUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        //console.log(`Data fetched for page ${pageNumber}:`, data);
        return { pageNumber, products: data.products };
      })
      .catch((error) => {
        console.error(`Error fetching page ${pageNumber}:`, error.message);
        return { pageNumber, error: error.message };
      });
  }

  const pagesToFetch = [page + 1];

  console.warn("Pages to fetch:", page, pagesToFetch);

  // const results = {};

  pagesToFetch.forEach((pageNumber) => {
    //console.log(`Fetching page ${pageNumber}`);
    fetchPage(pageNumber)
      .then((result) => {
        //console.log(`Result for page ${pageNumber}:`, result);
        // if (result.error) {
        //   results[`page${result.pageNumber}`] = { error: result.error };
        // } else {
        //   results[`page${result.pageNumber}`] = result.products;
        // }

        //console.log('All pages fetched:', results);
        self.postMessage({
          type: "pagesData",
          data: result,
          pageSize,
          pageNumber,
        });
      })
      .catch((error) => {
        console.error("Error fetching page:", error);

        self.postMessage({
          type: "pagesData",
          data: results,
          pageSize,
          pageNumber,
        });
        //console.log('Results to be posted:', results);
      });
  });
};
