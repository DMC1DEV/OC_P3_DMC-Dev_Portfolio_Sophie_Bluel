/****** API ******/

// Chargement de l'API
async function loadApi() {
    const response = await fetch('http://localhost:5678/api/works');
    const data = await response.json();
    works = data;
    createGallery();

    if (localStorage.getItem('token')) {
        return;
    }

    loadFiltres();

}

loadApi();

/****** Création du DOM ******/

// Création de la galerie de projets
function createGallery() {
    for (let i = 0; i < works.length; i++) {
        const sectionWorks = document.querySelector('.gallery');
        const workElement = document.createElement('div');
        const imageWork = document.createElement('img');
        const titleWork = document.createElement('p');

        imageWork.src = works[i].imageUrl;
        titleWork.innerText = works[i].title;

        workElement.appendChild(imageWork);
        workElement.appendChild(titleWork);
        sectionWorks.appendChild(workElement);
    }
}

// Création des différents filtres
async function loadFiltres() {
    const response = await fetch('http://localhost:5678/api/categories');
    const data = await response.json();
    categories = data;

    for (let i = 0; i < categories.length; i++) {
        const divFiltres = document.querySelector('.filtres');
        const filtreButton = document.createElement('button');
        const titleButton = document.createElement('p');

        filtreButton.classList.add('btn-filtrer');
        titleButton.innerText = categories[i].name;

        filtreButton.appendChild(titleButton);
        divFiltres.appendChild(filtreButton);
    }
}

// Activation du mode Admin
if (localStorage.getItem('token')) {
    function createAdminMode() {
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

        adminModePanel.appendChild(adminModePanelButton);
        adminModePanelDiv.appendChild(adminModePanel);
        editButtonDiv.appendChild(editButton);
        loginButtonDiv.appendChild(loginButton);

        // Ajout de l'écouteur d'événement pour ouvrir la modale
        editButton.addEventListener('click', openModal);

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

/****** Modal ******/

// Déclaration d'une variable pour stocker la référence de la modale
let modal = null;

// Fonction pour créer et afficher la modale
function openModal() {
    // Vérifiez si la modale existe déjà
    if (!modal) {
        modal = createModal();
        document.body.appendChild(modal);
    }
}

// Fonction pour fermer la modale
function closeModal() {
    // Vérifiez si la modale existe avant de la supprimer
    if (modal) {
        modal.remove();
        modal = null;
    }
}

// Fonction pour créer la structure HTML de la modale
function createModal() {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    const content = document.createElement('div');
    content.classList.add('modal-content');

    const closeButton = document.createElement('span');
    closeButton.classList.add('close-button');
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', closeModal);

    content.appendChild(closeButton);
    modal.appendChild(content);

    // Déplacement de l'élément modal en première position dans le body
    document.body.insertBefore(modal, document.body.firstChild);

    return modal;
}

// Sélection de l'élément du bouton "Modifier"
const editButton = document.querySelector('.portfolio-title button');

// Ajout de l'écouteur d'événement pour ouvrir la modale lorsque le bouton est cliqué
editButton.addEventListener('click', openModal);
