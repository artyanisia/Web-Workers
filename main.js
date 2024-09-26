import { updateButtons, updatePageInfo } from "./pagination.js";
import { createTable } from "./table.js";
import { startExpiryTimer } from "./expiry.js";

let worker;

const dropdownButton = document.querySelector(".dropbtn");
const dropdownContent = document.getElementById("myDropdown");
const dropdownItems = dropdownContent.querySelectorAll("a");

const url = `https://dummyjson.com/products`;

worker = new Worker("fetchWorker.js");

worker.onmessage = async function (event) {
  const { type, data, pageSize, pageNumber } = event.data; //data from the worker

  //console.warn("Worker message received:", event.data);

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
      const intervalTime = 10000;
      startExpiryTimer(intervalTime, 1);
      updatePageInfo(1);
    });
  });
  window.onload = function () {
    sessionStorage.clear();
  };
});
