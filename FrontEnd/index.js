// Load de l'API

async function loadApi() {
    await fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(data => (works = data));

    createGallery();
    loadFiltres();
}

loadApi()


// Gestion du DOM

function createGallery() {

    for (let i = 0; i < works.length; i++) {

        const sectionWorks = document.querySelector(".gallery");
        const workElement = document.createElement("div");
        const imageWork = document.createElement("img");
        const titleWork = document.createElement("p");

        imageWork.src = works[i].imageUrl;
        titleWork.innerText = works[i].title;

        sectionWorks.appendChild(workElement);
        workElement.appendChild(imageWork);
        workElement.appendChild(titleWork);
    }
}

async function loadFiltres() {
    await fetch('http://localhost:5678/api/categories')
        .then(response => response.json())
        .then(data => (categories = data));

    for (let i = 0; i < categories.length; i++) {

        const divFiltres = document.querySelector(".filtres");
        const filtreButton = document.createElement("button");
        const titleButton = document.createElement("p");

        filtreButton.classList.add("btn-filtrer");

        titleButton.innerText = categories[i].name;

        divFiltres.appendChild(filtreButton);
        filtreButton.appendChild(titleButton);
    }
}

// Gestion des filtres

const boutonFiltrer = document.querySelector(".btn-filtrer");

boutonFiltrer.addEventListener("click", function () {
    const worksFiltres = categories.filter(function (categories) {
        return categories === worksFiltres;
    });
})



