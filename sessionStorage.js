import { createTable } from './table.js';

export function createTableFromSessionStorage(tableContainer, output) {

    // Retrieve data from session storage
    const data = JSON.parse(sessionStorage.getItem('currentPageData'));

    if (!data || data.length === 0) {
        output.textContent = 'No data available.';
        return;
    }

    createTable(data, tableContainer, output);
}