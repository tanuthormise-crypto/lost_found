const foundItemForm = document.getElementById("foundItemForm");

foundItemForm.addEventListener("submit", async (e) => {
    e.preventDefault();
const itemName = document.getElementById("itemName").value;
const description = document.getElementById("description").value;
const date = document.getElementById("foundDate").value;
const foundlocation = document.getElementById("foundLocation").value;

const token = localStorage.getItem("token");
const response = await fetch(`${API_URL}/items`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(
        {
            title :itemName,
description:description,
type :"found",
location :foundlocation,
date :date
        }
    )
});
const data=await response.json();
console.log("response data",data);
if(response.ok){
alert("found item created successfully");
}
else{
    alert(data.message || "failed to report item");
}
});