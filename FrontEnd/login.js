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

async function submitForm() {
    try {
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

        const data = await response.json();
        console.log(data);

        if (data.token) {
            localStorage.setItem('token', data.token);
            window.location.href = 'index.html';
        }

    } catch (error) {
        console.error(error);
    }
}

loginFormEnvoi();
