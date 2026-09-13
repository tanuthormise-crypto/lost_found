const token = localStorage.getItem("token");


// Check login

if (!token) {

    window.location.href =
        "../auth/login.html";

}


// Load all claims

async function loadClaims() {

    try {

        const response = await fetch(
            `${API_URL}/claims`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        const data = await response.json();

        console.log("Claims data:", data);


        if (!response.ok) {

            alert(
                data.message ||
                "Unable to load claims"
            );

            return;
        }


        const tableBody =
            document.getElementById(
                "claimsTableBody"
            );


        tableBody.innerHTML = "";


        if (data.claims.length === 0) {

            tableBody.innerHTML = `

                <tr>

                    <td
                        colspan="7"
                        class="text-center text-muted"
                    >

                        No claims found

                    </td>

                </tr>

            `;

            return;
        }


        data.claims.forEach(claim => {

            const row =
                document.createElement("tr");


            let statusBadge;


            if (claim.status === "pending") {

                statusBadge =
                    `<span class="badge bg-warning text-dark">
                        Pending
                    </span>`;

            }

            else if (claim.status === "approved") {

                statusBadge =
                    `<span class="badge bg-success">
                        Approved
                    </span>`;

            }

            else {

                statusBadge =
                    `<span class="badge bg-danger">
                        Rejected
                    </span>`;

            }


            let actionButtons = "";


            if (claim.status === "pending") {

                actionButtons = `

                    <button
                        class="btn btn-sm btn-success me-1"
                        onclick="updateClaim(${claim.id}, 'approved')"
                    >
                        Approve
                    </button>


                    <button
                        class="btn btn-sm btn-danger"
                        onclick="updateClaim(${claim.id}, 'rejected')"
                    >
                        Reject
                    </button>

                `;

            }

            else {

                actionButtons = `
                    <span class="text-muted">
                        Completed
                    </span>
                `;

            }


            row.innerHTML = `

                <td>
                    ${claim.id}
                </td>


                <td>
                    ${claim.item_title}
                </td>


                <td>
                    ${claim.user_name}
                </td>


                <td>
                    ${claim.user_email}
                </td>


                <td>
                    ${claim.message || "-"}
                </td>


                <td>
                    ${statusBadge}
                </td>


                <td>
                    ${actionButtons}
                </td>

            `;


            tableBody.appendChild(row);

        });


    }

    catch (error) {

        console.error(
            "Claims error:",
            error
        );

    }

}


// Update claim status

async function updateClaim(claimId, status) {

    const confirmation =
        confirm(
            `Are you sure you want to ${status} this claim?`
        );


    if (!confirmation) {

        return;

    }


    try {

        const response = await fetch(

            `${API_URL}/claims/${claimId}`,

            {

                method: "PUT",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${token}`

                },

                body: JSON.stringify({

                    status: status

                })

            }

        );


        const data =
            await response.json();


        console.log(
            "Update claim response:",
            data
        );


        if (!response.ok) {

            alert(
                data.message ||
                "Unable to update claim"
            );

            return;

        }


        alert(
            data.message
        );


        // Reload claims

        loadClaims();


    }

    catch (error) {

        console.error(
            "Update claim error:",
            error
        );

        alert(
            "Unable to connect to server"
        );

    }

}



loadClaims();