import '../css/style.css';

const API_SECRET = process.env.API_SECRET;

const searchBtn = document.querySelector('#search-btn');
const geolocationBtn = document.querySelector('#geolocation-btn');
const inputCity = document.querySelector('#input-city');
const outputBox = document.querySelector('.output-box');
const favCityList = document.querySelector('#favorite-city-list ul');
const plusBtn = document.querySelector('#plus-btn');
const closeBtn = document.querySelector('#close-btn');

document.addEventListener('DOMContentLoaded', getCity);
searchBtn.addEventListener('click', searchCity);
geolocationBtn.addEventListener('click', getPosition);
plusBtn.addEventListener('click', addFavoriteCity);
closeBtn.addEventListener('click', closeOutputBox);
document.body.addEventListener('keydown', (e) => {
	if (e.keyCode == 13) {
		searchCity();
	}
});

document.querySelector('.error-box > button').addEventListener('click', (e) => {
	let item = e.target.parentNode.parentNode;
	item.classList.remove('visible');
	item.classList.add('invisible');
});

document
	.querySelector('.message-box > button')
	.addEventListener('click', (e) => {
		let item = e.target.parentNode.parentNode;
		item.classList.remove('visible');
		item.classList.add('invisible');
	});

async function fetchData(city) {
	let res = await axios.get(
		`https://api.waqi.info/feed/${city}/?token=${API_SECRET}`
	);
	let data = await res.data.data;
	if (res.data.status == 'ok') {
		insertData(data);
	} else {
		showError();
	}
}

function getPosition() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(async (position) => {
			let res = await axios.get(
				`https://api.waqi.info/feed/geo:${position.coords.latitude};${position.coords.longitude}/?token=${API_SECRET}`
			);
			let data = await res.data.data;
			insertData(data);
		});
	}
}

async function searchCity() {
	if (inputCity.value !== '') {
		await fetchData(inputCity.value);
	} else {
		showError();
	}

	inputCity.value = '';
}

function showError() {
	outputBox.classList.remove('visible');
	outputBox.classList.add('invisible');
	document.querySelector('.error-box').classList.add('visible');
	document.querySelector('.error-box').classList.remove('invisible');
}

function insertData(data) {
	outputBox.classList.remove('invisible');
	outputBox.classList.add('visible');
	document.querySelector('.error-box').classList.add('invisible');
	document.querySelector('.error-box').classList.remove('visible');
	document.querySelector('#city').innerText = _.get(data, 'city.name', '-');
	document.querySelector('#aqi-value').innerText = _.get(data, 'aqi', '-');

	if (data.aqi >= 0 && data.aqi <= 50) {
		document.querySelector('#aqi-value').style.backgroundColor = '#009966';
		document.querySelector('#aqi-level').innerText = 'Good';
		document.querySelector('#aqi-level').style.color = '#009966';
	}

	if (data.aqi >= 51 && data.aqi <= 100) {
		document.querySelector('#aqi-value').style.backgroundColor = '#ffde33';
		document.querySelector('#aqi-level').innerText = 'Moderate';
		document.querySelector('#aqi-level').style.color = '#ffde33';
	}

	if (data.aqi >= 101 && data.aqi <= 150) {
		document.querySelector('#aqi-value').style.backgroundColor = '#ff9933';
		document.querySelector('#aqi-level').innerText =
			'Unhealthy for Sensitive Groups';
		document.querySelector('#aqi-level').style.color = '#ff9933';
	}

	if (data.aqi >= 151 && data.aqi <= 200) {
		document.querySelector('#aqi-value').style.backgroundColor = '#cc0033';
		document.querySelector('#aqi-level').innerText = 'Unhealthy';
		document.querySelector('#aqi-level').style.color = '#cc0033';
	}

	if (data.aqi >= 201 && data.aqi <= 300) {
		document.querySelector('#aqi-value').style.backgroundColor = '#660099';
		document.querySelector('#aqi-level').innerText = 'Very Unhealthy';
		document.querySelector('#aqi-level').style.color = '#660099';
	}

	if (data.aqi >= 201 && data.aqi <= 300) {
		document.querySelector('#aqi-value').style.backgroundColor = '#7e0023';
		document.querySelector('#aqi-level').innerText = 'Hazardous';
		document.querySelector('#aqi-level').style.color = '#7e0023';
	}

	if (data.aqi === '-') {
		document.querySelector('#aqi-value').style.backgroundColor = '#999';
		document.querySelector('#aqi-level').innerText = '-';
		document.querySelector('#aqi-level').style.color = '#000';
	}

	document.querySelector('#pm25').innerText =
		_.get(data, 'iaqi.pm25.v', '-') + 'µg/m³';
	document.querySelector('#pm10').innerText =
		_.get(data, 'iaqi.pm10.v', '-') + 'µg/m³';
	document.querySelector('#o3').innerText =
		_.get(data, 'iaqi.o3.v', '-') + 'µg/m³';
	document.querySelector('#no2').innerText =
		_.get(data, 'iaqi.no2.v', '-') + 'µg/m³';
	document.querySelector('#so2').innerText =
		_.get(data, 'iaqi.so2.v', '-') + 'µg/m³';
	document.querySelector('#co').innerText =
		_.get(data, 'iaqi.co.v', '-') + 'µg/m³';
	document.querySelector('#t').innerText = _.get(data, 'iaqi.t.v', '-') + '°C';
	document.querySelector('#p').innerText =
		_.get(data, 'iaqi.p.v', '-') + 'g/cm²';
	document.querySelector('#h').innerText = _.get(data, 'iaqi.h.v', '-') + '%';
	document.querySelector('#w').innerText = _.get(data, 'iaqi.w.v', '-') + 'm/s';
}

