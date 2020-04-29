window.addEventListener("DOMContentLoaded", function(e){
    console.log("The DOM has been loaded")
    const dogBar = document.getElementById("dog-bar")
    const baseUrl = "http://localhost:3000/pups"

    fetch(baseUrl)
        .then(response => response.json())
        .then(json => json.forEach(loadDog))

    function loadDog(dog){
        let span = document.createElement("span")
        dogBar.append(span)
        span.textContent = dog.name
        span.dataset.id = dog.id
    }

    dogBar.addEventListener("click",function(e){
        let id = e.target.dataset.id
        loadDogInfoToDOM(id)
    })

    const dogInfoDiv = document.getElementById("dog-info")

    function loadDogInfoToDOM(id){
        fetch(`${baseUrl}/${id}`)
        .then(response => response.json())
        .then(dog => {
            dogInfoDiv.innerHTML = ""
            const img = document.createElement("img")
            const h2 = document.createElement("h2")
            const button = document.createElement("button")
            dogInfoDiv.dataset.id = dog.id
            img.src = dog.image
            h2.textContent = dog.name
            button.textContent = dog.isGood ? "Good Dog!" : "Bad Dog!"
            dogInfoDiv.append(img, h2, button)
        })
    }

    //√make click listener
    //√change text from Good to Bad etc. 
    //√update db with new isGood value PATCH 
    dogInfoDiv.addEventListener("click", (e) => {
        const dogButton = e.target
        const dogId = (e.target.parentNode.dataset.id)
        if (dogButton.textContent === "Bad Dog!"){
            dogButton.textContent = "Good Dog!"
            fetch(`${baseUrl}/${dogId}`, {
                method: 'PATCH',
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json'
                },
                body: JSON.stringify({isGoodDog: true})
                })
                .then(response => response.json())
                .then(json => console.log(json))

        } else if (dogButton.textContent === "Good Dog!"){
            dogButton.textContent = "Bad Dog!"
            fetch(`${baseUrl}/${dogId}`, {
                method: 'PATCH',
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json'
                },
                body: JSON.stringify({isGoodDog: false})
                })
                .then(response => response.json())
                .then(json => console.log(json))
        }
    })
//END OF THE DOM CONTENT LISTENER
})