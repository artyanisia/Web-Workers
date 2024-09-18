


self.onmessage = function (event) {

  const { url, page, pageSize } = event.data;


  fetch(url)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json(); //returns a promise for the next .then
      })
      .then(data => {
        self.postMessage({ type: 'success', data: data.products });
    })
    .catch(error => {
        self.postMessage({ type: 'error', message: error.message });
    });
    
}