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
		--error-color: hsl(0, 100%, 69%);
		--box-shadow: 0 0 0.5rem rgba(80, 80, 80, 0.2);
		--box-shadow-buttons-modal: 0 0 0.5rem rgba(80, 80, 80, 0.2);`;
		darkModeIcon.innerHTML = `<ion-icon name="sunny"></ion-icon>
		Light Mode`;
	} else {
		document.documentElement.style.cssText = `--main-background: hsl(0, 0%, 98%);
		--secondary-background: #fff;
		--text-color: hsl(200, 15%, 8%);
		--searchPH-color: hsla(0, 0%, 52%, 0.444);
		--text-color-secondary: hsl(0, 0%, 49%);
		--error-color: hsl(0, 100%, 26%);
		--box-shadow: 0 0 1rem rgba(120, 120, 120, 0.202);
		--box-shadow-buttons-modal: 0 0 0.5rem rgba(120, 120, 120, 0.202);`;
		darkModeIcon.innerHTML = `<ion-icon name="moon"></ion-icon>
		Dark Mode`;
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

//COUNTRY DATA PARSE AND RENDER ALL
const renderCountryData = async function () {
	const data = await getCountryData();
	for (const country in data) {
		if (country < 12) {
			const html = `
			<article class="country" id=${country}>
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
			<article class="country display-none"id=${country}>
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
	console.log("finished");
};

//OBSERVER SELECTION
const obsTargets = function (countriesArr) {
	const filteredArr = countriesArr.filter(
		(country) => (Number(country.id) + 1) % 12 === 0
	);

	return filteredArr;
};

//COUNTRY CODE TO NAME
const CCodeToName = function (cca3, dataset) {
	const country = dataset.filter((country) => country.cca3 === cca3).pop();
	return country.name.common;
};

//COUNTRY MODAL FUNCTION

// +BORDER COUNTRIES
const countryModal = async function (e, countriesArr) {
	console.log("im running");

	const data = await getCountryData();

	const parent = e.target.closest(".country")
		? e.target.closest(".country")
		: countriesArr
				.filter(
					(el) =>
						el.querySelector(".country-name").textContent.toLowerCase() ===
						e.target.textContent.toLowerCase()
				)
				.pop();

	const country = countriesArr.indexOf(parent);
	if (country === -1) return;
	console.log(country);
	const langs = Object.keys(data[country].languages);
	console.log(data[country]?.currencies);
	console.log(
		Object.keys(data[country].currencies).map(
			(key) => data[country].currencies[key].name
		)
	);
	const html = `
	<div class="back-cont">
	<button type="button" class="button-modal button-back box-shadow">&larr; Back</button>
	</div>
	<img
		class="country-img-modal"
		alt="${data[country].name.common} flag"
		src=${data[country].flags.svg}
	/>
	<div class="country-data modal-data">
		<h2 class="country-name country-name-modal">${data[country].name.common}</h2>
		<div class="country-modal-1">
			<p class="country-line"><span>Native name:</span> ${
				data[country].name.nativeName[
					Object.keys(data[country].name.nativeName)[0]
				]?.common
			}
			<p class="country-line">
				<span>Population:</span> ${data[country].population.toLocaleString()}
			</p>
			<p class="country-line country-region">
				<span>Region:</span> ${data[country].region}
			</p>
			<p class="country-line"><span>Sub Region:</span> ${
				data[country].subregion ?? "Unknown"
			}</p>
			<p class="country-line">
				<span>Capital:</span> ${data[country].capital?.[0] ?? "None"}
			</p>
		</div>
		<div class="country-modal-2">
			<p class="country-line"><span>Top Level Domain:</span> ${data[country].tld.join(
				" "
			)}</p>
			<p class="country-line"><span>Currencies:</span> ${
				data[country]?.currencies
					? Object.keys(data[country].currencies)
							.map((key) => data[country].currencies[key].name)
							.join(", ")
					: "Unknown"
			}</p>
			<p class="country-line"><span>Languages:</span> ${langs
				.map((key) => data[country].languages[key])
				.join(", ")}</p>
		</div>
		<div class="country-modal-3">
			<h3 class="border-text">Border Countries:</h3>
			<div class="border-countries">
			${
				data[country]?.borders
					? data[country]?.borders
							.map(
								(countryCode) =>
									`<button type="button" value=${countryCode} class="button-modal button-border">${CCodeToName(
										countryCode,
										data
									)}</button>`
							)
							.join("")
					: `<p>No land borders present</p>`
			}
			</div>
		</div>
	</div>`;
	countryModalContainer.classList.remove("display-none");
	main.classList.add("display-none");
	countryModalContainer.innerHTML = html;
	window.scroll({
		top: 0,
		left: 0,
	});
	console.log("im running end");
};

