// API endpoint for works
const apiUrl = 'http://localhost:5678/api/';

// GET request to fetch api/works
let allWorks
let btnContainer = document.querySelector(".gallery-filters")

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

displayCategories()

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
    let photo = document.getElementById("addphoto-input")
    let title = document.getElementById("title")
    let category = document.getElementById("select-category")
    if (photo.value == "" || title.value == "" || category.value == "") {
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
    let div = document.getElementById("modal-works")
    div.innerHTML = ""
    allWorks.forEach(element => {
        let figure = document.createElement("figure")
        let img = document.createElement("img")
        let i = document.createElement("i")
        i.setAttribute("class", "fa-solid fa-trash-can")
        img.src = element.imageUrl
        figure.setAttribute("id", element.id)
        figure.appendChild(img)
        figure.appendChild(i)
        div.appendChild(figure)
        i.addEventListener('click', () => {
            deleteWork(element.id)
        })
    });

}

function addPhotoCategories() {
    for (let i = 0; i < categories.length; i++) {
        const selector = document.getElementById("select-category")
        const option = document.createElement("option")
        option.setAttribute("value", categories[i].id)
        option.innerText = categories[i].name
        selector.appendChild(option)
    }
}

function displayModalHomepage() {
    document.getElementById("modal-goback").classList.add("hidden")
    document.getElementById("modaltitle").innerHTML = "Galerie photo"
    displayWorksInGallery()
    document.getElementById("modal-change-gallery").classList.add("hidden")
    document.getElementById("add-photo").classList.remove("hidden")
    document.getElementById("accept-changes").classList.add("hidden")
}

function displayAddPhotoPage() {
    document.getElementById("modal-goback").classList.remove("hidden")
    document.getElementById("modaltitle").innerHTML = "Ajout photo"
    document.getElementById("modal-works").innerHTML = ""
    document.getElementById("modal-change-gallery").classList.remove("hidden")
    document.getElementById("add-photo").classList.add("hidden")
    document.getElementById("accept-changes").classList.remove("hidden")
    addPhotoCategories()
}

function resetForm() {
    if (document.getElementById("form-image-preview") !== null) {
        document.getElementById("form-image-preview").remove()
        document.getElementById("photo-icons").style.display = "flex"
        document.getElementById("title").value=""
        document.getElementById("select-category").value=""
        document.getElementById("select-category").innerHTML=""
        document.getElementById("addphoto-input").value=""
    }
}

function verifyForm() {
    let photo = document.getElementById("addphoto-input")
    let title = document.getElementById("title")
    let category = document.getElementById("select-category")
    if (photo.value !== "" && title.value !== "" && category.value !== "") {
        document.getElementById("accept-changes").classList.add("accept-changes-ok")
    } else {
        document.getElementById("accept-changes").classList.remove("accept-changes-ok")
    }
}

document.getElementById("addphoto-input").addEventListener('change', verifyForm)
document.getElementById("title").addEventListener('change', verifyForm)
document.getElementById("select-category").addEventListener('change', verifyForm)

const loginNavLink = document.getElementById("login-nav-link")
const modalContainer = document.getElementById("modifyprojects-modal")

// Homepage change after login + Display/hiding of modal
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
        showModal()
        displayModalHomepage()
    })

    document.getElementById("add-photo").addEventListener('click', () => {
        resetForm()
        displayAddPhotoPage()
    })

    document.getElementById("addphoto-input").addEventListener("change", () => {
        let photoInput = document.getElementById("addphoto-input")
        let maxPhotoSize = 4*1024*1024;
        if (photoInput.files[0].size > maxPhotoSize) {
            alert("Image trop volumineuse.")
        } else {
            let imagePreview = document.createElement("img")
            imagePreview.setAttribute("id", "form-image-preview")
            imagePreview.src = URL.createObjectURL(photoInput.files[0])
            const photoPreviewContainer = document.getElementById("addphoto-preview")
            photoPreviewContainer.appendChild(imagePreview)
            document.getElementById("photo-icons").style.display = "none"
        }
    })

    document.getElementById("accept-changes").addEventListener("click", addWork)

    document.getElementById("modal-goback").addEventListener('click', () => {
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
