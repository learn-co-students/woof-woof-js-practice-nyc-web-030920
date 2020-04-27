document.addEventListener("DOMContentLoaded", () => {

   const dogBar =  document.getElementById("dog-bar")
   const dogInfoDiv = document.querySelector('#dog-info')
   const  goodDogFilter = document.querySelector('#good-dog-filter')
   goodDogFilter.addEventListener("click", filterDogs)
   
   fetchDogs()

   function fetchDogs() {
       fetch("http://localhost:3000/pups")
       .then(r => r.json())
      .then(dogs => renderDogBar(dogs))
   }

   function renderDogBar(dogs){

    dogs.forEach(dog => addDogToDogBar(dog))
   }

   function addDogToDogBar(dog){
    const span = document.createElement("span")
    span.innerText = dog.name
    // we set and id for each dog with settAtribute
    span.setAttribute("data-id", dog.id)
    
    span.addEventListener("click", showDogInfo )
    dogBar.append(span)
   }

   function showDogInfo(event) {
     const dogId = event.target.dataset.id
     fetch(`http://localhost:3000/pups/${dogId}`)
     .then(response => response.json())
     .then(dog => {
         const goodOrBad = dog.isGoodDog ? "Good dog!" : "Bad dog!"
        dogInfoDiv.innerHTML = `<img src = "${dog.image}"
        <h2>${dog.name}</h2>
        <button data-id = ${dog.id}> ${goodOrBad}</button>`
        const button = dogInfoDiv.querySelector('button')
        button.addEventListener("click", toggleDog)
     })

   }

   function toggleDog(event){
       const goodOrBad = event.target.innerText.slice(0,-5)
       const isGoodDog = goodOrBad === "Good" ? true : false
       const newStatus = isGoodDog ? "Bad dog!" : "Good dog!"
       const dogId = event.target.dataset.id 
       fetch(`http://localhost:3000/pups/${dogId}`, { 
           method: "PATCH", 
           body: JSON.stringify({isGoodDog: !isGoodDog }),
           headers: {"Content-Type": "application/json"}
       })
       .then(res => res.json())
       event.target.innetText = newStatus 
       
   }

   function filterDogs(event) {
       dogBar.innerHTML = ""
       const onOrOff = event.target.innerText.split(": ")[1]
       
       if (onOrOff ==="OFF") {
           event.target.innetText = "Filter good dogs: ON"
           fetchDogs()
           .then(dogs => dogs.filter(dog => dog.isGoodDog))
           .then(goodDogs => renderDogBar(goodDogs))
       } else {
        event.target.innetText = "Filter good dogs: OFF" 
        fetchDogs().then(renderDogBar)
       }
   }


});










