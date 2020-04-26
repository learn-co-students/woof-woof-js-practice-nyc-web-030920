window.addEventListener('DOMContentLoaded', () => {
    const dogBar = document.querySelector('#dog-bar')
    const dogInfoContainer = document.querySelector('#dog-info')

    const fetchDogs = () => {
        dogBar.innerHTML = ''
        fetch('http://localhost:3000/pups')
        .then(response => response.json())
        .then(dogs => {
            dogs.forEach(dog => dogBarDisplay(dog))
        })
    };
    fetchDogs()

    const dogBarDisplay = (dog) => {
        dogBar.innerHTML +=`
        <span data-id=${dog.id}>${dog.name}</span>
        `
    };

    const dogInfoFetch = (function() {
        dogBar.addEventListener('click', function(event){
            const dog = event.target.dataset.id
            fetch(`http://localhost:3000/pups/${dog}`)
            .then(response => response.json())
            .then(dog => displayDogInfo(dog))
        })
    })();
    

    const displayDogInfo = (dog) => {
        dogInfoContainer.innerHTML = `
        <img src=${dog.image}> 
        <h2>${dog.name}</h2> 
        <button data-id=${dog.id}>${dog.isGoodDog ? 'Good Dog' : 'Bad Dog'}</button>
        `
    };

    const dogStatus = (function() {
        dogInfoContainer.addEventListener('click', function(event){
            let isGood = undefined
            const dogButton = event.target
            if (dogButton.textContent === 'Good Dog'){
                dogButton.textContent = 'Bad Dog'
                isGood = false
            } else {
                dogButton.textContent = 'Good Dog'
                isGood = true
            }
            fetch(`http://localhost:3000/pups/${dogButton.dataset.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    isGoodDog: isGood
                })
            })
        })
    })();

    const filterDogs = (function() {
        const dogFilterBtn = document.querySelector('#good-dog-filter')
        dogFilterBtn.addEventListener('click', function(event) {

            if (dogFilterBtn.textContent === "Filter good dogs: OFF") {
                dogFilterBtn.textContent = "Filter good dogs: ON"
                fetch('http://localhost:3000/pups')
                .then(response => response.json())
                .then(dogs => {
                    dogInfoContainer.innerHTML = ''
                    dogBar.innerHTML = ''
                    dogs.forEach(dog => {
                        if (dog.isGoodDog === true){
                            dogBarDisplay(dog)
                        }
                    })
                })
            } else {
                dogFilterBtn.textContent = "Filter good dogs: OFF"
                fetchDogs()
            }   
        })
    })();
    
//end of DOMContentLoaded    
})