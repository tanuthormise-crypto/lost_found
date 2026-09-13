const usersTableBody = document.getElementById("usersTableBody");
const userSearch = document.getElementById("userSearch");
const noUsers = document.getElementById("noUsers");

let allUsers = [];

async function loadUsers() {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/users`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(data.message);
            return;
        }

        allUsers = data.users || [];
        displayUsers(allUsers);
    } catch (error) {
        console.error("Error loading users:", error);
    }
}

function displayUsers(users) {
    usersTableBody.innerHTML = "";

    if (users.length === 0) {
        noUsers.classList.remove("d-none");
        return;
    }

    noUsers.classList.add("d-none");

    users.forEach(user => {
        const row = document.createElement("tr");

        const roleClass = user.role === "admin"
            ? "bg-danger"
            : "bg-primary";

        const statusClass = user.status === "active"
            ? "bg-success"
            : "bg-secondary";

        const joinedDate = new Date(user.created_at)
            .toLocaleDateString("en-IN");

        let action = "";

        if (user.role === "admin") {
            action = `<span class="text-muted">Administrator</span>`;
        } else if (user.status === "active") {
            action = `
                <button class="btn btn-sm btn-outline-danger"
                    onclick="changeUserStatus(${user.id}, 'blocked')">
                    Block
                </button>
            `;
        } else {
            action = `
                <button class="btn btn-sm btn-outline-success"
                    onclick="changeUserStatus(${user.id}, 'active')">
                    Unblock
                </button>
            `;
        }

        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
                <span class="badge ${roleClass}">
                    ${user.role}
                </span>
            </td>
            <td>${joinedDate}</td>
            <td>
                <span class="badge ${statusClass}">
                    ${user.status}
                </span>
            </td>
            <td>${action}</td>
        `;

        usersTableBody.appendChild(row);
    });
}

function searchUsers() {
    const searchText = userSearch.value.toLowerCase().trim();

    const filteredUsers = allUsers.filter(user => {
        return (
            user.name.toLowerCase().includes(searchText) ||
            user.email.toLowerCase().includes(searchText)
        );
    });

    displayUsers(filteredUsers);
}

async function changeUserStatus(id, status) {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/users/${id}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                status: status
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Failed to update user status");
            return;
        }

        alert(data.message);

        loadUsers();
    } catch (error) {
        console.error("Status update error:", error);
    }
}

userSearch.addEventListener("input", searchUsers);

loadUsers();