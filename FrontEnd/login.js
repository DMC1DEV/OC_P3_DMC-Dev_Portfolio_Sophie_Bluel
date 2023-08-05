let emailInput = document.getElementById('email');
let passwordInput = document.getElementById('password');

let user = {
    email: '',
    password: ''
};

function loginFormEnvoi() {
    const connectBtn = document.getElementById('connect-btn');
    connectBtn.addEventListener('click', function (event) {
        event.preventDefault();
        submitForm();
    });
}

function createErrorMessage(message, targetElement) {
    let errorMessage = targetElement.nextElementSibling;
    if (!errorMessage || !errorMessage.classList.contains('error-message')) {
        errorMessage = document.createElement('span');
        errorMessage.textContent = message;
        errorMessage.className = 'error-message';
        targetElement.parentNode.appendChild(errorMessage);
    }
}

function removeErrorMessages() {
    const errorMessages = document.getElementsByClassName('error-message');
    while (errorMessages[0]) {
        errorMessages[0].parentNode.removeChild(errorMessages[0]);
    }
}

async function submitForm() {
    try {
        // Clear les messages d'erreur précédent. 
        removeErrorMessages();

        user.email = emailInput.value.trim();
        user.password = passwordInput.value.trim();

        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        if (!response.ok) {
            alert('Mot de passe incorrect ou utilisateur introuvable.');
            return;
        }

        const data = await response.json();
        console.log(data);

        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.getItem('token');
            window.location.href = 'index.html';
        } else {
            if (data.errors) {
                if (data.errors.email) {
                    createErrorMessage(data.errors.email, emailInput);
                }
                if (data.errors.password) {
                    createErrorMessage(data.errors.password, passwordInput);
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
}


loginFormEnvoi();
