const citySearchInputEl = document.querySelector('#cityname');
const cityFormEl = document.querySelector('#cityForm');
const mostRecentSearchContainerEL = document.querySelector('#mostRecentSearchContainer');
const citiesSearchedContainerEl = document.querySelector('#citiesSearchedContainer');
const currentWeatherEl = document.querySelector('#currentWeather');
const currentWeatherCityEL = document.querySelector('#currentWeatherCityEl');

let citiesArray = [];
let weatherArray = [];

let searchedCities = function() {
    for (let i = 0; i < localStorage.length; i++) {
        console.log(localStorage.key(i));
        let cityButtonEl = document.createElement('button');
        cityButtonEl.classList = 'btn m-1 w-100 text-white font-weight-bold bg-dark';
        cityButtonEl.textContent = JSON.parse(localStorage.key(i));
        citiesSearchedContainerEl.appendChild(cityButtonEl);

        let searchedCurrentWeather = function() {
            currentWeatherCityEL.textContent = cityButtonEl.textContent;
            currentWeatherCityEL.classList = 'card-header font-weight-bold'
            currentWeatherEl.appendChild(currentWeatherCityEL);
        }

        cityButtonEl.addEventListener('click', searchedCurrentWeather);
    }
};


searchedCities();

let addCity = function() {
    let cityButtonEl = document.createElement('button');
    cityButtonEl.classList = 'btn m-1 w-100 text-white font-weight-bold bg-dark';
    cityButtonEl.textContent = citySearchInputEl.value;
    mostRecentSearchContainerEL.appendChild(cityButtonEl);
}

let getCityWeather = function(city) {
    // formate the OpenWeather api url
    let apiUrlOne = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=26e14b1e1bdcd3e4a900e722776adf30";

    // make a request to the first url
    fetch(apiUrlOne)
    .then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                let cityLat = data.coord.lat;
                let cityLon = data.coord.lon;
                citiesArray.push(data.name);                

                let apiUrlTwo = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&exclude=minutely,hourly&appid=26e14b1e1bdcd3e4a900e722776adf30"

                // make a request to the second url
                fetch(apiUrlTwo)
                .then(function(response) {
                    if (response.ok) {
                        response.json().then(function(data) {
                            weatherArray.push({"weather": data});
                            console.log(weatherArray);
                        })
                    } else {
                        alert('Error: City Not Found!');
                    }
                })
            })
        } else {
            alert ('Error: City Not Found!')
        }
    })
    addCity();
};

let formSubmitHandler = function(event) {
    event.preventDefault();

    let cityName = citySearchInputEl.value.trim();

    if (cityName) {
        localStorage.setItem(JSON.stringify(cityName), JSON.stringify(cityName));
        getCityWeather(cityName);
        citySearchInputEl.value = "";
    } else {
        alert('Please enter a valid City.');
    }
};

let currentWeather = function(event) {
    event.preventDefault();

    currentWeatherCityEL.textContent = citySearchInputEl.value;
    currentWeatherCityEL.classList = 'card-header font-weight-bold'
    currentWeatherEl.appendChild(currentWeatherCityEL);
}

cityFormEl.addEventListener('submit', formSubmitHandler && currentWeather);