// SELECETORS

const darkmode = document.querySelector(".dark-mode");
const search = document.querySelector(".search-box");
const selectPh = document.querySelector(".select-placeholder");
const selectDropDown = document.querySelector(".select-options");
const countries = document.querySelector(".countries");

// COUNTRY FILTER TOGGLE
const countryToggle = function () {
	selectDropDown.classList.toggle("hidden");
};

//EVENT LISTENERS
selectPh.addEventListener("click", countryToggle);
