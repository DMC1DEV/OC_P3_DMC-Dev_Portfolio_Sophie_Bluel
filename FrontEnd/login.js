const loginForm = document.querySelector("#login-form")

const admin = [
    { email: "admin@gmail.com", password: "adminsb0007" }
];

loginForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const email = loginForm.email.value
    const password = loginForm.password.value

    const authenticated = authentication(email, password)

    if (authenticated) {
        alert("Connexion réussie")

        // Redirection vers page accueil

        window.location.href = "index.html";
    } else {
        alert("Email ou mot de passe éronné")
    }
})

// Function d'authentification (email, mdp)

function authentication(email, password) {

    for (let i = 0; i < admin.length; i++) {
        if (admin[i].email === email && admin[i].password === password) {
            return true
        } else {
            return false
        }
    }
}

