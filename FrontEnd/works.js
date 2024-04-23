// API endpoint for works
const apiUrl = 'http://localhost:5678/api/';

// GET request to fetch api/works
let allWorks
let categories
let btnContainer = document.querySelector(".gallery-filters")

async function displayGallery() {
    try {
        const response = await fetch(apiUrl+"works")
        allWorks = await response.json()
        displayWorks();
    } catch (e) {
        console.error("fetch error", e)
    }
}

displayGallery()

// Display api/works on homepage
function displayWorks(categoriesID = null) {
    const worksGallery = document.querySelector(".gallery");
    worksGallery.innerHTML = ""
    console.log(categoriesID)
    let works = allWorks
    if (categoriesID) {
        works = allWorks.filter((work)=> {
            return work.categoryId == categoriesID
        })
        console.log(works)
    }
    
    for (let i = 0; i < works.length; i++) {

        const project = works[i];
        
        
        const worksProject = document.createElement("figure");
        worksProject.dataset.id = project.id;
        const projectImage = document.createElement("img");
        projectImage.src = project.imageUrl;
        const projectCaption = document.createElement("figcaption");
        projectCaption.innerText = project.title;

        worksGallery.appendChild(worksProject);
        worksProject.appendChild(projectImage);
        worksProject.appendChild(projectCaption);

    }
}

async function displayCategories() {
    try {
        const response = await fetch(apiUrl+"categories")
        categories = await response.json()
        let btn = document.createElement("button");
        btn.innerText = "Tous";
        btnContainer.appendChild(btn)
        btn.addEventListener("click", () => {
            displayWorks()
        })
        for (let i = 0; i < categories.length; i++) {
            let btn = document.createElement("button");
            btn.innerText = categories[i].name;
            btnContainer.appendChild(btn)
            btn.addEventListener("click", () => {
                displayWorks(categories[i].id)
            })
        }
    } catch (e) {
        console.error("fetch error", e)
    }
}


displayCategories()