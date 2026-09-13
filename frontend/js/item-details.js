const params = new URLSearchParams(window.location.search);
const itemId = params.get("id");
async function loadItem() {
    const response = await fetch(`${API_URL}/items/${itemId}`);
    const data = await response.json();
    console.log("Item data:", data);
    document.getElementById("itemTitle").innerText = data.item.title;
    document.getElementById("itemDescription").innerText = data.item.description;
    document.getElementById("itemLocation").innerText = data.item.location;
    document.getElementById("itemDate").innerText = data.item.date;
    document.getElementById("reportedBy").innerText = data.item.user_name;
    const statusBadge = document.getElementById("itemStatus");
    if (data.item.type === "lost") {
        statusBadge.innerText = "LOST ITEM";
        statusBadge.classList.add("bg-danger");
    } else {
        statusBadge.innerText = "FOUND ITEM";
        statusBadge.classList.remove("bg-danger");
        statusBadge.classList.add("bg-success");
    }
}
loadItem();
const claimbtn = document.getElementById("claimBtn");
claimbtn.addEventListener("click", async () => {
    const msg = document.getElementById("claimMessage").value;
    if (!msg.trim()) {
        alert("please enter claim message.");
        return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
        alert("please login to claim item !");
        return;
    }
    try {
        const response = await fetch(`${API_URL}/claims`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                item_id: itemId,
                message: msg
            })

        });
        const data = await response.json();
        console.log("claim response", data);
        if (!response.ok) {
            alert(data.message || "Claim failed");
            return;
        }
        alert("Claim submitted successfully!");
        document.getElementById("claimMessage").value = "";
    }
    catch (error) {
        console.error("Claim error:", error);
        console.error("Claim error:", error);
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        alert("Claim request failed. Check console.");

    }

});