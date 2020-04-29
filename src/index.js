document.addEventListener('DOMContentLoaded', function () {
    getDogs();
    goodOrBadDog()
});
//==========================================================
function getDogs() {
	fetch('http://localhost:3000/pups')
		.then((resp) => resp.json())
		.then((dogs) => {
			dogs.forEach(function (dog) {
				dogLayout(dog);
			});
		});
}
//=============================================
function goodOrBadDog() {
	document.addEventListener('click', function (e) {
		if (e.target.className == 'btn') {
			let id = e.target.parentNode.dataset.id;
			let newValue;
			if (e.target.innerText.includes('Good')) {
				e.target.innerText = 'Bad Dog';
				newValue = false;
			} else {
				e.target.innerText = 'Good Dog';
				newValue = true;
			}

			fetch(`http://localhost:3000/pups/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify({
					isGoodDog: newValue,
				}),
			});
		} 
	});
};
//=============================================
function dogLayout(dog) {
	let dogBar = document.getElementById('dog-bar');
	let id = dog.id;
	let span = document.createElement('span');
	span.dataset.id = id;
	span.innerText = dog.name;
	dogBar.appendChild(span);
	document.addEventListener('click', function (e) {
		//console.log(e.target.dataset.id)
		if (e.target.dataset.id == id) {
			dogInfo(dog);
		}
	});
}
//====================================================

function dogInfo(dog) {
	let dogInfo = document.getElementById('dog-info');
	dogInfo.dataset.id = dog.id;
	dogInfo.innerHTML = `
<img src=${dog.image}>
 <h2>${dog.name}</h2>
 
 ${goodOrBadBtn(dog)}
`;
}

//================================================
function goodOrBadBtn(dog) {
	if (dog.isGoodDog) {
		return '<button class="btn">Good Dog!</button>';
	} else {
		return '<button class="btn">Bad Dog!</button>';
	}
}
