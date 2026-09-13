const reportsTableBody = document.getElementById("reportsTableBody");
const reportSearch = document.getElementById("reportSearch");
const reportType = document.getElementById("reportType");
const reportStatus = document.getElementById("reportStatus");
const filterBtn = document.getElementById("filterBtn");
const noReports = document.getElementById("noReports"); 
let allReports = [];
async function loadReports() {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/items`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (!response.ok) {
            console.error(data.message);
            return;
        }
        allReports = data.items || [];
        displayReports(allReports);
    } catch (error) {
        console.error("Error loading reports:", error);
    }
}
function displayReports(reports) {
    reportsTableBody.innerHTML = "";
    if (reports.length === 0) {
        noReports.classList.remove("d-none");
        return;
    }
    noReports.classList.add("d-none");
    reports.forEach(report => {
        const row = document.createElement("tr");
        const typeClass = report.type === "lost"
            ? "bg-danger"
            : "bg-success";
        const statusClass = report.status === "claimed"
            ? "bg-secondary"
            : "bg-primary";
        const date = report.date
            ? new Date(report.date).toLocaleDateString("en-IN")
            : "-";
        row.innerHTML = `
            <td>${report.id}</td>
            <td>${report.title}</td>
            <td>
                <span class="badge ${typeClass}">
                    ${report.type}
                </span>
            </td>
            <td>${report.user_name || "-"}</td>
            <td>${report.location || "-"}</td>
            <td>${date}</td>
            <td>
                <span class="badge ${statusClass}">
                    ${report.status}
                </span>
            </td>
            <td>
                <a href="../User/item-details.html?id=${report.id}"
                   class="btn btn-sm btn-outline-primary">
                    View
                </a>
            </td>
        `;
        reportsTableBody.appendChild(row);
    });
}
function filterReports() {
    const searchText = reportSearch.value.toLowerCase().trim();
    const selectedType = reportType.value;
    const selectedStatus = reportStatus.value;
    const filteredReports = allReports.filter(report => {
        const matchesSearch =
            report.title.toLowerCase().includes(searchText) ||
            (report.user_name || "").toLowerCase().includes(searchText);
        const matchesType =
            selectedType === "all" ||
            report.type === selectedType;
        const matchesStatus =
            selectedStatus === "all" ||
            report.status === selectedStatus;
        return matchesSearch && matchesType && matchesStatus;
    });
    displayReports(filteredReports);
}
filterBtn.addEventListener("click", filterReports);
reportType.addEventListener("change", filterReports);
reportStatus.addEventListener("change", filterReports);
reportSearch.addEventListener("keyup", event => {
    if (event.key === "Enter") {
        filterReports();
    }
});
loadReports();