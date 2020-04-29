document.addEventListener('DOMContentLoaded', () => {
  const filterDiv = document.querySelector('#filter-div')
  const filterBtn = document.querySelector('#good-dog-filter')
  dogInfoDiv = document.querySelector('#dog-info')
  dogBarDiv = document.querySelector('#dog-bar')
  

  filterBtn.addEventListener('click', (event) => {
    toggleFilter(event.target)

    toggleDogBar(event.target)
  })

  getData()
})

//variables declared in global scope to use within functions
let dogBarDiv;
let dogInfoDiv;

//API endpoint
const endpoint = 'http://localhost:3000/pups'

//function filters the dog bar based on 'ON'/'OFF' button
//receives argument of the on/off button
function toggleDogBar(target) {
  //collects all buttons and spans to compare inner text
  let buttons = document.querySelectorAll('button[data-id]')
  let spans = document.querySelectorAll('span')

  //pattern matches for 'ON' in button inner text
  if (target.innerText.match(/ON/)) {
    buttons.forEach(button => {
      if (button.innerText === 'Bad Dog!') { //if true will hide all span 
        spans.forEach(span => {
          if (span.innerText === button.previousSibling.innerText) {
            span.style.display = 'none'
          }
        })
      }
    })
  } else if (target.innerText.match(/OFF/)) { //if false will show all span
    spans.forEach(span => {
      span.style.display = 'flex'
    })
  }
}

//GET request to render database data
function getData() {
  fetch(endpoint)
  .then(resp => resp.json())
  .then(json => json.forEach(createDogHTML))
}

//creates elements for each dog object in database
//attaches event listeners to specified elements
function createDogHTML(dogObj) {
  let span = document.createElement('span')
  span.innerText = dogObj.name

  //hide display of elements as default state
  //will render based on click event on the span element
  let img = document.createElement('img')
  img.src = dogObj.image
  img.style.display = 'none'

  let h2 = document.createElement('h2')
  h2.innerText = dogObj.name
  h2.style.display = 'none'

  //ternary expression to assign button inner text value
  let button = document.createElement('button')
  button.dataset.id = dogObj.id
  dogObj.isGoodDog ? button.innerText = 'Good Dog!' : button.innerText ='Bad Dog!'
  button.style.display = 'none'

  //attach event listeners defined in global scope
  attachSpanListener(span, img, h2, button)
  attachButtonListener(button)

  //append elements to appropriate div elements
  dogBarDiv.append(span)
  dogInfoDiv.append(img, h2, button)
}

//state variable for toggling the view of dog HTML elements upon click event on span element
//set to default to match default style.display of none
let showDogInfo = false

//state variable for toggling inner text of the filter on/off button
let filter = false;

//function to toggle/modify inner text of filter button
function toggleFilter(target) {
  filter = !filter
  if (filter) {
    target.innerText = 'Filter good dogs: ON'
  } else {
    target.innerText = 'Filter good dogs: OFF'
  }
}

//function to toggle rendering of dog elements upon span click event
function toggleDogInfo(imgTag, h2Tag, buttonTag) {
  showDogInfo = !showDogInfo
    
  if (showDogInfo) {
    imgTag.style.display = 'block'
    h2Tag.style.display = 'block'
    buttonTag.style.display = 'block'
  } else {
    imgTag.style.display = 'none'
    h2Tag.style.display = 'none'
    buttonTag.style.display = 'none'
  }
}

//function creates span element event listener
//upon click event, toggles the view of the appropriate dog HTML elements
function attachSpanListener(element, imgTag, h2Tag, buttonTag) {
  element.addEventListener('click', () => {
    toggleDogInfo(imgTag, h2Tag, buttonTag)
  })
}

//function creates dog HTML button event listener
//upon click event, inverses inner text
//assigns an object value to be used in PATCH request to database
//calls function to update value for isGoodDog attribute
function attachButtonListener(element) {
  element.addEventListener('click', event => {
    let isGood;

    if (event.target.innerText === 'Good Dog!') {
      event.target.innerText = 'Bad Dog!'

      isGood = {isGoodDog: false}

      patchRequest(isGood, element.dataset.id)

     } else if (event.target.innerText === 'Bad Dog!') { 
       event.target.innerText = 'Good Dog!'

       isGood = {isGoodDog: true}

       patchRequest(isGood, element.dataset.id)
    }
  })
}

//varible encapsulates header object
const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

//function creates the configuration object
//takes dataObj arg which is field that is to be updated and persisted indatabase
//dataObj is created in the button event listener upon click event
function configurationObj(methodType, dataObj) {
  return {
    method: methodType,
    headers,
    body: JSON.stringify(dataObj)
  }
}

//function creates PATCH request
//console.logs json response for verification that object has updated attribute
function patchRequest(dataObj, id) {
  fetch(`${endpoint}/${id}`, configurationObj('PATCH', dataObj))
  .then(resp => resp.json())
  .then(console.log)
}
