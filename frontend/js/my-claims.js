const claimsTableBody = document.getElementById("claimsTableBody");
const claimFilter = document.getElementById("claimFilter");

let myclaims = [];
async function loadMyClaims() {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/claims/my-claims`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await response.json();
    console.log("my claims=", data);
    myclaims = data.claims;
    displayclaims(myclaims);
    const claimfilter = document.getElementById("claimFilter");
    claimfilter.addEventListener("change", () => {
        const selected = claimfilter.value;
        if (selected === "all") {
            displayclaims(myclaims);
            return;
        }
        const filterdata = myclaims.filter(claim => {
            return claim.status === selected;
        });
        displayclaims(filterdata);

    });

}
loadMyClaims();
displayclaims(myclaims);
function displayclaims(claims) {
    claimsTableBody.innerHTML = "";
    const noClaims = document.getElementById("noClaims");

    if (claims.length === 0) {
        noClaims.style.display = "block";
    } else {
        noClaims.style.display = "none";
    }
    claims.forEach(claim => {
        let statusclass;
        if (claim.status === "pending") {
            statusclass = "bg-warning";
        }
        else if (claim.status == "approved") {
            statusclass = "bg-success";
        }
        else {
            statusclass = "bg-denger";
        }
        const row = document.createElement("tr");
        const date = new Date(claim.created_at);
        const formattedDate = date.toLocaleDateString("en-IN");
        row.innerHTML = `<td>${claim.item_title}</td>
    <td>${claim.item_type}</td>
    <td>${claim.message}</td>
    <td>
    <span class="badge ${statusclass}"> ${claim.status}</span></td>
    <td>${claim.formattedDate}</td>
    <td>
    <a href="item-details.html?id=${claim.item_id}"
       class="btn btn-sm btn-outline-primary">
       View
    </a>
</td>
    `;
        claimsTableBody.appendChild(row);
    });

}