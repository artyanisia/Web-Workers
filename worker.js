   
self.addEventListener('message', function(e) {
  const [firstValue, secondValue] = e.data;
  const result = parseFloat(firstValue) + parseFloat(secondValue);
  self.postMessage(result);
});
