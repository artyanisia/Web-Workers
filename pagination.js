import { createTable } from "./table.js";
import { startExpiryTimer } from "./expiry.js";

const prevPageBtn = document.getElementById("prevPageBtn");
const nextPageBtn = document.getElementById("nextPageBtn");
const pageInfo = document.getElementById("pageInfo");
const tableContainer = document.getElementById("tableContainer");
const output = document.getElementById("output");

let itemNumber = Number(sessionStorage.getItem('PageSizes'));
let currentPage = 1;
const worker = new Worker("fetchWorker.js");


worker.onmessage = async function (event) {
    const { type, data, pageSize, direction } = event.data; //data from the worker
  
    if(type === "navigationData"){
  
        const {pageData } = data;

        if (direction === 'next') {
            sessionStorage.setItem("nextPageData", JSON.stringify(pageData));
        } else if (direction === 'prev') {
            sessionStorage.setItem("previousPageData", JSON.stringify(pageData));
        }

        const currentPageData = JSON.parse(sessionStorage.getItem("currentPageData"));

        if (currentPageData.error) {
            tableContainer.textContent = `Error loading page data: ${currentPageData.error}`;
        } else {
            createTable(currentPageData, tableContainer,output);
        }
    

        const hasNextPage = pageData && pageData.products.length === pageSize;
        updateButtons(hasNextPage);

    } else if (type === "error") {
    console.error("Error fetching data:", data.message);
    }
  };

export function updatePageInfo(page) {
  pageInfo.textContent = `Page ${page}`;
  if(page === 1) currentPage = 1;
  const intervalTime = 5000000;
  startExpiryTimer(intervalTime,page);
}

function updateButtons(hasMorePages) {
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = !hasMorePages;
}

function moveData(from, to) {
  sessionStorage.setItem(to, sessionStorage.getItem(from));
}

function fetchDataForPage(page, pageSize, direction) {

    updatePageInfo(page);
 
    if (page > currentPage) {
        moveData("currentPageData", "previousPageData");
        moveData("nextPageData", "currentPageData");
    } else {
    moveData("currentPageData", "nextPageData");
    moveData("previousPageData", "currentPageData");
    }

    currentPage = page;
    itemNumber = pageSize;

    const url = `https://dummyjson.com/products`;

    worker.postMessage({ type: "navigate", url, page, pageSize , direction});
}

prevPageBtn.addEventListener("click", function () {
    itemNumber = Number(sessionStorage.getItem('PageSize'));
    if (currentPage > 1) {
        fetchDataForPage(currentPage - 1, itemNumber, 'prev');
    }
});

nextPageBtn.addEventListener("click", function () {
    itemNumber = Number(sessionStorage.getItem('PageSize'));
    fetchDataForPage(currentPage + 1,itemNumber, 'next');
});

export { fetchDataForPage, updateButtons };
