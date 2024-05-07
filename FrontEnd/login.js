//Adds event listener to login form in html
function setUpAuthListener() {
    const formAuth = document.querySelector(".form_auth");
    formAuth.addEventListener("submit", userAuth);
}

//Adds userAuth event to get form values
async function userAuth(event) {
    event.preventDefault();
    const userEmailElement = document.querySelector("#login_email");
    const userPasswordElement = document.querySelector("#login_password");
    const loginData = {
        email: userEmailElement.value,
        password: userPasswordElement.value
    }
    console.log('loginData', loginData)
    
//Post values in api & await response
    const loginResponse = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData)
    });

    const loginResult = await loginResponse.json()

//Returns response depending on status
    if (loginResponse.status === 200) {
        window.localStorage.setItem("token", loginResult.token);
        window.location.href = "index.html"
    } else if (loginResponse.status === 401) {
        alert("Identifiant ou mot de passe incorrects.")
    } else if (loginResponse.status === 404) {
        alert(loginResult.message)
    }
}

setUpAuthListener()