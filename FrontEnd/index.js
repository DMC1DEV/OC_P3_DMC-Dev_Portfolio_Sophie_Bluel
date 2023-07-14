/****** API ******/

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

/****** Filtres *****/

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

        filtreButton.addEventListener('click', () => {
            filterWorksByCategory(categories[i].id);
        });
    }
}

function filterWorksByCategory(categoryId) {
    const sectionWorks = document.querySelector('.gallery');
    const worksElements = sectionWorks.querySelectorAll('div');

    worksElements.forEach((element) => {
        element.style.display = 'block';
    });

    for (let i = 0; i < works.length; i++) {
        const workElement = worksElements[i];

        if (categoryId && works[i].categoryId !== categoryId) {
            workElement.style.display = 'none';
        }
    }
}

/********************************************************************/

/****** Admin mode *****/

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

function createAdminMode() {
    const editButtonDiv = document.querySelector('.portfolio-title');
    const editButton = document.createElement('button');
    const logoutButtonDiv = document.querySelector('#login-btn');
    const logoutButton = document.createElement('li');

    editButton.innerText = 'Modifier';
    logoutButton.innerText = 'Log out';

    editButtonDiv.appendChild(editButton);
    logoutButtonDiv.appendChild(logoutButton);

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

let modal = null;

function openModal() {
    if (!modal) {
        modal = createModal();
        document.body.appendChild(modal);
    }
}

function closeModal() {
    if (modal) {
        modal.remove();
        modal = null;
    }
}

function createModal() {
    function createGalleryModal() {
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

                const token = localStorage.getItem('token');
                if (token) {
                    const url = `http://localhost:5678/api/works/${works[i].id}`;

                    fetch(url, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }).then(response => {
                        if (response.ok) {
                            works.splice(i, 1);
                            createGalleryModal();
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

    const gallery = createGalleryModal();

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

    deleteGalleryLink.addEventListener('click', function (event) {
        event.preventDefault();

        const token = localStorage.getItem('token');
        if (token) {
            works.forEach((work, index) => {
                const url = `http://localhost:5678/api/works/${work.id}`;

                fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }).then(response => {
                    if (response.ok) {
                        // supprime le travail de la liste
                        works.splice(index, 1);
                    } else {
                        console.error('Failed to delete work');
                    }
                }).catch((error) => {
                    console.error('Error:', error);
                });
            });

            // Recrée la galerie après que toutes les suppressions soient terminées
            createGalleryModal();
        } else {
            console.log('Admin mode is not enabled');
        }
    });

    content.appendChild(closeButton);
    content.appendChild(modalTitle);
    content.appendChild(separatorLine);
    content.appendChild(addButton);
    content.appendChild(deleteGalleryLink);
    content.appendChild(gallery);

    modal.appendChild(content);

    return modal;
}