function closeOutputBox(e) {
	let item = e.target.parentNode;
	item.classList.remove('visible');
	item.classList.add('invisible');
	document.querySelector('.message-box').classList.remove('visible');
	document.querySelector('.message-box').classList.add('invisible');
}

function addFavoriteCity(e) {
	saveInLocalStorage(e.target.parentNode.childNodes[1].textContent);
}

function removeFavoriteCity(e) {
	if (e.target.className == 'fas fa-times') {
		let city = e.target.parentNode.parentNode;
		removeFromLocalStorage(city);
		city.remove();
	}
}

// SAVE IN LOCAL STORAGE
function saveInLocalStorage(city) {
	let cityList;
	if (localStorage.getItem('cityList') === null) {
		cityList = [];
	} else {
		cityList = JSON.parse(localStorage.getItem('cityList'));
	}
	if (cityList.includes(city)) {
		document.querySelector('.message-box').classList.remove('invisible');
		document.querySelector('.message-box').classList.add('visible');
	} else {
		cityList.push(city);
		localStorage.setItem('cityList', JSON.stringify(cityList));
		createFavoriteCityList(city);
	}
}

// GET CITY FROM LOCAL STORAGE AND SHOW ON THE SCREEN
function getCity() {
	let cityList;
	if (localStorage.getItem('cityList') === null) {
		cityList = [];
	} else {
		cityList = JSON.parse(localStorage.getItem('cityList'));
	}
	cityList.forEach(function (city) {
		createFavoriteCityList(city);
	});
}

function createFavoriteCityList(city) {
	const li = document.createElement('li');
	const p = document.createElement('p');
	const removeBtn = document.createElement('button');
	removeBtn.innerHTML = '<i class="fas fa-times"></i>';
	removeBtn.addEventListener('click', removeFavoriteCity);
	p.innerText = city;
	li.appendChild(p);
	li.appendChild(removeBtn);
	favCityList.appendChild(li);
	p.addEventListener('click', async (e) => {
		await fetchData(e.target.textContent);
	});
}

// REMOVE FROM LOCAL STORAGE
function removeFromLocalStorage(city) {
	let cityList;
	if (localStorage.getItem('cityList') === null) {
		cityList = [];
	} else {
		cityList = JSON.parse(localStorage.getItem('cityList'));
	}
	const cityIndex = city.children[0].innerText;
	cityList.splice(cityList.indexOf(cityIndex), 1);
	localStorage.setItem('cityList', JSON.stringify(cityList));
}
