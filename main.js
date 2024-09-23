import { updateButtons } from "./pagination.js";
import { createTable } from "./table.js";

const EXPIRY_TIME = 1000 * 60 * 5; // 5 minutes

let worker;

const dropdownButton = document.querySelector(".dropbtn");
const dropdownContent = document.getElementById("myDropdown");
const dropdownItems = dropdownContent.querySelectorAll("a");


const url = `https://dummyjson.com/products`;
//pagina sa aiba timp de expirare

worker = new Worker("fetchWorker.js");

worker.onmessage = async function (event) {
  const { type, data, pageSize, pageNumber } = event.data; //data from the worker

  console.warn("Worker message received:", event.data);

    if (type === "initialLoadData") {

        const {currentPageData, nextPageData} = data;
        sessionStorage.setItem("currentPageData", JSON.stringify(currentPageData));
        sessionStorage.setItem("nextPageData", JSON.stringify(nextPageData));

        if (currentPageData.error) {
            tableContainer.textContent = `Error loading current page data: ${currentPageData.error}`;
        } else {
            createTable(currentPageData, tableContainer,output); // Update the UI with the current page data
        }

        const hasNextPage = nextPageData && nextPageData.products.length === pageSize;
        // console.warn("next page data",nextPageData)
        // console.warn("next page data length",nextPageData.length)
        // console.warn("page size",pageSize)
        // console.warn(nextPageData.length === pageSize)
        updateButtons(hasNextPage);
    
    } else if (type === "error") {
        console.error("Error fetching data:", data.message);
    }
};

//automatically fetch first page when loaded
document.addEventListener("DOMContentLoaded", function () {
  dropdownButton.addEventListener("click", () => {
    dropdownContent.style.display =
      dropdownContent.style.display === "block" ? "none" : "block";
  });

  window.addEventListener("click", (event) => {
    if (!event.target.matches(".dropbtn")) {
      if (dropdownContent.style.display === "block") {
        dropdownContent.style.display = "none";
      }
    }
  });
  dropdownItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      const selectedValue = Number(event.target.textContent); // Get the text content of the clicked item
      sessionStorage.setItem('PageSize', selectedValue);
      const url = `https://dummyjson.com/products`;
      worker.postMessage({
        url,
        page: 1,
        pageSize: selectedValue,
        type: "initialLoad"
      });
    });
  });
  window.onload = function () {
    sessionStorage.clear();
  };
});
