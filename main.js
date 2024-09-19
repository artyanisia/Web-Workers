import { fetchDataForPage, updateButtons } from "./pagination.js";
import { createTableFromSessionStorage } from "./sessionStorage.js";
import { createTable } from "./table.js";

let worker;
let page;

const dropdownButton = document.querySelector('.dropbtn');
const dropdownContent = document.getElementById('myDropdown');
const dropdownItems = dropdownContent.querySelectorAll('a');

// sa fac ca worker-ul sa tina minte previous si nextpage
//pagina sa aiba timp de expirare

export function fetchData(page, tableContainer, output, pageSize, pageNumber){

    const url = `https://dummyjson.com/products`;

    if(worker){
        worker.terminate(); //i have to terminate the worker before creating a new one
    }

    worker = new Worker('fetchWorker.js');

    worker.onmessage = function(event) {
        const { type, data, pageSize  } = event.data; //data from the worker
        
        //console.log('Worker message received:', event.data)

        if(type === 'pagesData') {
                
            let pageKey = `page${pageNumber}`;

            const currentPageData = data[pageKey] || {};
            // console.log("CUrrent page data", data[`page${currentPage}`] );
            // console.log('Current page data:', currentPageData);
            pageKey = `page${pageNumber-1}`;
            const previousPageData = data[pageKey] || {};;
            pageKey = `page${pageNumber+1}`;
            const nextPageData = data[pageKey] || {};;

            // console.log('Available data keys:', Object.keys(data));

            sessionStorage.setItem('currentPageData', JSON.stringify(currentPageData));
            sessionStorage.setItem('previousPageData', JSON.stringify(previousPageData));
            sessionStorage.setItem('nextPageData', JSON.stringify(nextPageData));
            
            if (currentPageData.error) {
                tableContainer.textContent = `Error loading current page data: ${currentPageData.error}`;
            } else {
                createTableFromSessionStorage( tableContainer, output);
            }

            const hasNextPage = nextPageData && nextPageData.length === pageSize;
            updateButtons(hasNextPage);

        } else if(type === 'error'){
            console.error('Error fetching data:', data.message);
        }
    };
    const currentPage = 0;
    worker.postMessage({ url, page: currentPage, pageSize});
   
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
    window.onload = function() {
        sessionStorage.clear();
    };
});