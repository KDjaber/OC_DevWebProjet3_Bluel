// API endpoint for works
const apiUrl = 'http://localhost:5678/api/';

// GET request to fetch api/works
let allWorks
let btnContainer = document.querySelector(".gallery-filters")
let addPhotoInput = document.getElementById("addphoto-input")
let photoTitle = document.getElementById("title")
let photoCategory = document.getElementById("select-category")
let modalWorks = document.getElementById("modal-works")
let modalGoBack = document.getElementById("modal-goback")
let modalTitle = document.getElementById("modaltitle")
let modalChange = document.getElementById("modal-change-gallery")
let addPhotoBtn = document.getElementById("add-photo")
let acceptChangesBtn = document.getElementById("accept-changes")
let imagePreview 
let photoIcons = document.getElementById("photo-icons")

const categoriesResponse = await fetch(apiUrl+"categories")
const categories = await categoriesResponse.json()

async function displayGallery() {
    try {
        const response = await fetch(apiUrl+"works")
        allWorks = await response.json()
        console.log('allWokrs', allWorks)
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
    }
    
    for (let i = 0; i < works.length; i++) {

        const project = works[i]
        
        
        const worksProject = document.createElement("figure")
        worksProject.id = project.id
        const projectImage = document.createElement("img")
        projectImage.src = project.imageUrl
        const projectCaption = document.createElement("figcaption")
        projectCaption.innerText = project.title

        worksGallery.appendChild(worksProject)
        worksProject.appendChild(projectImage)
        worksProject.appendChild(projectCaption)

    }
}

//Different categories available + filtering works
function displayCategories() {
    try {
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

//Definition of functions used for the modal

function showModal() {
    modalContainer.classList.remove('hidden')
}
function hideModal() {
    modalContainer.classList.add('hidden')
}

async function deleteWork(id) {
    let confirmation = confirm("Voulez-vous supprimer ce projet ?")
    if (confirmation == true) {
        await fetch(`${apiUrl}works/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${userToken}`
            }
        })
        await displayGallery()
        displayModalHomepage()
    }
}

async function addWork() {
    const formElement = document.getElementById("addphoto-form")
    const formData = new FormData(formElement)
    if (addPhotoInput.value == "" || photoTitle.value == "" || photoCategory.value == "") {
        alert("Veuillez remplir tous les champs.")
        return
    } 
    await fetch(`${apiUrl}works`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${userToken}`
        },
        body: formData
    })
    await displayGallery()
    displayModalHomepage()
}

function displayWorksInGallery() {
    modalWorks.innerHTML = ""
    allWorks.forEach(element => {
        let figure = document.createElement("figure")
        let img = document.createElement("img")
        let i = document.createElement("i")
        i.setAttribute("class", "fa-solid fa-trash-can")
        img.src = element.imageUrl
        figure.setAttribute("id", element.id)
        figure.appendChild(img)
        figure.appendChild(i)
        modalWorks.appendChild(figure)
        i.addEventListener('click', () => {
            deleteWork(element.id)
        })
    });

}

function addPhotoCategories() {
    for (let i = 0; i < categories.length; i++) {
        const option = document.createElement("option")
        option.setAttribute("value", categories[i].id)
        option.innerText = categories[i].name
        photoCategory.appendChild(option)
    }
}

function displayModalHomepage() {
    modalGoBack.classList.add("hidden")
    modalTitle.innerHTML = "Galerie photo"
    displayWorksInGallery()
    modalChange.classList.add("hidden")
    addPhotoBtn.classList.remove("hidden")
    acceptChangesBtn.classList.add("hidden")
}

function displayAddPhotoPage() {
    modalGoBack.classList.remove("hidden")
    modalTitle.innerHTML = "Ajout photo"
    modalWorks.innerHTML = ""
    modalChange.classList.remove("hidden")
    addPhotoBtn.classList.add("hidden")
    acceptChangesBtn.classList.remove("hidden")
    addPhotoCategories()
}

function resetForm() {
    if (imagePreview) {
        imagePreview.remove()
        photoIcons.style.display = "flex"
        photoTitle.value=""
        photoCategory.value=""
        photoCategory.innerHTML=""
        photoCategory = document.getElementById("select-category")
        addPhotoInput.value=""
    }
}

function verifyForm() {
    if (addPhotoInput.value !== "" && photoTitle.value !== "" && photoCategory.value !== "") {
        acceptChangesBtn.classList.add("accept-changes-ok")
    } else {
        acceptChangesBtn.classList.remove("accept-changes-ok")
    }
}

addPhotoInput.addEventListener('change', verifyForm)
photoTitle.addEventListener('change', verifyForm)
photoCategory.addEventListener('change', verifyForm)

const loginNavLink = document.getElementById("login-nav-link")
const modalContainer = document.getElementById("modifyprojects-modal")

// Homepage change after login + Display/hiding of modal
const userToken = window.localStorage.getItem("token")
if (userToken === null) {
    loginNavLink.innerText = "login"
    displayCategories()
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
        showModal()
        displayModalHomepage()
    })

    addPhotoBtn.addEventListener('click', () => {
        resetForm()
        displayAddPhotoPage()
    })

    addPhotoInput.addEventListener("change", () => {
        let maxPhotoSize = 4*1024*1024;
        if (addPhotoInput.files[0].size > maxPhotoSize) {
            alert("Image trop volumineuse.")
        } else {
            imagePreview = document.createElement("img")
            imagePreview.setAttribute("id", "form-image-preview")
            imagePreview.src = URL.createObjectURL(addPhotoInput.files[0])
            const photoPreviewContainer = document.getElementById("addphoto-preview")
            photoPreviewContainer.appendChild(imagePreview)
            photoIcons.style.display = "none"
        }
    })

    acceptChangesBtn.addEventListener("click", addWork)

    modalGoBack.addEventListener('click', () => {
        displayModalHomepage()
    })

    const closeModal = document.getElementById("modal-xmark")
    closeModal.addEventListener('click', () => {
        hideModal()
    })

    modalContainer.addEventListener('click', function(event) {
    const modal = document.getElementById('modal-wrapper')
        if (event.target !== modal && !modal.contains(event.target)) {
            hideModal()
        }
    }, false)
}
