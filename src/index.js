document.addEventListener("DOMContentLoaded", () => {
   const dogInfoDiv = document.getElementById("dog-info")
    const dogBar =  document.getElementById("dog-bar")
    const  goodDogFilter = document.querySelector('#good-dog-filter')
   
    fetchDogs()

    function fetchDogs(){
    fetch("http://localhost:3000/pups")
    .then(response => response.json())
    .then(dogs => renderDog(dogs))
   
    }
   function  renderDog(dogs) {
        dogs.forEach(dog => addDogToBar(dog))
   }

   function addDogToBar(dog) {
     const span = document.createElement("span")
       span.innerText = dog.name
       span.setAttribute("data-id", dog.id)
        dogBar.append(span)

        span.addEventListener("click", dogShowInfo)
   }

    function dogShowInfo(event){
         event.preventDefault()
     //     const goodOrBad = dog.isGoodDog ? "Good dog!" : "Bad dog!"
        let  dogId = event.target.dataset.id
        console.log(dogId)
         fetch(`http://localhost:3000/pups/${dogId}`)
         .then(r => r.json())
         .then(dog => {

          dogInfoDiv.innerHTML = `<img src= ${dog.image}>
          <h2>${dog.name}</h2>
          <button>Good Dog!</button>`

          button = dogInfoDiv.getElementsByTagName('button')[0]
          button.addEventListener('click', toggleDog)
         })
     }
          function toggleDog(event){
               const goodOrBad = event.target.innerText.slice(0, -5)
               const isGoodDog = goodOrBad === "Good" ? true : false
               const newStatus = isGoodDog ? "Bad dog!" : "Good dog!"
               let dogId = event.target.dataset.id 
               
               fetch(`http://localhost:3000/pups/${dogId}`,{
                   
               method: "PATCH",
               header: {"Content-Type": "application/json"},
               body: JSON.stringify({isGoodDog: !isGoodDog})
          })
               .then(r => r.json())
               event.target.innerText = newStatus
     }

      goodDogFilter.addEventListener('click', filterDog)

     function filterDog(event){
          dogBar.innerHTML = ""
          const onOrOff = event.target.innerText.slice(18)
          if (onOrOff === "OFF") {
             event.target.innetText = "Filter good dogs: ON"
          fetch("http://localhost:3000/pups")
          .then(response => response.json())
          .then(dogs => dogs.filter(dog => dog.isGoodDog))
          .then(goodDogs => renderDog(goodDogs))
         
      }else {
                event.target.innetText = "Filter good dogs: OFF" 
                fetch("http://localhost:3000/pups")
                .then(response => response.json())
                .then(renderDogBar)
              }
}
});



































// const dogBar =  document.getElementById("dog-bar")
// const dogInfoDiv = document.querySelector('#dog-info')
// const  goodDogFilter = document.querySelector('#good-dog-filter')
// goodDogFilter.addEventListener("click", filterDogs)

// fetchDogs()

// function fetchDogs() {
//     fetch("http://localhost:3000/pups")
//     .then(r => r.json())
//    .then(dogs => renderDogBar(dogs))
// }

// function renderDogBar(dogs){

//  dogs.forEach(dog => addDogToDogBar(dog))
// }

// function addDogToDogBar(dog){
//  const span = document.createElement("span")
//  span.innerText = dog.name
//  // we set and id for each dog with settAtribute
//  span.setAttribute("data-id", dog.id)
 
//  span.addEventListener("click", showDogInfo )
//  dogBar.append(span)
// }

// function showDogInfo(event) {
//   const dogId = event.target.dataset.id
//   fetch(`http://localhost:3000/pups/${dogId}`)
//   .then(response => response.json())
//   .then(dog => {
//       const goodOrBad = dog.isGoodDog ? "Good dog!" : "Bad dog!"
//      dogInfoDiv.innerHTML = `<img src = "${dog.image}"
//      <h2>${dog.name}</h2>
//      <button data-id = ${dog.id}> ${goodOrBad}</button>`
//      const button = dogInfoDiv.querySelector('button')
//      button.addEventListener("click", toggleDog)
//   })

// }

// function toggleDog(event){
//     const goodOrBad = event.target.innerText.slice(0,-5)
//     const isGoodDog = goodOrBad === "Good" ? true : false
//     const newStatus = isGoodDog ? "Bad dog!" : "Good dog!"
//     const dogId = event.target.dataset.id 
//     fetch(`http://localhost:3000/pups/${dogId}`, { 
//         method: "PATCH", 
//         body: JSON.stringify({isGoodDog: !isGoodDog }),
//         headers: {"Content-Type": "application/json"}
//     })
//     .then(res => res.json())
//     event.target.innetText = newStatus 
    
// }

// function filterDogs(event) {
//     dogBar.innerHTML = ""
//     const onOrOff = event.target.innerText.split(": ")[1]
    
//     if (onOrOff ==="OFF") {
//         event.target.innetText = "Filter good dogs: ON"
//         fetchDogs()
//         .then(dogs => dogs.filter(dog => dog.isGoodDog))
//         .then(goodDogs => renderDogBar(goodDogs))
//     } else {
//      event.target.innetText = "Filter good dogs: OFF" 
//      fetchDogs().then(renderDogBar)
//     }
// }









