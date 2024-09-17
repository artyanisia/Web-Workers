// pagination.js

document.addEventListener('DOMContentLoaded', () => {
    const pageSize = 10;
    let currentPage = 1;

    const tableContainer = document.getElementById('table-container');
    const pageInfo = document.getElementById('page-info');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    function fetchData(page) {
        const url = "https://dummyjson.com/RESOURCE/?limit=${pageSize}&skip=${(page - 1) * pageSize}&select=key1,key2,key3";

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text(); // Get response as text
            })
            .then(text => {
                console.log('Raw response text:', text); // Log raw response
                if (text.trim() === '') {
                    throw new Error('No content received');
                }
                return JSON.parse(text); // Parse text as JSON
            })
            .then(data => {
                createTable(data);
                pageInfo.textContent = `Page ${page}`;
                updateButtons(data.length === pageSize);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                tableContainer.textContent = `Error: ${error.message}`;
            });
    }

    function createTable(data) {
        tableContainer.innerHTML = ''; // Clear previous table
        output.innerHTML = '';

        if (!Array.isArray(data) || data.length === 0) {
            output.textContent = 'No data available.';
            return;
        }
        
        if (typeof data[0] !== 'object' || data[0] === null) {
            output.textContent = 'Data format is incorrect.';
            return;
        }

        let table = document.createElement('table');
        let thead = document.createElement('thead');
        let tbody = document.createElement('tbody');
        table.appendChild(thead);
        table.appendChild(tbody);

        // Assuming data is an array of objects with keys key1, key2, key3
        let headers = Object.keys(data[0]);

        // Create table headers
        let headerRow = document.createElement('tr');
        headers.forEach(header => {
            let th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        // Create table rows
        data.forEach(item => {
            let row = document.createElement('tr');
            headers.forEach(header => {
                let cell = document.createElement('td');
                cell.textContent = item[header] || '';
                row.appendChild(cell);
            });
            tbody.appendChild(row);
        });

        tableContainer.appendChild(table);
    }

    function updateButtons(hasMoreData) {
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = !hasMoreData;
    }

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchData(currentPage);
        }
    });

    nextBtn.addEventListener('click', () => {
        currentPage++;
        fetchData(currentPage);
    });

    // Initial data fetch
    fetchData(currentPage);
});
