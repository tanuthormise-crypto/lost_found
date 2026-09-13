const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
if(loginForm){
    loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(
            `${API_URL}/auth/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        console.log("Login response:", data);

        if (!response.ok) {
            alert(data.message || "Login failed");
            return;
        }

        // Save JWT token
        localStorage.setItem("token", data.token);

        // Save logged-in user
        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );

        // Check role
        if (data.user.role === "admin") {

            window.location.href =
                "../admin/admin_dashbord.html";

        } else {

            window.location.href =
                "../user/user_dashbord.html";
        }

    } catch (error) {

        console.error("Login error:", error);

        alert("Unable to connect to server");
    }
});
}
if(registerForm){
   
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/auth/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password,
                        phone: phone
                    })
                }
            );

            const data = await response.json();

            console.log("Register response:", data);

            if (!response.ok) {
                alert(data.message || "Registration failed");
                return;
            }

            alert("Registration successful! Please login.");

            window.location.href = "login.html";

        } catch (error) {
            console.error("Registration error:", error);
            alert("Unable to connect to server");
        }
    });
}
