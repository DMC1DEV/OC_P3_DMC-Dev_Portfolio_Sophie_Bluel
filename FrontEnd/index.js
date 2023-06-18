/****** API ******/

// Load de l'API

async function loadApi() {
    await fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(data => (works = data));

    createGallery();
    loadFiltres();
    createTitleAndEdit();
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

// Création du Titre et du boutons "modifier"

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

/****** Filtres 

// Création des filtres

const boutonFiltrer = document.querySelectorAll('.btn-filtrer');

boutonFiltrer.addEventListener('click', function () {
    const worksFiltres = categories.filter(function (categories) {
        return categories === worksFiltres;
    });
});

******/

/******* Modale ******/

// Récupération des éléments pour le DOM

const openModalBtn = document.getElementById('openModaleBtn');
const modal = document.getElementById('modal-edit');
const closeModalBtn = modal.querySelector('.close');


