// STEP 1: run json database to see the doggos
// STEP 2: Add pups to DOM || div with id= dog-bar
// dog name will be in span 
// <span>dog name <span>
// when user clicks span <div id='dog-info'> should hold <img> <h2> pup name <button> good or bad dog
let dogUrl = `http://localhost:3000/pups`
let pupContainer = document.getElementById('dog-bar')// Container
let pupInfo = document.getElementById('dog-info')// Span Click Container

document.addEventListener('DOMContentLoaded', event => {
    // GET ALL MY DOGS
    DogsToDOM()
})

function DogsToDOM() {
    fetch(dogUrl)
        .then(resp => resp.json())
        .then(json => json.forEach(hash => {
            appendToDOM(hash)
        }))
}

function appendToDOM(hash) {
    let nameSpan = document.createElement('span')
    nameSpan.innerText = hash.name
    pupContainer.appendChild(nameSpan)

    nameSpan.addEventListener('click', event => {
        pupInfo.innerHTML = ''
        let image = document.createElement('img')
        let source = document.createAttribute('src')
        source.value = hash.image
        image.setAttributeNode(source)
        pupInfo.appendChild(image)

        let name = document.createElement('h2')
        let id = document.createAttribute('id')
        id.value = hash.id
        name.setAttributeNode(id)
        name.innerText = nameSpan.innerText
        pupInfo.appendChild(name)

        let button = document.createElement('button')
        button.dataset.value = hash.id
        // let p_id = document.createAttribute('p_id')
        // p_id.value = hash.id
        // button.setAttributeNode(p_id)

        if (hash.isGoodDog === true) {
            button.innerText = "Good Dog!"
        }
        else {
            button.innerText = "Bad Dog!"
        }
        pupInfo.appendChild(button) //<div></div>

        button.addEventListener('click',event=> {
            goodBadDog(event.target) 
        })
    })
}

function goodBadDog(button){
    if(button.innerText ==="Good Dog!"){
        button.innerText = "Bad Dog!"
        fetch(`http://localhost:3000/pups/${button.dataset.value}`,{
            method:"PATCH",
            headers: {
                "content-type": 'application/json',
                "accept":'application/json'
            },
            body: JSON.stringify({
                isGoodDog: false
            })
        }).then(resp => resp.json())
        .then(json => console.log(json))

    }else if(button.innerText ==="Bad Dog!"){
        button.innerText = "Good Dog!"
        fetch(`http://localhost:3000/pups/${button.dataset.value}`,{
            method:"PATCH",
            headers: {
                "content-type": 'application/json',
                "accept":'application/json'
            },
            body: JSON.stringify({
                isGoodDog: true
            })
        }).then(resp => resp.json())
        .then(json => console.log(json))
    }
}