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

/********************************************************************/

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

/********************************************************************/

// Chargement des filtres
async function loadFiltres() {
    const response = await fetch('http://localhost:5678/api/categories');
    const data = await response.json();
    categories = data;

    const divFiltres = document.querySelector('.filtres');
    const tousButton = document.createElement('button');
    const tousTitle = document.createElement('p');

    tousButton.classList.add('btn-filtrer');
    tousTitle.innerText = 'Tous';

    tousButton.appendChild(tousTitle);
    divFiltres.insertBefore(tousButton, divFiltres.firstChild);

    // Ajout de l'écouteur d'événement pour le bouton "Tous"
    tousButton.addEventListener('click', () => {
        filterWorksByCategory(null);
    });

    for (let i = 0; i < categories.length; i++) {
        const filtreButton = document.createElement('button');
        const titleButton = document.createElement('p');

        filtreButton.classList.add('btn-filtrer');
        titleButton.innerText = categories[i].name;

        filtreButton.appendChild(titleButton);
        divFiltres.appendChild(filtreButton);

        // Ajout de l'écouteur d'événement pour les autres boutons de filtre
        filtreButton.addEventListener('click', () => {
            filterWorksByCategory(categories[i].id);
        });
    }
}

// Filtrage des projets par catégorie
function filterWorksByCategory(categoryId) {
    const sectionWorks = document.querySelector('.gallery');
    const worksElements = sectionWorks.querySelectorAll('div');

    // Afficher toutes les œuvres initialement
    worksElements.forEach((element) => {
        element.style.display = 'block';
    });

    // Filtrer les œuvres par catégorie
    for (let i = 0; i < works.length; i++) {
        const workElement = worksElements[i];

        if (categoryId && works[i].categoryId !== categoryId) {
            workElement.style.display = 'none';
        }
    }
}

/********************************************************************/

/****** Admin mode *****/

// Activation du mode Admin
if (localStorage.getItem('token')) {
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

// Création du mode Admin
function createAdminMode() {
    const editButtonDiv = document.querySelector('.portfolio-title');
    const editButton = document.createElement('button');
    const logoutButtonDiv = document.querySelector('#login-btn');
    const logoutButton = document.createElement('li');

    editButton.innerText = 'Modifier';
    logoutButton.innerText = 'Log out';

    editButtonDiv.appendChild(editButton);
    logoutButtonDiv.appendChild(logoutButton);

    // Ajout de l'écouteur d'événement pour ouvrir la modale
    editButton.addEventListener('click', openModal);

    logoutButton.addEventListener('click', function () {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });

    const adminModePanelDiv = document.createElement('div');
    adminModePanelDiv.classList.add('adminmodepanel');
    const adminModePanel = document.createElement('div');
    adminModePanel.id = 'adminmodepanel-banner';
    const adminModePanelButton = document.createElement('button');
    adminModePanelButton.innerText = 'Mode édition';

    adminModePanel.appendChild(adminModePanelButton);
    adminModePanelDiv.appendChild(adminModePanel);
    editButtonDiv.parentNode.insertBefore(adminModePanelDiv, editButtonDiv.nextSibling);
}

/********************************************************************/


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

// Fonction pour fermer la modale avec le bouton close
function closeModal() {
    // Vérifiez si la modale existe avant de la supprimer
    if (modal) {
        modal.remove();
        modal = null;
    }
}

// Fonction pour créer la structure HTML de la modale
function createModal() {
    // Création de la galerie de projets
    function createGallery() {
        const gallery = document.createElement('div');
        gallery.id = 'gallery-modal';

        for (let i = 0; i < works.length; i++) {
            const workElement = document.createElement('div');
            const imageWork = document.createElement('img');
            const titleWork = document.createElement('p');
            const deleteLink = document.createElement('a');
            const deleteIcon = document.createElement('i');

            imageWork.src = works[i].imageUrl;
            titleWork.innerText = 'editer';

            deleteIcon.classList.add('fas', 'fa-trash-alt', 'delete-icon');
            deleteLink.appendChild(deleteIcon);
            deleteLink.href = '#';
            deleteLink.id = 'trash-icon';

            deleteLink.addEventListener('click', (event) => {
                event.preventDefault();

                // Vérifier si le mode admin est activé (vérification du token)
                const token = localStorage.getItem('token');
                if (token) {
                    const url = `http://localhost:5678/api/works/${works[i].id}`;

                    fetch(url, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}` // Inclure le token d'authentification dans l'en-tête de la requête
                        }
                    }).then(response => {
                        if (response.ok) {
                            // Supprimer le travail de la liste "works"
                            works.splice(i, 1);
                            // Mettre à jour l'interface utilisateur (re-créer la galerie avec les travaux mis à jour)
                            createGallery();
                        } else {
                            console.error('Failed to delete work');
                        }
                    }).catch((error) => {
                        console.error('Error:', error);
                    });
                } else {
                    console.log('Admin mode is not enabled');
                }
            });

            workElement.classList.add('gallery-card');

            workElement.appendChild(imageWork);
            workElement.appendChild(deleteLink);
            workElement.appendChild(titleWork);
            gallery.appendChild(workElement);
        }

        return gallery;
    }

    const modal = document.createElement('div');
    modal.classList.add('modal');

    const content = document.createElement('div');
    content.classList.add('modal-content');

    const closeButton = document.createElement('span');
    closeButton.classList.add('close-button');
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', closeModal);

    const gallery = createGallery();

    const modalTitle = document.createElement('p')
    modalTitle.textContent = 'Galerie Photo';
    modalTitle.classList.add('modal-title')

    const separatorLine = document.createElement('hr');
    const addButton = document.createElement('button');
    addButton.classList.add('btn');
    addButton.innerText = 'Ajouter une photo';
    const deleteGalleryLink = document.createElement('a');
    deleteGalleryLink.href = '#';
    deleteGalleryLink.innerText = 'Supprimer toute la galerie';

    content.appendChild(closeButton);
    content.appendChild(modalTitle);
    content.appendChild(gallery);
    content.appendChild(separatorLine);
    content.appendChild(addButton);
    content.appendChild(deleteGalleryLink);

    modal.appendChild(content);

    // Déplacement de l'élément modal en première position dans le body
    document.body.insertBefore(modal, document.body.firstChild);

    // Ferme la modale en cliquant en dehors de la modale
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    return modal;
}

// Sélection de l'élément du bouton "Modifier"
const editButton = document.querySelector('.portfolio-title button');

// Vérifier si l'élément existe avant d'ajouter l'événement
if (editButton) {
    // Ajout de l'écouteur d'événement pour ouvrir la modale lorsque le bouton est cliqué
    editButton.addEventListener('click', openModal);
}
