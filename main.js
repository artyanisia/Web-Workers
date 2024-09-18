import { fetchDataForPage, updateButtons } from "./pagination.js";
import { createTableFromSessionStorage } from "./sessionStorage.js";

let worker;

const dropdownButton = document.querySelector('.dropbtn');
const dropdownContent = document.getElementById('myDropdown');
const dropdownItems = dropdownContent.querySelectorAll('a');
//trebuie sa am pageSize cu input
// sa fac ca worker-ul sa tina minte previous si nextpage
//pagina sa aiba timp de expirare

export function fetchData(page, tableConatiner, output, pageSize){

    const url = `https://dummyjson.com/products?skip=${page}&limit=${pageSize}`;

    if(worker){
        worker.terminate(); //i have to terminate the worker before creating a new one
    }

    worker = new Worker('worker.js');

    worker.onmessage = function(event) {
        const { type, data, message } = event.data; //data from the worker
        
        if(type === 'success') {

            sessionStorage.setItem('productsData', JSON.stringify(data));
            createTableFromSessionStorage(tableContainer,output);
            updateButtons(data.length === pageSize);

        } else if(type === 'error'){
            console.error('Error fetching data:', message);
            tableConatiner.textContent = `Error: ${message}`;
        }
    };

    worker.postMessage({ url, page, pageSize});
}

//automatically fetch first page when loaded
document.addEventListener('DOMContentLoaded', function() {
    dropdownButton.addEventListener('click', () => {
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
    });

    window.addEventListener('click', (event) => {
        if (!event.target.matches('.dropbtn')) {
            if (dropdownContent.style.display === 'block') {
                dropdownContent.style.display = 'none';
            }
        }
    });
    dropdownItems.forEach(item => {
        item.addEventListener('click', (event) => {
            const selectedValue = Number(event.target.textContent); // Get the text content of the clicked item
            fetchDataForPage(1, selectedValue);
        });
    });
});