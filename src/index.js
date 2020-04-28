
const baseUrl = 'http://localhost:3000/pups';
const switchStatus = { 'Good Dog!': 'Bad Dog!', 'Bad Dog!': 'Good Dog!' }
const switchFilter = { 'Filter good dogs: OFF': 'Filter good dogs: ON', 'Filter good dogs: ON': 'Filter good dogs: OFF' }

document.addEventListener('DOMContentLoaded', function () {
    fetchDogBar();
    addListenerToDogBar();
    switchDogStatus();
    filterDog();
})

function fetchDogBar() {
    const dogBar = document.querySelector('#dog-bar');
    //clean dogBar if it has any dog span
    let dogSpan = Array.from(dogBar.children);
    if (dogSpan.length) {
        dogSpan.forEach(function (dog) {
            dog.remove();
        })
    }

    fetch(baseUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (result) {
            createDogSpan(result, dogBar)
        })
}

function createDogSpan(dogs, dogBar) {
    dogs.forEach(function (dogInfo) {
        let dogSpan = document.createElement('span')
        dogSpan.innerHTML = `${dogInfo['name']}`
        dogBar.append(dogSpan);
        dogSpan.dataset.id = dogInfo.id;
        dogSpan.style.cursor = "pointer"
    })
}


function addListenerToDogBar() {
    const dogBar = document.querySelector('#dog-bar');
    dogBar.addEventListener('click', function (event) {
        let eTar = event.target;
        if (eTar.tagName === 'SPAN') {
            //fetch info and create element;
            fetchAndShow(eTar.dataset.id);
        }
    })
}

function fetchAndShow(id) {
    const baseUrl = `http://localhost:3000/pups/${id}`
    const dogDiv = document.querySelector('#dog-info');
    fetch(baseUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (result) {
            let div = document.createElement('div');
            let allDog = Array.from(dogDiv.children);
            if (allDog.length) {
                allDog.forEach(function (dog) {
                    dog.remove();
                })
            }
            div.innerHTML = `
        <img src=${result['image']} alt=${result['name']}>
        <h2>${result['name']}</h2>
        `
            let likeBtn = document.createElement('button');
            if (result['isGoodDog']) {
                likeBtn.innerHTML = 'Good Dog!';
            } else {
                likeBtn.innerHTML = 'Bad Dog!';
            }
            likeBtn.dataset.id = result.id;
            likeBtn.dataset.isGoodDog = result['isGoodDog'];
            div.append(likeBtn);
            dogDiv.append(div);
        })
}

function switchDogStatus() {
    const dogDiv = document.querySelector('#dog-info');
    dogDiv.addEventListener('click', function (event) {
        let eTar = event.target;
        const baseUrl = `http://localhost:3000/pups/${eTar.dataset.id}`
        let newValue = null;
        if (eTar.tagName === 'BUTTON') {
            if (eTar.dataset.isGoodDog === 'true') {
                newValue = false;
            } else {
                newValue = true;
            }
            fetch(baseUrl, {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json',
                    accept: 'application/json'
                },
                body: JSON.stringify({
                    isGoodDog: newValue
                })
            })
            eTar.textContent = switchStatus[`${eTar.textContent}`];
        }
    })
}

//TODO: 
//1. filter fetch result by only show good dog
//2. clean previous dog bar and add new span 
function filterDog() {
    let filterBtn = document.querySelector('#good-dog-filter');

    filterBtn.addEventListener('click', function (event) {
        let eTar = event.target;
        const dogBar = document.querySelector('#dog-bar')
        const allDogs = Array.from(dogBar.children);
        //switch text content;
        if (eTar.textContent === 'Filter good dogs: OFF') {
            eTar.textContent = switchFilter[eTar.textContent];
            removeChildrenNode(allDogs);
            appendFilteredDog();
        } else {
            eTar.textContent = switchFilter[eTar.textContent];
            fetchDogBar();
            addListenerToDogBar();
            switchDogStatus();
        }

    })
}

function removeChildrenNode(childrenNode) {
    childrenNode.forEach(function (node) {
        node.remove();
    })
}

function appendFilteredDog() {
    const dogBar = document.querySelector('#dog-bar');
    fetch(baseUrl)
        .then(response => response.json())
        .then(function (result) {
            //filter good dog
            let goodDogs = filterGoodDogs(result);
            createDogSpan(goodDogs, dogBar);
            //show dog info when click the span 
            addListenerToDogBar();
        })
}

//array of obj
function filterGoodDogs(array) {
    let filtered = [];
    array.forEach(function (element) {
        if (element['isGoodDog']) {
            filtered.push(element);
        }
    })
    return filtered;
}