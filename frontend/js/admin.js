const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "../auth/login.html";
}


async function loadDashboard() {

    try {

        const response = await fetch(
            `${API_URL}/dashboard`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        console.log("Dashboard data:", data);

        if (!response.ok) {

            alert(
                data.message ||
                "Unable to load dashboard"
            );

            if (
                response.status === 401 ||
                response.status === 403
            ) {

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                window.location.href =
                    "../auth/login.html";
            }

            return;
        }
        document.getElementById("totalUsers").innerText =
            data.users.total;

        document.getElementById("lostItems").innerText =
            data.items.lost;

        document.getElementById("foundItems").innerText =
            data.items.found;

        document.getElementById("pendingClaims").innerText =
            data.claims.pending;

    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

    }
}



async function loadReports() {

    try {

        const response = await fetch(
            `${API_URL}/items`,
            {
                method: "GET"
            }
        );

        const data = await response.json();

        console.log(
            "Reports data:",
            data
        );


        if (!response.ok) {

            console.error(
                "Unable to load reports:",
                data.message
            );

            return;
        }


        const tableBody =
            document.getElementById(
                "reportsTableBody"
            );


        tableBody.innerHTML = "";


        if (data.items.length === 0) {

            tableBody.innerHTML = `
                <tr>

                    <td
                        colspan="7"
                        class="text-center text-muted">

                        No reports found

                    </td>

                </tr>
            `;

            return;
        }


        data.items.forEach(item => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <!-- Item -->

                <td>
                    ${item.title}
                </td>


                <!-- Reported By -->

                <td>
                    ${item.user_name}
                </td>


                <!-- Type -->

                <td>

                    <span class="badge ${
                        item.type === "lost"
                            ? "bg-danger"
                            : "bg-success"
                    }">

                        ${item.type}

                    </span>

                </td>


                <!-- Location -->

                <td>
                    ${item.location || "-"}
                </td>


                <!-- Date -->

                <td>
                    ${item.date || "-"}
                </td>


                <!-- Status -->

                <td>

                    <span class="badge ${
                        item.status === "open"
                            ? "bg-warning text-dark"
                            : "bg-primary"
                    }">

                        ${item.status}

                    </span>

                </td>


                <!-- Action -->

                <td>

                    <a
                        href="items.html"
                        class="btn btn-sm btn-dark">

                        View

                    </a>

                </td>

            `;


            tableBody.appendChild(row);

        });


    } catch (error) {

        console.error(
            "Reports error:",
            error
        );

    }

}



loadDashboard();

loadReports();