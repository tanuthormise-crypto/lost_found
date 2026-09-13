const lostCount = document.getElementById("lostCount");
const foundCount = document.getElementById("foundCount");
const claimCount = document.getElementById("claimCount");
const recentReportsBody = document.getElementById("recentReportsBody");

async function loadDashboard() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "../Auth/login.html";
        return;
    }

    try {
        const itemsResponse = await fetch(`${API_URL}/items/my-items`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const itemsData = await itemsResponse.json();
        const reports = itemsData.items || [];

        const lostReports = reports.filter(item => item.type === "lost");
        const foundReports = reports.filter(item => item.type === "found");

        lostCount.textContent = lostReports.length;
        foundCount.textContent = foundReports.length;

        displayRecentReports(reports);

        const claimsResponse = await fetch(`${API_URL}/claims/my-claims`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const claimsData = await claimsResponse.json();
        const claims = claimsData.claims || [];

        claimCount.textContent = claims.length;

    } catch (error) {
        console.error("Dashboard error:", error);
    }
}

function displayRecentReports(reports) {
    recentReportsBody.innerHTML = "";

    const recentReports = reports.slice(0, 3);

    if (recentReports.length === 0) {
        recentReportsBody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted">
                    No reports found.
                </td>
            </tr>
        `;
        return;
    }

    recentReports.forEach(item => {
        const row = document.createElement("tr");

        const typeClass = item.type === "lost"
            ? "bg-danger"
            : "bg-success";

        const statusClass = item.status === "claimed"
            ? "bg-secondary"
            : "bg-warning text-dark";

        const formattedDate = new Date(item.date).toLocaleDateString("en-IN");

        row.innerHTML = `
            <td>${item.title}</td>
            <td>
                <span class="badge ${typeClass}">
                    ${item.type}
                </span>
            </td>
            <td>${formattedDate}</td>
            <td>
                <span class="badge ${statusClass}">
                    ${item.status}
                </span>
            </td>
        `;

        recentReportsBody.appendChild(row);
    });
}

loadDashboard();