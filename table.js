

export function createTable(data, tableContainer, output) {

    tableContainer.innerHTML = ''; 
    output.innerHTML = '';

    if (typeof data === 'object' && data !== null) {
        if (Array.isArray(data.products) && data.products.length > 0) {
            data = data.products; // Use the products array for table creation
        } else {
            output.textContent = 'No products available.';
            return;
        }
    } else if (!Array.isArray(data) || data.length === 0) {
        output.textContent = 'No data available.';
        return;
    }

    // Check the format of the first item in the array
    if (typeof data[0] !== 'object' || data[0] === null) {
        output.textContent = 'Data format is incorrect.';
        return;
    }

    let table = document.createElement('table');
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');
    table.appendChild(thead);
    table.appendChild(tbody);

    let headers = [ 'id', 'title', 'description', 'price', 'returnPolicy' ];

    let headerRow = document.createElement('tr');  //creates (table row) element 
    headers.forEach(header => {
        let th = document.createElement('th');  //creates table header cell
        th.textContent = header;
        headerRow.appendChild(th);  //Appends the created <th> element (the header cell) to the <tr>
    });
    thead.appendChild(headerRow); //appends to thead

    data.forEach(item => {
        let row = document.createElement('tr');  //creates row
        headers.forEach(header => {
            let cell = document.createElement('td'); //table data cell
            cell.textContent = item[header] || '';
            row.appendChild(cell);  //append cell to row
        });
        tbody.appendChild(row); //append row to tbody
    });

    tableContainer.appendChild(table); //the entire table element (thead and tbody) appenede to the tableContianer making it visible
}
