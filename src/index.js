
baseURL = "http://localhost:3000/pups"

document.addEventListener('DOMContentLoaded', (event) => {

const dogBar = document.querySelector("#dog-bar")
const moreInfo = document.querySelector("#dog-summary-container")

function allDogsBar() {
fetch(baseURL)
.then(response => response.json())
.then(dogs => {
    dogs.forEach(dog => {
        renderDog(dog)
    }) // end of forEach
}) // end of fetch 
} //end of all dogs bar 

function goodDogsOnly() {
    fetch(baseURL)
    .then(response => response.json())
    .then(dogs => {
        dogs.forEach(dog => {
            if (dog.isGoodDog){
            renderDog(dog)
            }
        }) // end of forEach
    }) // end of fetch   
}

document.addEventListener("click", function(e){
    if (e.target.className === 'pup-span') {
        const pupID = e.target.dataset.id
            fetch(`${baseURL}/${pupID}`)
            .then(response => response.json())
            .then(dog => {
                moreInfo.innerHTML = ''
                renderDog2(dog)
        }) // end of fetch 

    } // end of "if click is on dog bar span"

    else if (e.target.className === "good-dog"){
        const button = e.target
        const dogID = e.target.parentNode.dataset.id
        fetch(`${baseURL}/${dogID}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({isGoodDog: false})
          }) // end of fetch
          .then(response => {
            button.innerText = "Bad Dog!"
            button.className = "bad-dog"
          })

    } // end of else if "good-dog"

    else if (e.target.className === "bad-dog"){
        const button = e.target
        const dogID = e.target.parentNode.dataset.id
        fetch(`${baseURL}/${dogID}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({isGoodDog: true})
          }) // end of fetch
          .then(response => {
            button.innerText = "Good Dog!"
            button.className = "good-dog"
          })

    } // end of else if "bad-dog"

    else if (e.target.className === "good-dog-filter") {
        if (e.target.id === "off"){
            e.target.id = "on"
            dogBar.innerHTML = ''
            goodDogsOnly()
        }
        else {
            e.target.id = "off"
            dogBar.innerHTML = ''
            allDogsBar()
        }

    } //end of good dog filter if case

}) // end of event listener

function renderDog(dog) {
   const span = document.createElement('span')
   span.dataset.id = dog.id
   span.className = "pup-span"
   span.innerText = `${dog.name}`
   dogBar.append(span)
}

function renderDog2(dog) {
   const div = document.createElement('div')
   div.dataset.id = dog.id
   if (dog.isGoodDog){
   div.innerHTML = `
        <img src="${dog.image}">
        <h2>${dog.name}</h2>
        <button class="good-dog">Good Dog!</button>
        `
   }

   else { 
    div.innerHTML = `
    <img src="${dog.image}">
    <h2>${dog.name}</h2>
    <button class="bad-dog">Bad Dog!</button>
    `
   }

   moreInfo.append(div)
} //end of full single dog render

allDogsBar()

}) // end of Dom Content Loaded