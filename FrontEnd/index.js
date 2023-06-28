/****** API ******/

// Load de l'API
async function loadApi() {
    await fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(data => (works = data));

    createGallery();
    loadFiltres();
}

loadApi();

/****** Création du DOM ******/

// Création de la gallery de projets
function createGallery() {
    for (let i = 0; i < works.length; i++) {
        const sectionWorks = document.querySelector('.gallery');
        const workElement = document.createElement('div');
        const imageWork = document.createElement('img');
        const titleWork = document.createElement('p');

        imageWork.src = works[i].imageUrl;
        titleWork.innerText = works[i].title;

        sectionWorks.appendChild(workElement);
        workElement.appendChild(imageWork);
        workElement.appendChild(titleWork);
    }
}

// Création des différents filtres
async function loadFiltres() {
    await fetch('http://localhost:5678/api/categories')
        .then(response => response.json())
        .then(data => (categories = data));

    for (let i = 0; i < categories.length; i++) {
        const divFiltres = document.querySelector('.filtres');
        const filtreButton = document.createElement('button');
        const titleButton = document.createElement('p');

        filtreButton.classList.add('btn-filtrer');

        titleButton.innerText = categories[i].name;

        divFiltres.appendChild(filtreButton);
        filtreButton.appendChild(titleButton);
    }
}

// Activation du mode Admin
if (localStorage.getItem('token')) {
    async function createAdminMode() {
        const titlePortfolioDiv = document.querySelector('.portfolio-title');
        const titlePortfolio = document.createElement('h2');
        const editButton = document.createElement('button');
        const loginButtondiv = document.querySelector('#login-btn');
        const loginButton = document.createElement('li');

        loginButton.innerText = 'logout';

        titlePortfolio.innerText = 'Projets';
        editButton.innerText = 'Modifier';

        titlePortfolioDiv.appendChild(titlePortfolio);
        titlePortfolioDiv.appendChild(editButton);
        loginButtondiv.appendChild(loginButton);

        loginButton.addEventListener('click', function () {
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        });
    }

    createAdminMode();
    
} else {
    const loginButtondiv = document.querySelector('#login-btn');
    const loginButton = document.createElement('li');
    const loginButtonLink = document.createElement('a');

    loginButtonLink.href = 'login.html';
    loginButtonLink.innerText = 'login';

    loginButton.appendChild(loginButtonLink);
    loginButtondiv.appendChild(loginButton);
}
