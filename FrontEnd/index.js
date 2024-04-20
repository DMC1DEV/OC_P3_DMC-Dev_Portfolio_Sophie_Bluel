/****** API ******/

let works = [];
let categories = [];

async function loadApi() {
    try {
        const worksResponse = await fetch("http://localhost:5678/api/works");
        const worksData = await worksResponse.json();
        works = worksData;
        createGallery();

        const categoriesResponse = await fetch("http://localhost:5678/api/categories");
        const categoriesData = await categoriesResponse.json();
        categories = categoriesData;

        if (localStorage.getItem("token")) {
            return;
        }

        loadFilters();
    } catch (error) {
        console.error("Error fetching data from API:", error);
    }
}

loadApi();

/********************************************************************/

/****** Création du DOM ******/

function createGallery() {
    for (let i = 0; i < works.length; i++) {
        const sectionWorks = document.querySelector(".gallery");
        const workElement = document.createElement("div");
        const imageWork = document.createElement("img");
        const titleWork = document.createElement("p");

        imageWork.src = works[i].imageUrl;
        titleWork.innerText = works[i].title;

        workElement.appendChild(imageWork);
        workElement.appendChild(titleWork);
        sectionWorks.appendChild(workElement);
    }
}

/********************************************************************/

/****** Filtres *****/

function loadFilters() {
    const divFilters = document.querySelector(".filtres");
    const allButton = document.createElement("button");
    const allTitle = document.createElement("p");

    allButton.classList.add("btn-filter");
    allTitle.innerText = "Tous";

    allButton.appendChild(allTitle);
    divFilters.insertBefore(allButton, divFilters.firstChild);

    allButton.addEventListener("click", () => {
        filterWorksByCategory(null);
    });

    for (let i = 0; i < categories.length; i++) {
        const filterButton = document.createElement("button");
        const titleButton = document.createElement("p");

        filterButton.classList.add("btn-filter");
        titleButton.innerText = categories[i].name;

        filterButton.appendChild(titleButton);
        divFilters.appendChild(filterButton);

        filterButton.addEventListener("click", () => {
            filterWorksByCategory(categories[i].id);
        });
    }
}

function filterWorksByCategory(categoryId) {
    const sectionWorks = document.querySelector(".gallery");
    const worksElements = sectionWorks.querySelectorAll("div");

    worksElements.forEach((element) => {
        element.style.display = "block";
    });

    for (let i = 0; i < works.length; i++) {
        const workElement = worksElements[i];

        if (categoryId && works[i].categoryId !== categoryId) {
            workElement.style.display = "none";
        }
    }
}

/********************************************************************/

/****** Mode administrateur *****/

if (localStorage.getItem("token")) {
    createAdminMode();
} else {
    const loginButtonDiv = document.querySelector("#login-btn");
    const loginButton = document.createElement("li");
    const loginButtonLink = document.createElement("a");

    loginButtonLink.href = "login.html";
    loginButtonLink.innerText = "login";

    loginButton.appendChild(loginButtonLink);
    loginButtonDiv.appendChild(loginButton);
}

function createAdminMode() {
    const editButtonDiv = document.querySelector(".portfolio-title");
    const editButton = document.createElement("button");
    const logoutButtonDiv = document.querySelector("#login-btn");
    const logoutButton = document.createElement("li");

    editButton.innerText = "Modifier";
    logoutButton.innerText = "log out";

    editButtonDiv.appendChild(editButton);
    logoutButtonDiv.appendChild(logoutButton);

    editButton.addEventListener("click", openModal);

    logoutButton.addEventListener("click", function () {
        localStorage.removeItem("token");
        window.location.href = "index.html";
    });

    // Bannière du mode administrateur
    const adminModePanelDiv = document.createElement("div");
    adminModePanelDiv.classList.add("adminmodepanel");
    const adminModePanel = document.createElement("div");
    adminModePanel.id = "adminmodepanel-banner";
    const adminModePanelButton = document.createElement("p");
    adminModePanelButton.innerText = "Mode édition";
    const introductionDiv = document.querySelector("#introduction figure");
    const newDiv = document.createElement("div");
    newDiv.id = "introdivleft"

    const bannerSvgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    bannerSvgElement.innerHTML = `<path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 
    302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 
    6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 
    0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z" 
    fill="#FFFFFF"></paths>`;
    bannerSvgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    bannerSvgElement.setAttribute("height", "1em");
    bannerSvgElement.setAttribute("viewBox", "0 0 512 512");
    bannerSvgElement.setAttribute("id", "editiconbanner");

    const introSvgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    introSvgElement.innerHTML = `<path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 
    2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4
    22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 
    10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z" 
    fill="#000000"></path>`;
    introSvgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    introSvgElement.setAttribute("height", "1em");
    introSvgElement.setAttribute("viewBox", "0 0 512 512");
    introSvgElement.setAttribute("id", "editiconintro");

    const projetsSvgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    projetsSvgElement.innerHTML = `<path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 
    2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4
    22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 
    10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z" 
    fill="#000000"></path>`;
    projetsSvgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    projetsSvgElement.setAttribute("height", "1em");
    projetsSvgElement.setAttribute("viewBox", "0 0 512 512");
    projetsSvgElement.setAttribute("id", "projetsicon");

    const portfolioTitleDiv = document.querySelector(".portfolio-title");
    portfolioTitleDiv.appendChild(projetsSvgElement);

    const publishButton = document.createElement("button");
    publishButton.id = "publier-btn";
    publishButton.innerText = "Publier les changements";

    const introText = document.createElement("span");
    introText.innerText = "Modifier";

    adminModePanel.appendChild(bannerSvgElement);
    adminModePanel.appendChild(adminModePanelButton);
    adminModePanel.appendChild(publishButton);
    adminModePanelDiv.appendChild(adminModePanel);
    editButtonDiv.parentNode.insertBefore(adminModePanelDiv, editButtonDiv.nextSibling);
    introductionDiv.appendChild(newDiv);
    newDiv.appendChild(introSvgElement);
    newDiv.appendChild(introText);

}

