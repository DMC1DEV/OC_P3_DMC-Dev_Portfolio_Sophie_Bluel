/****** API ******/

// Load de l'API

async function loadApi() {
    await fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(data => (works = data));

    createGallery();
    loadFiltres();
}

loadApi()

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
    async function createTitleAndEdit() {
        const titlePortfolioDiv = document.querySelector('.portfolio-title');
        const titlePortfolio = document.createElement('h2');
        const editButton = document.createElement('button');

        titlePortfolio.innerText = 'Projets';
        editButton.innerText = 'Modifier';
    
        titlePortfolioDiv.appendChild(titlePortfolio);
        titlePortfolioDiv.appendChild(editButton);
    }

    createTitleAndEdit();
}


/****** Filtres 




if (data.token) {
    // Détermine si l'utilisateur est administrateur
    if (isAdmin) {
        localStorage.setItem(data.token);
        console.log('Connecté en tant qu\'administrateur');
        document.getElementById('connect-btn').value = 'Log Out';

        // Créer le panneau d'administration dans le DOM
        const adminPanel = document.createElement('div');
        adminPanel.setAttribute('id', 'admin-panel');
        const adminText = document.createElement('p');
        adminText.textContent = 'Admin mode activé';
        adminPanel.appendChild(adminText);

        // Insérer le panneau d'administration avant le formulaire de connexion
        const loginInterface = document.getElementById('login-interface');
        loginInterface.parentNode.insertBefore(adminPanel, loginInterface);
    } else if (isStoredAdmin) {
        localStorage.removeItem('isAdmin');
        console.log('Mode admin désactivé');
        document.getElementById('connect-btn').value = 'Se connecter';

        // Supprimer le panneau d'administration du DOM
        const adminPanel = document.getElementById('admin-panel');
        if (adminPanel) {
            adminPanel.parentNode.removeChild(adminPanel);
        }
    }
}

// Fonction pour créer le titre et le bouton "Modifier"
async function createTitleAndEdit() {
    const titlePortfolioDiv = document.querySelector('.portfolio-title');
    const titlePortfolio = document.createElement('h2');
    const editButton = document.createElement('button');

    // Ouverture de la modale
    editButton.addEventListener('click', function () {
        modal.style.display = 'block';
    });

    // Fermeture de la modale
    closeModalBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    titlePortfolio.innerText = 'Projets';
    editButton.innerText = 'Modifier';

    titlePortfolioDiv.appendChild(titlePortfolio);
    titlePortfolioDiv.appendChild(editButton);
}

// Vérifier si l'utilisateur est déjà connecté avec un token dans le local storage
const storedToken = localStorage.getItem('token');
if (storedToken) {
    // Vérifier si l'utilisateur est administrateur
    const storedIsAdmin = localStorage.getItem('isAdmin');
    const isAdmin = storedIsAdmin === 'true';

    if (isAdmin) {
        // Activer les fonctionnalités d'administration
        console.log('Mode admin activé');
        // Par exemple, vous pouvez modifier la visibilité d'un élément de l'interface d'administration
        const adminPanel = document.getElementById('admin-panel');
        adminPanel.style.display = 'block';
    }
}

******/
