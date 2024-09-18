import { fetchData } from './main.js';


const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const pageInfo = document.getElementById('pageInfo');
const tableContainer = document.getElementById('tableContainer');
const output = document.getElementById('output');

let itemNumber;
let currentPage = 1;

function updatePageInfo(page) {
    pageInfo.textContent = `Page ${page}`;
}


function updateButtons(hasMorePages) {
    prevPageBtn.disabled = (currentPage === 1); 
    nextPageBtn.disabled = !hasMorePages; 
}


function fetchDataForPage(page, pageSize) {
    currentPage=page;
    itemNumber=pageSize;
    updatePageInfo(page);
    const skip = (currentPage-1) * pageSize;
    fetchData(skip, tableContainer, output, pageSize);
}


prevPageBtn.addEventListener('click', function () {
    if (currentPage > 1) {
        fetchDataForPage(currentPage - 1, itemNumber); 
    }
});

nextPageBtn.addEventListener('click', function () {
    fetchDataForPage(currentPage + 1, itemNumber); 
});

export { fetchDataForPage, updateButtons };