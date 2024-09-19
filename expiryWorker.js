// import { getWithExpiry } from "./sessionStorage";

// self.onmessage = function(event) {
//     const {expiry, taskData } = event.data;

//     console.log("received message")
//     const checkExpiry = getWithExpiry("currentPageData");
//     if(checkExpiry === null){
//         self.postMessage('expired');
//     }
//     else{
//         self.postMessage(taskData);
//     }
// }