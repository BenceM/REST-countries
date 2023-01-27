"use strict";
// SELECETORS

const countryModalContainer = document.querySelector(
	".country-modal-container"
);
const main = document.querySelector(".main");
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
		--text-color-secondary: hsl(220, 4%, 86%);
		--error-color: hsl(0, 100%, 69%);`;
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
		--text-color-secondary: hsl(0, 0%, 49%);
		--error-color: hsl(0, 100%, 26%);`;
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
		if (country < 10) {
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
		} else {
			const html = `
			<article class="country display-none">
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
	}
};

//COUNTRY MODAL FUNCTION
const countryModal = async function (e, countries) {
	const data = await getCountryData();
	const parent = e.target.closest(".country");
	const country = Array.from(countries).indexOf(parent);
	if (country === -1) return;
	const html = `
	<button type="button" class="button-back">BACK</button>
	<img
		class="country-img"
		alt="${data[country].name.common} flag"
		src=${data[country].flags.svg}
	/>
	<div class="country-data">
		<h3 class="country-name">${data[country].name.common}</h3>
		<div class="country-modal-1">
			<p class="country-line"><span>Native name:</span> FILL OUT</p>
			<p class="country-line">
				<span>Population:</span> ${data[country].population.toLocaleString()}
			</p>
			<p class="country-line country-region">
				<span>Region:</span> ${data[country].region}
			</p>
			<p class="country-line"><span>Sub Region:</span> FILL OUT</p>
			<p class="country-line">
				<span>Capital:</span> ${data[country].capital?.[0] ?? "None"}
			</p>
		</div>
		<div class="country-modal-2">
			<p class="country-line"><span>Top Level Domain:</span> FILL OUT</p>
			<p class="country-line"><span>Currencies:</span> FILL OUT</p>
			<p class="country-line"><span>Languages:</span> FILL OUT</p>
		</div>
		<div class="country-modal-3">
			<h4>Border Countries:</h4>
			<div class="border-countries"></div>
		</div>
	</div>`;
	main.classList.add("display-none");
	console.log("hello");
	countryModalContainer.innerHTML = html;
	countryModalContainer.classList.remove("display-none");
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
const filterClear = function (countries) {
	clear.classList.add("display-none");
	selectPh.innerHTML = `<p class="select-text">Filter by Region</p>
	<ion-icon name="chevron-down-sharp"></ion-icon>`;
	countries.forEach((country) => country.classList.remove("display-none"));
	selectDropDown.classList.add("hidden");
};
//SEARCH

const searchFunction = function (countries) {
	filterClear(countries);
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
const searchFull = function (list) {
	if (input.value === "") return;
	const searchIcon = searchIconContainer.querySelector(".search-icon");

	const countries = list;
	if (searchIcon.name === "search-sharp") {
		//console.log("test");
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
	const countries = document.querySelectorAll(".country");
	darkMode.addEventListener("click", darkModeToggle);
	//MODAL
	countriesContainer.addEventListener("click", (e) =>
		countryModal(e, countries)
	);
	countryModalContainer.addEventListener("click", (e) => {
		if (e.target.classList.contains("button-back")) {
		}
	});
	// EVENT LISTENERS FOR FILTER
	selectPh.addEventListener("click", countryToggle);
	selectDropDown.addEventListener("click", countryFilter);
	clear.addEventListener("click", () => {
		filterClear(countries);
	});
	// EVENT LISTENERS FOR SEARCH
	input.addEventListener("keydown", (e) => {
		if (e.keyCode === 13 || e.key === "Enter") {
			searchFull(countries);
		}
	});
	input.addEventListener("input", (e) => {
		//let currInput = input.value;
		if (input.value === "") {
			searchClear(countries);
		}
		if (prevInput.length !== 0 && prevInput !== input.value) {
			searchIconContainer.innerHTML = `<ion-icon class="search-icon md hydrated" name="search-sharp" role="img" aria-label="search sharp"></ion-icon>`;
			searchErr.style.display = "none";
			searchTerm = "";
		}
		prevInput = input.value;
	});
	searchIconContainer.addEventListener("click", (e) => {
		if (e.target.name === "close-sharp") {
			searchClear(countries);
		}
		searchFull(countries);
	});
	// add intersection observer to observe the load of new countries
};

window.addEventListener("load", initListeners);
