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

    let works = allWorks
    if (categoriesID) {
        works = allWorks.filter((work)=> {
            return work.categoryId == categoriesID
        })
        console.log(works)
    }
    
    for (let i = 0; i < works.length; i++) {

        const project = works[i]
        
        
        const worksProject = document.createElement("figure")
        worksProject.dataset.id = project.id
        const projectImage = document.createElement("img")
        projectImage.src = project.imageUrl
        const projectCaption = document.createElement("figcaption")
        projectCaption.innerText = project.title

        worksGallery.appendChild(worksProject)
        worksProject.appendChild(projectImage)
        worksProject.appendChild(projectCaption)

    }
}

async function displayCategories() {
    try {
        const response = await fetch(apiUrl+"categories")
        categories = await response.json()
        let btn = document.createElement("button")
        btn.innerText = "Tous"
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

const loginNavLink = document.getElementById("login-nav-link")

const userToken = window.localStorage.getItem("token")
if (userToken === null) {
    loginNavLink.innerText = "login"
} else {
    loginNavLink.innerText = "logout"
    loginNavLink.setAttribute("href", "#")
    loginNavLink.addEventListener('click', () => {
        window.localStorage.removeItem("token")
        window.location.reload()
    })

    document.getElementById("editing-banner").classList.remove('hidden')

    const modifyProjectsBtn = document.getElementById("modify-projects")
    modifyProjectsBtn.classList.remove('hidden')
    modifyProjectsBtn.addEventListener('click', () => {
        document.getElementById("modifyprojects-modal").classList.remove('hidden')
        displayWorksInGallery()
    })
}

function displayWorksInGallery() {
    let div = document.getElementById("modal-works")
    console.log(div)
    allWorks.forEach(element => {
        let figure = document.createElement("figure")
        let img = document.createElement("img")
        let i = document.createElement("i")
        i.setAttribute("class", "fa-solid fa-trash-can")
        img.src = element.imageUrl
        figure.appendChild(img)
        figure.appendChild(i)
        div.appendChild(figure)
        i.addEventListener('click', () => {
            console.log("id à supprimer", element.id)
        })
    });
}