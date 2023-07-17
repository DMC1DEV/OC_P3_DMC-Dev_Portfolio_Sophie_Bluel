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

/****** Admin mode *****/

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
    logoutButton.innerText = "Log out";

    editButtonDiv.appendChild(editButton);
    logoutButtonDiv.appendChild(logoutButton);

    editButton.addEventListener("click", openModal);

    logoutButton.addEventListener("click", function () {
        localStorage.removeItem("token");
        window.location.href = "index.html";
    });

    const adminModePanelDiv = document.createElement("div");
    adminModePanelDiv.classList.add("adminmodepanel");
    const adminModePanel = document.createElement("div");
    adminModePanel.id = "adminmodepanel-banner";
    const adminModePanelButton = document.createElement("button");
    adminModePanelButton.innerText = "Mode édition";

    adminModePanel.appendChild(adminModePanelButton);
    adminModePanelDiv.appendChild(adminModePanel);
    editButtonDiv.parentNode.insertBefore(
        adminModePanelDiv,
        editButtonDiv.nextSibling
    );
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

            imageWork.src = works[i].imageUrl;
            titleWork.innerText = "editer";

            deleteIcon.classList.add("fas", "fa-trash-alt", "delete-icon");
            deleteLink.appendChild(deleteIcon);
            deleteLink.href = "#";
            deleteLink.id = "trash-icon";

            deleteLink.addEventListener("click", (event) => {
                event.preventDefault();

                const token = localStorage.getItem("token");
                if (token) {
                    const workId = works[i].id;
                    const url = `http://localhost:5678/api/works/${workId}`;

                    fetch(url, {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                        .then((response) => {
                            if (response.ok) {
                                works = works.filter((work) => work.id !== workId);
                                workElement.remove(); // Supprimer l'élément du DOM
                            } else {
                                console.error("Failed to delete work");
                            }
                        })
                        .catch((error) => {
                            console.error("Error:", error);
                        });
                } else {
                    console.log("Admin mode is not enabled");
                }
            });

            workElement.classList.add("gallery-card");

            workElement.appendChild(imageWork);
            workElement.appendChild(deleteLink);
            workElement.appendChild(titleWork);
            gallery.appendChild(workElement);
        }

        return gallery;
    }

    const modal = document.createElement("div");
    modal.classList.add("modal");

    const content = document.createElement("div");
    content.classList.add("modal-content");

    const closeButton = document.createElement("span");
    closeButton.classList.add("close-button");
    closeButton.innerHTML = "&times;";
    closeButton.addEventListener("click", closeModal);

    const gallery = createGalleryModal();

    const modalTitle = document.createElement("p");
    modalTitle.textContent = "Galerie Photo";
    modalTitle.classList.add("modal-title");

    const addButton = document.createElement("button");
    addButton.classList.add("btn");
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
    content.appendChild(addButton);
    content.appendChild(deleteGalleryLink);

    modal.appendChild(content);

    return modal;
}

/********************************************************************/

/****** Modal ajout photo ******/

function openAddPhotoModal() {
    const galleryModalContent = document.querySelector(".modal-content");
    galleryModalContent.style.display = "none";

    const addPhotoModalContent = createAddPhotoModal();
    galleryModalContent.parentNode.insertBefore(
        addPhotoModalContent,
        galleryModalContent
    );
}

function closeAddPhotoModal() {
    const addPhotoModalContent = document.querySelector(
        ".add-photo-modal-content"
    );
    addPhotoModalContent.remove();

    const galleryModalContent = document.querySelector(".modal-content");
    galleryModalContent.style.display = "block";
}

function createAddPhotoModal() {
    const addPhotoModalContent = document.createElement("div");
    addPhotoModalContent.classList.add("add-photo-modal-content");

    const buttonsRow = document.createElement("div");
    buttonsRow.classList.add("buttons-row");

    const addPhotoBackButton = document.createElement("button");
    addPhotoBackButton.classList.add("back-button");
    addPhotoBackButton.innerHTML = "&#8249;";
    addPhotoBackButton.addEventListener("click", closeAddPhotoModal);

    const addPhotoCloseButton = document.createElement("span");
    addPhotoCloseButton.classList.add("close-button");
    addPhotoCloseButton.innerHTML = "&times;";
    addPhotoCloseButton.addEventListener("click", closeAddPhotoModal);

    buttonsRow.appendChild(addPhotoBackButton);
    buttonsRow.appendChild(addPhotoCloseButton);

    const addPhotoTitle = document.createElement("p");
    addPhotoTitle.textContent = "Ajouter une photo";
    addPhotoTitle.classList.add("modal-title");

    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("buttons-container");
    buttonsContainer.appendChild(buttonsRow);

    const addPhotoForm = document.createElement("form");
    addPhotoForm.addEventListener("submit", handleFormSubmit);

    const addPhotoFileInput = document.createElement("input");
    addPhotoFileInput.type = "file";
    addPhotoFileInput.accept = "image/*";

    const addPhotoPreviewImage = document.createElement("img");
    addPhotoPreviewImage.classList.add("photo-preview");

    const addPhotoTitleLabel = document.createElement("p");
    addPhotoTitleLabel.textContent = "Titre";

    const addPhotoInput = document.createElement("input");
    addPhotoInput.type = "text";
    addPhotoInput.placeholder = "Titre de la photo";

    const addPhotoCategoryLabel = document.createElement("p");
    addPhotoCategoryLabel.textContent = "Catégorie";

    const addPhotoCategorySelect = document.createElement("select");
    addPhotoCategorySelect.placeholder = "Choisir une catégorie...";
    for (let i = 0; i < categories.length; i++) {
        const option = document.createElement("option");
        option.value = categories[i].id;
        option.text = categories[i].name;
        addPhotoCategorySelect.appendChild(option);
    }

    const addPhotoSubmitButton = document.createElement("button");
    addPhotoSubmitButton.classList.add("btn");
    addPhotoSubmitButton.innerText = "Ajouter";

    function handleFormSubmit(event) {
        event.preventDefault();

        const title = addPhotoInput.value;
        const category = addPhotoCategorySelect.value;
        const file = addPhotoFileInput.files[0];

        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        formData.append('image', file);

        // Envoi de la demande POST à l'API pour ajouter un nouveau work
        fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
        })
            .then(response => {
                if (response.ok) {
                    closeModal();
                    loadApi();
                } else {
                    console.error('Failed to add work');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    addPhotoForm.appendChild(addPhotoFileInput);
    addPhotoForm.appendChild(addPhotoPreviewImage);
    addPhotoForm.appendChild(addPhotoTitleLabel);
    addPhotoForm.appendChild(addPhotoInput);
    addPhotoForm.appendChild(addPhotoCategoryLabel);
    addPhotoForm.appendChild(addPhotoCategorySelect);
    addPhotoForm.appendChild(addPhotoSubmitButton);

    addPhotoModalContent.appendChild(buttonsContainer);
    addPhotoModalContent.appendChild(addPhotoTitle);
    addPhotoModalContent.appendChild(addPhotoForm);

    return addPhotoModalContent;
}