/********************************************************************/

/****** Modal gallerie ******/

let modal = null;

function openModal() {
    if (!modal) {
        modal = createModal();
        document.body.appendChild(modal);
        modal.addEventListener("click", closeModalOutside);
    }
}

function closeModal() {
    if (modal) {
        modal.removeEventListener("click", closeModalOutside);
        modal.remove();
        modal = null;
    }
}

function closeModalOutside(event) {
    if (event.target === modal) {
        closeModal();
    }
}

function createModal() {
    function createGalleryModal() {
        const gallery = document.createElement("div");
        gallery.id = "gallery-modal";

        for (let i = 0; i < works.length; i++) {
            const workElement = document.createElement("div");
            const imageWork = document.createElement("img");
            const titleWork = document.createElement("p");
            const deleteLink = document.createElement("a");
            const deleteIcon = document.createElement("i");
            const hoverLink = document.createElement("a");
            const hoverIcon = document.createElement("i");

            imageWork.src = works[i].imageUrl;
            titleWork.innerText = "editer";

            deleteIcon.classList.add("fas", "fa-trash-alt", "delete-icon");
            deleteLink.appendChild(deleteIcon);
            deleteLink.href = "#";
            deleteLink.id = "trash-icon";

            hoverIcon.classList.add("fas", "fa-arrows-alt", "croix");
            hoverLink.appendChild(hoverIcon);
            hoverLink.href = "#";
            hoverLink.id = "hover-icon";

            deleteLink.addEventListener("click", async (event) => {
                event.preventDefault();

                const token = localStorage.getItem("token");
                if (token) {
                    const workId = works[i].id;
                    const url = `http://localhost:5678/api/works/${workId}`;

                    try {
                        const response = await fetch(url, {
                            method: "DELETE",
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });

                        if (response.ok) {
                            works = works.filter((work) => work.id !== workId);
                            workElement.remove();

                            updateGallery();

                            closeModal();

                        } else {
                            console.error("Échec de la suppression du travail");
                        }
                    } catch (error) {
                        console.error("Erreur :", error);
                    }
                } else {
                    console.log("Le mode administrateur n'est pas activé");
                }
            });

            workElement.classList.add("gallery-card");

            workElement.appendChild(imageWork);
            workElement.appendChild(deleteLink);
            workElement.appendChild(hoverLink);
            workElement.appendChild(titleWork);
            gallery.appendChild(workElement);
        }

        return gallery;
    }

    const modal = document.createElement("div");
    modal.classList.add("modal");

    const content = document.createElement("div");
    content.classList.add("modal-content");

    const separatorDiv = document.createElement("div");
    separatorDiv.classList.add("separator");

    const closeButton = document.createElement("span");
    closeButton.classList.add("close-button");
    closeButton.innerHTML = "&times;";
    closeButton.addEventListener("click", closeModal);

    const gallery = createGalleryModal();

    const modalTitle = document.createElement("p");
    modalTitle.textContent = "Galerie Photo";
    modalTitle.classList.add("modal-title");

    const addButton = document.createElement("button");
    addButton.classList.add("btn-envoyer");
    addButton.innerText = "Ajouter une photo";

    addButton.addEventListener("click", openAddPhotoModal);

    const deleteGalleryLink = document.createElement("a");
    deleteGalleryLink.href = "#";
    deleteGalleryLink.innerText = "Supprimer toute la galerie";

    deleteGalleryLink.addEventListener("click", (event) => {
        event.preventDefault();

        const token = localStorage.getItem("token");
        if (token) {
            const deletePromises = works.map((work) => {
                const url = `http://localhost:5678/api/works/${work.id}`;

                return fetch(url, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            });

            Promise.all(deletePromises)
                .then((responses) => {
                    const successfulDeletions = responses.filter((response) => response.ok);

                    if (successfulDeletions.length === works.length) {
                        works = [];
                        const sectionWorks = document.querySelector(".gallery");
                        sectionWorks.innerHTML = "";
                        closeModal();
                    } else {
                        console.error("Failed to delete gallery");
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        } else {
            console.log("Admin mode is not enabled");
        }
    });

    content.appendChild(closeButton);
    content.appendChild(modalTitle);
    content.appendChild(gallery);
    content.appendChild(separatorDiv);
    content.appendChild(addButton);
    content.appendChild(deleteGalleryLink);

    modal.appendChild(content);

    return modal;
}

function updateGallery() {
    const sectionWorks = document.querySelector(".gallery");
    sectionWorks.innerHTML = "";


    for (let i = 0; i < works.length; i++) {
        const workElement = document.createElement("div");
        const imageWork = document.createElement("img");
        const titleWork = document.createElement("p");

        imageWork.src = works[i].imageUrl;
        titleWork.innerText = works[i].title;

        workElement.appendChild(imageWork);
        workElement.appendChild(titleWork);
        sectionWorks.appendChild(workElement);
    }
}

/*********************************************************/

/****** Modal ajout photo ******/

// Fonction pour ouvrir le modal d'ajout de photo
function openAddPhotoModal() {
    const galleryModalContent = document.querySelector(".modal-content");
    galleryModalContent.style.display = "none";

    const addPhotoModalContent = createAddPhotoModal();
    galleryModalContent.parentNode.insertBefore(
        addPhotoModalContent,
        galleryModalContent
    );
}

// Fonction pour fermer le modal d'ajout de photo
function closeAddPhotoModal() {
    const addPhotoModalContent = document.querySelector(
        ".add-photo-modal-content"
    );
    addPhotoModalContent.remove();

    const galleryModalContent = document.querySelector(".modal-content");
    galleryModalContent.style.display = "flex";
}

// Fonction pour créer le contenu du modal d'ajout de photo

function createAddPhotoModal() {
    function handleImageSelection(event) {
        const file = event.target.files[0];

        if (file) {
            const fileSizeInBytes = file.size;
            const maxSizeInBytes = 4 * 1024 * 1024; // 4 Mo MAX

            if (fileSizeInBytes > maxSizeInBytes) {
                alert("La taille de l'image dépasse la limite de 4 Mo. Veuillez choisir une image plus petite.");
                return;
            }

            const reader = new FileReader();

            reader.onload = (event) => {
                addPhotoImage.src = event.target.result;

                // Supprime le contenu existant de la div
                addPictureDiv.innerHTML = "";

                // Créer un nouvel élément img pour l'aperçu avec un ID fixe
                const previewImage = document.createElement("img");
                previewImage.src = event.target.result;
                previewImage.classList.add("preview-image");
                previewImage.setAttribute("id", "preview-imageID");

                // Ajout de l'image de l'aperçu
                addPictureDiv.appendChild(previewImage);
            };

            reader.readAsDataURL(file);
        }
    }

    const addPhotoModalContent = document.createElement("div");
    addPhotoModalContent.classList.add("add-photo-modal-content");

    const buttonsRow = document.createElement("div");
    buttonsRow.classList.add("buttons-row");

    const addPhotoBackButton = document.createElement("button");
    addPhotoBackButton.classList.add("back-button");
    addPhotoBackButton.innerHTML = '<img src="./assets/icons/arrow-left.png" alt="Retour">';
    addPhotoBackButton.addEventListener("click", closeAddPhotoModal);


    const addPhotoCloseButton = document.createElement("span");
    addPhotoCloseButton.classList.add("close-button");
    addPhotoCloseButton.innerHTML = "&times;";
    addPhotoCloseButton.addEventListener("click", closeAddPhotoModal);

    buttonsRow.appendChild(addPhotoBackButton);
    buttonsRow.appendChild(addPhotoCloseButton);

    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("buttons-container");
    buttonsContainer.appendChild(buttonsRow);

    const addPhotoForm = document.createElement("form");
    addPhotoForm.addEventListener("submit", handleFormSubmit);

    const addPhotoTitle = document.createElement("p");
    addPhotoTitle.textContent = "Ajouter une photo";
    addPhotoTitle.classList.add("modal-title");

    const addPictureDiv = document.createElement("div");
    addPictureDiv.classList.add("add-picture-div");

    const addPhotoImage = document.createElement("img");
    addPhotoImage.classList.add("imagePlaceholder");
    addPhotoImage.src = "./assets/icons/picture-svgrepo-com 1.png";
    addPictureDiv.insertBefore(addPhotoImage, addPictureDiv.firstChild);

    const addPhotoFileInput = document.createElement("input");
    addPhotoFileInput.type = "file";
    addPhotoFileInput.accept = "image/jpg, image/png";
    addPhotoFileInput.style.display = "none";
    addPhotoFileInput.addEventListener("change", handleImageSelection);

    const addPhotoButton = document.createElement("label");
    addPhotoButton.innerText = "+ Ajouter photo";
    addPhotoButton.classList.add("add-photo-button");
    addPhotoButton.classList.add("custom-text-color");
    addPhotoButton.style.cursor = "pointer";
    addPhotoButton.setAttribute("for", "fileInput");

    addPhotoButton.addEventListener("click", () => {
        addPhotoFileInput.click();
    });

    addPictureDiv.appendChild(addPhotoFileInput);
    addPictureDiv.appendChild(addPhotoButton);

    const addPhotoInfo = document.createElement("p");
    addPhotoInfo.textContent = "jpg, png : 4mo max";
    addPictureDiv.appendChild(addPhotoInfo);

    const addPhotoTitleLabel = document.createElement("p");
    addPhotoTitleLabel.textContent = "Titre";

    const addPhotoInput = document.createElement("input");
    addPhotoInput.type = "text";
    addPhotoInput.classList.add("nice-input");

    const addPhotoCategoryLabel = document.createElement("p");
    addPhotoCategoryLabel.textContent = "Catégorie";

    const addPhotoCategorySelect = document.createElement("select");
    addPhotoCategorySelect.classList.add("nice-input");

    const addPhotoCategoryEmptyOption = document.createElement("option");
    addPhotoCategoryEmptyOption.value = "";
    addPhotoCategorySelect.appendChild(addPhotoCategoryEmptyOption);

    for (let i = 0; i < categories.length; i++) {
        const option = document.createElement("option");
        option.value = categories[i].id;
        option.text = categories[i].name;
        addPhotoCategorySelect.appendChild(option);
    }

    const addPhotoSubmitButton = document.createElement("button");
    addPhotoSubmitButton.classList.add("btn-envoyer");
    addPhotoSubmitButton.innerText = "Ajouter";

    const separatorDiv = document.createElement("div");
    separatorDiv.classList.add("separator");

    // Formualaire 

    function handleFormSubmit(event) {
        event.preventDefault();

        const title = addPhotoInput.value;
        const category = addPhotoCategorySelect.value;
        const file = addPhotoFileInput.files[0];

        if (!title || !category || !file) {
            alert("Veuillez remplir tous les champs avant d'ajouter le projet.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("category", category);
        formData.append("image", file);

        fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: formData,
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.error("Failed to add work");
                }
            })
            .then((newWork) => {
                works.push(newWork);
                addWorkToGallery(newWork);

                closeModal();
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    // Fonction pour ajouter un travail à la galerie
    function addWorkToGallery(work) {
        const sectionWorks = document.querySelector(".gallery");
        const workElement = document.createElement("div");
        const imageWork = document.createElement("img");
        const titleWork = document.createElement("p");

        imageWork.src = work.imageUrl;
        titleWork.innerText = work.title;

        workElement.appendChild(imageWork);
        workElement.appendChild(titleWork);
        sectionWorks.appendChild(workElement);
    }

    addPhotoForm.appendChild(addPictureDiv);
    addPhotoForm.appendChild(addPhotoTitleLabel);
    addPhotoForm.appendChild(addPhotoInput);
    addPhotoForm.appendChild(addPhotoCategoryLabel);
    addPhotoForm.appendChild(addPhotoCategorySelect);

    addPhotoForm.appendChild(separatorDiv);

    addPhotoForm.appendChild(addPhotoSubmitButton);

    addPhotoModalContent.appendChild(buttonsContainer);
    addPhotoModalContent.appendChild(addPhotoTitle);
    addPhotoModalContent.appendChild(addPhotoForm);

    return addPhotoModalContent;
}

// BEST VERSION procedural

gallery.insertAdjacentHTML("beforeend",
    `
            <figure>
				<img src="${info.imageUrl}" alt="${info.title}">
				<figcaption>${info.title}</figcaption>
			</figure>
        `
);