//BACK BUTTON IN MODAL
const backButtonFn = (scrollAmount) => {
	console.log(scrollAmount);
	countryModalContainer.classList.add("display-none");
	main.classList.remove("display-none");
	countryModalContainer.innerHTML = "";
	console.log(scrollAmount);
	window.scroll({
		top: scrollAmount,
		left: 0,
	});
};

//COUNTRY FILTER
const countryFilter = (e) => {
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
const filterClear = function (countriesArr) {
	clear.classList.add("display-none");
	selectPh.innerHTML = `<p class="select-text">Filter by Region</p>
	<ion-icon name="chevron-down-sharp"></ion-icon>`;
	countriesArr.forEach((country) => country.classList.remove("display-none"));
	selectDropDown.classList.add("hidden");
};
//SEARCH

const searchFunction = function (countriesArr) {
	filterClear(countriesArr);

	countriesArr.forEach((result) => result.classList.remove("display-none"));
	searchIconContainer.innerHTML = `<ion-icon class="search-icon md hydrated" name="close-sharp" role="img" aria-label="close sharp"></ion-icon>`;
	const results = countriesArr.filter(
		(country) =>
			!country
				.querySelector(".country-name")
				.textContent.toLowerCase()
				.includes(input.value.toLowerCase())
	);
	if (results.length === countriesArr.length) {
		searchErr.style.display = "block";
		input.focus();
		return;
	}
	results.forEach((result) => result.classList.add("display-none"));
};
const searchClear = function (countriesArr) {
	input.value = "";
	countriesArr.forEach((country) => country.classList.remove("display-none"));
	searchIconContainer.innerHTML = `<ion-icon class="search-icon md hydrated" name="search-sharp" role="img" aria-label="search sharp"></ion-icon>`;
	searchErr.style.display = "none";
	searchTerm = "";
};
const searchFull = function (countriesArr) {
	if (input.value === "") return;
	const searchIcon = searchIconContainer.querySelector(".search-icon");

	if (searchIcon.name === "search-sharp") {
		//console.log("test");
		input.blur();
		searchFunction(countriesArr);
		searchTerm = input.value;

		return;
	}
	if (input.value === searchTerm) return;
	if (searchIcon.name === "close-sharp") {
		searchClear(countriesArr);

		return;
	}
};

//EVENT LISTENERS
const initListeners = async function () {
	await renderCountryData();
	let scrollAmount;

	const countries = document.querySelectorAll(".country");
	const countriesArr = Array.from(countries);
	const ObsEntries = obsTargets(countriesArr);

	//OBSERVER FUNCTION
	const obsLogic = function (targets, observer) {
		const [target] = targets;
		const countryArr = [...countriesArr];
		console.log(observer);
		console.log(target);
		if (!target.isIntersecting) return;
		if (countryArr.length - Number(target.target.id) < 12) {
			countriesArr.forEach((country) => {
				country.classList.remove("display-none");
			});

			observer.disconnect();
			return;
		}
		for (
			let i = Number(target.target.id) + 1;
			i < Number(target.target.id) + 13;
			i++
		) {
			countriesArr[i].classList.remove("display-none");
		}
		observer.unobserve(target.target);
	};
	//INTERSECTION OBSERVER
	const countryObserver = new IntersectionObserver(obsLogic, {
		root: null,
		threshold: 0.2,
	});
	//INTERSECTION OBSERVER INITIATED
	ObsEntries.forEach((country) => countryObserver.observe(country));

	//DARKMODE
	darkMode.addEventListener("click", darkModeToggle);
	//MODAL
	countriesContainer.addEventListener("click", (e) => {
		countryModal(e, countriesArr);
		scrollAmount = window.scrollY;
	});

	//BACK BUTTON AND BORDER COUNTRIES
	countryModalContainer.addEventListener("click", (e) => {
		if (e.target.classList.contains("button-back")) {
			backButtonFn(scrollAmount);
		}
		// BORDER COUNTRIES
		if (e.target.classList.contains("button-border")) {
			countryModal(e, countriesArr);
		}
	});

	// EVENT LISTENERS FOR FILTER
	selectPh.addEventListener("click", () => {
		countryToggle();
	});
	selectDropDown.addEventListener("click", (e) => {
		if (e.target.classList.contains("select-text")) {
			countryFilter(e);
			countryObserver.disconnect();
		}
	});
	clear.addEventListener("click", () => {
		filterClear(countriesArr);
	});
	// EVENT LISTENERS FOR SEARCH
	input.addEventListener("keydown", (e) => {
		if (e.keyCode === 13 || e.key === "Enter") {
			searchFull(countriesArr);
			countryObserver.disconnect();
		}
	});
	input.addEventListener("input", (e) => {
		//let currInput = input.value;
		if (input.value === "") {
			searchClear(countriesArr);
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
			searchClear(countriesArr);
		}
		searchFull(countriesArr);
		countryObserver.disconnect();
	});
	// add intersection observer to observe the load of new countries
};
//Could try creating 250 country divs before populating them and see how that affects load time
initListeners();
