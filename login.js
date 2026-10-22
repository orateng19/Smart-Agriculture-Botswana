
const form = document.getElementById("auth-form");
const loginTab = document.getElementById("login-tab");
const signupTab = document.getElementById("signup-tab");
const signupFields = document.getElementById("signup-fields");
const confirmField = document.getElementById("confirm-password-field");

const title = document.getElementById("form-title");
const description = document.getElementById("form-description");
const submitButton = document.getElementById("submit-button");
const message = document.getElementById("message");

const nameInput = document.getElementById("farmer-name");
const phoneInput = document.getElementById("phone");
const villageInput = document.getElementById("village");
const farmInput = document.getElementById("farm-name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirm-password");

let mode = "login";

function setMode(newMode) {
    mode = newMode;
    form.reset();
    message.textContent = "";

    const isSignup = mode === "signup";

    signupFields.hidden = !isSignup;
    confirmField.hidden = !isSignup;

    nameInput.required = isSignup;
    phoneInput.required = isSignup;
    villageInput.required = isSignup;
    confirmInput.required = isSignup;

    passwordInput.autocomplete = isSignup
        ? "new-password"
        : "current-password";

    title.textContent = isSignup
        ? "Create Farmer Account"
        : "Farmer Login";

    description.textContent = isSignup
        ? "Register to access smart farming tools."
        : "Welcome back! Sign in to access your farming dashboard.";

    submitButton.textContent = isSignup
        ? "Create Account"
        : "Login";

    loginTab.classList.toggle("active", !isSignup);
    signupTab.classList.toggle("active", isSignup);
}

loginTab.addEventListener("click", () => setMode("login"));
signupTab.addEventListener("click", () => setMode("signup"));

form.addEventListener("submit", function (event) {
    event.preventDefault();
    message.textContent = "";

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    if (password.length < 8) {
        message.textContent =
            "Your password must contain at least 8 characters.";
        return;
    }

    // DEMO ONLY: accounts are stored in this browser.
    // Never store real passwords this way in a live website.
    let accounts;

    try {
        accounts = JSON.parse(
            localStorage.getItem("demoFarmerAccounts") || "{}"
        );
    } catch {
        message.textContent = "Could not read demo accounts.";
        return;
    }

    if (mode === "signup") {
        if (password !== confirmInput.value) {
            message.textContent = "Your passwords do not match.";
            return;
        }

        if (accounts[email]) {
            message.textContent =
                "An account with this email already exists.";
            return;
        }

        accounts[email] = {
            name: nameInput.value.trim(),
            phone: phoneInput.value.trim(),
            village: villageInput.value.trim(),
            farm: farmInput.value.trim(),
            // Insecure demo storage, not for real accounts.
            password: password
        };

        try {
            localStorage.setItem(
                "demoFarmerAccounts",
                JSON.stringify(accounts)
            );
        } catch {
            message.textContent =
                "Unable to save the demo account in this browser.";
            return;
        }

        message.textContent =
            "Demo account created! You can now log in.";

        setMode("login");
        message.textContent =
            "Registration successful. Please log in.";
        return;
    }

    const account = accounts[email];

    if (!account || account.password !== password) {
        message.textContent =
            "Incorrect email or password. Please try again.";
        return;
    }

    // Save only the display name for this browser session.
    sessionStorage.setItem("farmerName", account.name);

    // Change this page to the actual dashboard filename.
    window.location.href = "dashboard.html";
});
