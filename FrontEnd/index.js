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
        const editButtonDiv = document.querySelector('.portfolio-title');
        const editButton = document.createElement('button');
        const loginButtonDiv = document.querySelector('#login-btn');
        const loginButton = document.createElement('li');
        const adminModePanelDiv = document.querySelector('.adminmodepanel');
        const adminModePanel = document.createElement('div');
        const adminModePanelButton = document.createElement('button');

        adminModePanel.id = 'adminmodepanel-banner';
        adminModePanelButton.innerText = 'Mode édition';
        loginButton.innerText = 'logout';
        editButton.innerText = 'Modifier';

        adminModePanelDiv.appendChild(adminModePanel);
        adminModePanel.appendChild(adminModePanelButton);
        editButtonDiv.appendChild(editButton);
        loginButtonDiv.appendChild(loginButton);

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
