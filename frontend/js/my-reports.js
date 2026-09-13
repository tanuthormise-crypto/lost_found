const reportsTableBody = document.getElementById("reportsTableBody");
const reportFilter = document.getElementById("reportFilter");
const noReports = document.getElementById("noReports");
let myReports = [];
async function loadMyReports() {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/items/my-items`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    const data = await response.json();
    console.log("my reports:", data);
    myReports = data.items;
    displayReports(myReports);

    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", async () => {
            const itemId = button.dataset.id;
            console.log("Deleting item:", itemId);
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${API_URL}/items/${itemId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            console.log("Delete response:", data);
            if (!response.ok) {
                alert(data.message || "Delete failed");
                return;
            }
            button.closest("tr").remove();
        });
    });
}
reportFilter.addEventListener("change", () => {
    const selectedType = reportFilter.value;
    console.log("Selected filter:", selectedType);
    if (selectedType === "all") {
        displayReports(myReports);
        return;
    }
    const filteredReports = myReports.filter(item => {
        return item.type === selectedType;
    });
    displayReports(filteredReports);
});
loadMyReports();
function displayReports(reports) {
    reportsTableBody.innerHTML = "";
    if(reports.length===0){
        reportsTableBody.textContent="no reports found";
        return;
    }
    else{

    
    reports.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.title}</td>
            <td>${item.type}</td>
            <td>${item.location}</td>
            <td>${item.date}</td>
            <td>${item.status}</td>
            <td>
                <a href="item-details.html?id=${item.id}"
                   class="btn btn-sm btn-outline-primary">
                    View
                </a>
                <button
                    class="btn btn-sm btn-outline-danger delete-btn"
                    data-id="${item.id}">
                    Delete
                </button>
            </td>`;
        reportsTableBody.appendChild(row);
    
    });
}
}