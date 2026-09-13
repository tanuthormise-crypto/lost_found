
const lostItemForm = document.getElementById("lostItemForm");

lostItemForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const itemName = document.getElementById("itemName").value;
    const description = document.getElementById("description").value;
    const date = document.getElementById("lostDate").value;
    const lostlocation = document.getElementById("lostLocation").value;
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/items`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            title: itemName,
            description: description,
            type: "lost",
            location: lostlocation,
            date: date
        })
    });

    const data = await response.json();

    console.log("Report response:", data);

    if (response.ok) {
        alert("Lost item reported successfully!");
        lostItemForm.reset();
    } else {
        alert(data.message || "Failed to report item");
    }
});

