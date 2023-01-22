"use strict";
// SELECETORS

const darkMode = document.querySelector(".dark-mode");
const darkModeIcon = document.querySelector(".dark-mode-button");
const search = document.querySelector(".search-box");
const searchIconContainer = document.querySelector(".search-icon-cont");
const searchErr = document.querySelector(".search-error");
const selectPh = document.querySelector(".select-placeholder");
const selectDropDown = document.querySelector(".select-options");
const countriesContainer = document.querySelector(".countries");
const clear = document.querySelector(".clear");
const boxShadow = document.querySelectorAll(".change");
const input = document.querySelector("#search-input");
//HELPER VARIABLES
let prevInput = "";
let searchTerm = "";
// COUNTRY FILTER TOGGLE
const countryToggle = function () {
	selectDropDown.classList.toggle("hidden");
};

// DARKMODE TOGGLE
const darkModeToggle = function () {
	darkMode.classList.toggle("dark");
	selectDropDown.classList.add("hidden");
	if (darkMode.classList.contains("dark")) {
		document.documentElement.style.cssText = `--main-background: hsl(207, 26%, 17%);
		--secondary-background: hsl(209, 23%, 22%);
		--text-color: hsl(0, 0%, 100%);
		--searchPH-color: hsla(0, 0%, 52%, 0.444);
		--text-color-secondary: hsl(220, 4%, 86%);`;
		darkModeIcon.innerHTML = `<ion-icon name="sunny"></ion-icon>
		Light Mode`;
		boxShadow.forEach((el) => {
			el.classList.remove("box-shadow");
			el.classList.add("box-shadow-dark");
		});
	} else {
		document.documentElement.style.cssText = `--main-background: hsl(0, 0%, 98%);
		--secondary-background: #fff;
		--text-color: hsl(200, 15%, 8%);
		--searchPH-color: hsla(0, 0%, 52%, 0.444);
		--text-color-secondary: hsl(0, 0%, 49%);`;
		darkModeIcon.innerHTML = `<ion-icon name="moon"></ion-icon>
		Dark Mode`;
		boxShadow.forEach((el) => {
			el.classList.remove("box-shadow-dark");
			el.classList.add("box-shadow");
		});
	}
};

//API CALL ALL

const getCountryData = async () => {
	try {
		const res = await fetch("https://restcountries.com/v3.1/all");
		const data = await res.json();

		if (!res.ok) {
			console.log(data.description);
			return;
		}
		return data;
	} catch (error) {
		console.log(error);
	}
};

//COUNTRY DATA PARSE AND RENDER
const renderCountryData = async function () {
	const data = await getCountryData();
	for (const country in data) {
		const html = `
			<article class="country">
				<img class="country-img" alt="${data[country].name.common} flag" src=${
			data[country].flags.svg
		} />
				<div class="country-data">
					<h3 class="country-name">${data[country].name.common}</h3>
					<p class="country-line"><span>Population:</span> ${data[
						country
					].population.toLocaleString()}</p>
					<p class="country-line country-region"><span>Region:</span> ${
						data[country].region
					}</p>
					<p class="country-line"><span>Capital:</span> ${
						data[country].capital?.[0] ?? "None"
					}</p>
				</div>
			</article>`;
		countriesContainer.insertAdjacentHTML("beforeend", html);
	}
};

//COUNTRY FILTER
const countryFilter = (e) => {
	if (!e.target.classList.contains("select-text")) return;
	clear.classList.remove("display-none");

	const countries = document.querySelectorAll(".country");
	if (input.value !== "") {
		searchClear(countries);
	}

	//console.log(countries);
	countries.forEach((country) => {
		const region = country.querySelector(".country-region");
		const value = region.innerHTML.split(" ");

		//console.log(value[1]);
		if (e.target.innerHTML !== value[1]) {
			country.classList.add("display-none");
		} else {
			country.classList.remove("display-none");
		}
	});
	selectPh.innerHTML = `<p class="select-text">${e.target.innerHTML}</p>
	<ion-icon name="chevron-down-sharp"></ion-icon>`;
};
const filterClear = function () {
	clear.classList.add("display-none");
	selectPh.innerHTML = `<p class="select-text">Filter by Region</p>
	<ion-icon name="chevron-down-sharp"></ion-icon>`;
	const countries = document.querySelectorAll(".country");
	countries.forEach((country) => country.classList.remove("display-none"));
	selectDropDown.classList.add("hidden");
};
//SEARCH

const searchFunction = function (countries) {
	filterClear();
	const countriesArr = Array.from(countries);
	countriesArr.forEach((result) => result.classList.remove("display-none"));
	searchIconContainer.innerHTML = `<ion-icon class="search-icon md hydrated" name="close-sharp" role="img" aria-label="close sharp"></ion-icon>`;
	const results = countriesArr.filter(
		(country) =>
			!country
				.querySelector(".country-name")
				.textContent.toLowerCase()
				.includes(input.value.toLowerCase())
	);
	if (results.length === countries.length) {
		searchErr.style.display = "block";
		input.focus();
		return;
	}
	results.forEach((result) => result.classList.add("display-none"));
};
const searchClear = function (countries) {
	input.value = "";

	countries.forEach((country) => country.classList.remove("display-none"));
	searchIconContainer.innerHTML = `<ion-icon class="search-icon md hydrated" name="search-sharp" role="img" aria-label="search sharp"></ion-icon>`;
	searchErr.style.display = "none";
	searchTerm = "";
};
const searchFull = function () {
	if (input.value === "") return;

	const searchIcon = searchIconContainer.querySelector(".search-icon");
	const countries = document.querySelectorAll(".country");

	if (searchIcon.name === "search-sharp") {
		console.log("test");
		input.blur();
		searchFunction(countries);
		searchTerm = input.value;

		return;
	}
	if (input.value === searchTerm) return;
	if (searchIcon.name === "close-sharp") {
		searchClear(countries);

		return;
	}
};

renderCountryData();
//EVENT LISTENERS
const initListeners = function () {
	selectPh.addEventListener("click", countryToggle);
	darkMode.addEventListener("click", darkModeToggle);
	selectDropDown.addEventListener("click", countryFilter);
	clear.addEventListener("click", filterClear);
	input.addEventListener("keydown", (e) => {
		if (e.keyCode === 13 || e.key === "Enter") {
			searchFull();
		}
	});
	input.addEventListener("input", (e) => {
		//let currInput = input.value;
		if (input.value === "") {
			searchClear(document.querySelectorAll(".country"));
		}
		if (prevInput.length !== 0 && prevInput.length > input.value.length) {
			searchIconContainer.innerHTML = `<ion-icon class="search-icon md hydrated" name="search-sharp" role="img" aria-label="search sharp"></ion-icon>`;
			searchErr.style.display = "none";
			searchTerm = "";
		}
		prevInput = input.value;
	});
	searchIconContainer.addEventListener("click", (e) => {
		if (e.target.name === "close-sharp") {
			searchClear(document.querySelectorAll(".country"));
		}
		searchFull();
	});
};

window.addEventListener("load", initListeners);
