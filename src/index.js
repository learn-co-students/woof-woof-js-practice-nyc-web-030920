
const baseURL = "http://localhost:3000/pups";

let dogBar = null;
let dogInfo = null;
let dogFilter = null;

const headers = {
    "content-type": "application/json",
    "accept": "application/json"
}

document.addEventListener("DOMContentLoaded", event => {

    dogBar = document.getElementById("dog-bar");
    dogInfo = document.getElementById("dog-info");
    dogFilter = document.getElementById("good-dog-filter");

    setupDogInfoClick();
    setupGoodBadToggle();
    setupGoodFilter();
    
    getDogs();
});

// setup
function setupDogInfoClick(){
    dogBar.addEventListener("click", event => {
        if(event.target.tagName === "SPAN"){
            displayDogInfo(event.target);
        }
    })
}

function setupGoodBadToggle(){
    dogInfo.addEventListener("click", event => {
        if(event.target.className === "goodToggle"){
            goodBadToggle(event.target);
        }
    });
}

function setupGoodFilter(){
    dogFilter.addEventListener("click", event => {
        goodDogFilter(dogFilter);
    });
}

// get the dogs
function getDogs(){
    fetch(baseURL)
    .then(res => res.json())
    .then(data => {
        displayDogs(data);
    })
    .catch(err => console.log("error", err));
}

// display the dogs
function displayDogs(dogs){
    dogs.forEach(dog => {
        displayIndividualDog(dog);
    });
}

// display individual dog
function displayIndividualDog(dog){
    dogSpan = document.createElement("span");
    dogSpan.innerText = dog.name;
    dogSpan.dataset.id = dog.id;
    dogSpan.dataset.name = dog.name;
    dogSpan.dataset.image = dog.image;
    dogSpan.dataset.good = dog.isGoodDog;
    dogBar.append(dogSpan);
}

// show dog details
function displayDogInfo(dogSpan){
    dogInfo.dataset.id = dogSpan.dataset.id;
    dogInfo.dataset.good = dogSpan.dataset.good;

    dogInfo.innerHTML = `
        <img src=${dogSpan.dataset.image}> 
        <h2>${dogSpan.dataset.name}</h2> 
        <button class="goodToggle">${(dogSpan.dataset.good === "true" ? "Good": "Bad")} Dog!</button>
    `;
}

// good/bad dog toggle
function goodBadToggle(button){    
    const id = dogInfo.dataset.id;
    let valueToSet = null;

    if(dogInfo.dataset.good === "true"){
        valueToSet = false;
    }
    else{
        valueToSet = true;
    }

    fetch(`${baseURL}/${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({isGoodDog: valueToSet})
    })
    .then(res => {
        const dogSpan = document.querySelector(`span[data-id="${id}"]`)
        dogSpan.dataset.good = valueToSet;
        if(valueToSet){
            button.innerHTML = "Good Dog!";
        }
        else{
            button.innerHTML = "Bad Dog!";
        }
    })
    .catch(err => console.log("Error", err));

}

// good dog filter
function goodDogFilter(button){
    if(button.dataset.filter === "off"){
        hideBad();
        button.innerText = "Filter good dogs: ON";
        button.dataset.filter = "on";
    }
    else{
        button.dataset.filter = "off";
        button.innerText = "Filter good dogs: OFF";
        showBad();
    }
}

function showBad(){
    Array.from(dogBar.children).forEach(dogSpan => {
        if(dogSpan.dataset.good === "false"){
            dogSpan.style.removeProperty("display");
        }
    });
}

function hideBad(){
    Array.from(dogBar.children).forEach(dogSpan => {
        if(dogSpan.dataset.good === "false"){
            dogSpan.style.display = "none";
        }
    });
}