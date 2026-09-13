const itemsContainer = document.getElementById("itemsContainer");
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const searchBtn = document.getElementById("searchBtn");
const noResults = document.getElementById("noResults");
let allItems = [];
async function loadItems() {
    try {
        const response = await fetch(`${API_URL}/items`);
        const data = await response.json();
        console.log("Response data:", data);
        allItems = data.items;
        displayItems(allItems);
    }
    catch (error) {
        console.error("Error loading items:", error);
    }
}
function displayItems(items) {
    itemsContainer.innerHTML = "";
    if (items.length === 0) {
        noResults.classList.remove("d-none");
        return;
    }
    noResults.classList.add("d-none");
    items.forEach(item => {
        const card = document.createElement("div");
        card.className = "col-md-6 col-lg-4 item-card";
        card.innerHTML = `
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <span class="badge ${
                        item.type === "lost"
                            ? "bg-danger"
                            : "bg-success"
                    } mb-2">
                        ${item.type.toUpperCase()}
                    </span>
                    <h5 class="card-title">
                        ${item.title}
                    </h5>
                    <p class="card-text text-muted">
                        ${item.description}
                    </p>
                    <p class="mb-1">
                        <strong>Location:</strong>
                        ${item.location || "-"}
                    </p>
                    <p class="mb-1">
                        <strong>Date:</strong>
                        ${item.date || "-"}
                    </p>
                    <p class="mb-3">
                        <strong>Status:</strong>
                        <span class="badge ${
                            item.status === "claimed"
                                ? "bg-secondary"
                                : "bg-primary"
                        }">

                            ${item.status}

                        </span>

                    </p>
                    <a
                        href="item-details.html?id=${item.id}"
                        class="btn btn-outline-primary w-100"
                    >
                        View Details
                    </a>
                </div>
            </div>
        `;
        itemsContainer.appendChild(card);
    });

}
function filterItems() {
    const searchText =
        searchInput.value.toLowerCase().trim();
    const selectedType =
        typeFilter.value;
    const filteredItems =
        allItems.filter(item => {
            const matchesSearch =
                item.title
                    .toLowerCase()
                    .includes(searchText)
                ||
                item.description
                    .toLowerCase()
                    .includes(searchText);
            const matchesType =
                selectedType === "all"
                ||
                item.type === selectedType;

            return matchesSearch && matchesType;
        });
    displayItems(filteredItems);
}
searchBtn.addEventListener("click", filterItems);
typeFilter.addEventListener("change", filterItems);
searchInput.addEventListener("keyup", event => {
    if (event.key === "Enter") {
        filterItems();
    }
});
loadItems();

