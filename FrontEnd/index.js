async function loadApi() {
    await fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(data => (works = data));

    for (let i = 0; i < works.length; i++) {

        const sectionWorks = document.querySelector(".gallery");
        const workElement = document.createElement("work");
        const imageWork = document.createElement("img");
        const titleWork = document.createElement("p");

        imageWork.src = works[i].imageUrl;
        titleWork.innerText = works[i].title;

        sectionWorks.appendChild(workElement);
        workElement.appendChild(imageWork);
        workElement.appendChild(titleWork);

        console.log(titleWork)
    }
}

loadApi();







