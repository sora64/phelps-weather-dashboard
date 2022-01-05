const searchContainerEl = document.querySelector('#searchContainer');
const citySearchInputEl = document.querySelector('#cityname');
const cityFormEl = document.querySelector('#cityForm');
const mostRecentSearchContainerEL = document.querySelector('#mostRecentSearchContainer');
const citiesSearchedContainerEl = document.querySelector('#citiesSearchedContainer');
const currentWeatherEl = document.querySelector('#currentWeather');
const currentWeatherCityEL = document.querySelector('#currentWeatherCityEl');
const currentWeatherIconEl = document.querySelector('#currentWeatherIconEl');
const currentTemperatureEl = document.querySelector('#currentTempEl');
const currentWindSpeedEl = document.querySelector('#currentWindSpeedEl');
const currentHumidityEl = document.querySelector('#currentHumidityEl');
const currentUVIEl = document.querySelector('#currentUVI');
const currentUVIValueEL = document.querySelector('#uvi-value');

let citiesArray = [];
let weatherArray = [];
let futureWeatherArray = [];

let searchedCities = function() {
    for (let i = 0; i < localStorage.length; i++) {
        console.log(localStorage.key(i));
        let cityButtonEl = document.createElement('button');
        cityButtonEl.classList = 'btn m-1 w-100 text-white font-weight-bold bg-dark';
        cityButtonEl.textContent = JSON.parse(localStorage.key(i));
        citiesSearchedContainerEl.appendChild(cityButtonEl);

        let searchedCurrentWeather = function() {
            let cityName = cityButtonEl.textContent;

            getCityWeather(cityName);
            currentWeatherCityEL.textContent = 'Currently in ' + cityName + ':';
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

    let addCityCurrentWeather = function() {
        let cityName = cityButtonEl.textContent;

        getCityWeather(cityName);
        currentWeatherCityEL.textContent = 'Currently in ' + cityName + ':';
    }
        

    cityButtonEl.addEventListener('click', addCityCurrentWeather);
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

                let apiUrlTwo = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&units=imperial&exclude=minutely,hourly&appid=26e14b1e1bdcd3e4a900e722776adf30"

                // make a request to the second url
                fetch(apiUrlTwo)
                .then(function(response) {
                    if (response.ok) {
                        response.json().then(function(data) {
                            weatherArray.push({'weather': data});
                            // console.log(weatherArray.pop().weather.current)
                            let currentConditions = weatherArray.pop().weather.current;
                            let currentTemperature = currentConditions.temp;
                            let currentWindSpeed = currentConditions.wind_speed;
                            let currentHumidity = currentConditions.humidity;
                            let currentUVI = currentConditions.uvi;
                            currentTemperatureEl.textContent = 'Temp: ' + currentTemperature + '° F';
                            currentWindSpeedEl.textContent = 'Wind Speed: ' + currentWindSpeed + ' MPH';
                            currentHumidityEl.textContent = 'Humidity: ' + currentHumidity + '%';
                            currentUVIEl.textContent = 'UVI: ';
                            currentUVIValueEL.textContent = currentUVI;
                            if (currentUVI <= 2) {
                                currentUVIValueEL.classList.add('bg-success');
                            } else if (currentUVI >= 3 && currentUVI <=7) {
                                currentUVIValueEL.classList.add('bg-warning')
                            } else if (currentUVI > 7) {
                                currentUVIValueEL.classList.add('bg-danger')
                            };
                            let currentWeatherIcon = currentConditions.weather[0].icon;
                            currentWeatherIconEl.src="http://openweathermap.org/img/wn/" + currentWeatherIcon + "@2x.png";
                            currentWeatherIconEl.classList.remove('d-none');

                            futureWeatherArray.push({'weather': data});
                            let futureConditions = futureWeatherArray.pop().weather.daily;
                            console.log(futureConditions);
                            let tomorrowConditions = futureConditions[0];
                            let tomorrowTemperature = tomorrowConditions.temp.max;
                            console.log(tomorrowTemperature);
                            let tomorrowWindSpeed = tomorrowConditions.wind_speed;
                            console.log(tomorrowWindSpeed);
                            let tomorrowHumidity = tomorrowConditions.humidity;
                            console.log(tomorrowHumidity);
                            let tomorrowUVI = tomorrowConditions.uvi;
                            console.log(tomorrowUVI);
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
};

let formSubmitHandler = function(event) {
    event.preventDefault();

    let cityName = citySearchInputEl.value.trim();

    if (cityName) {
        localStorage.setItem(JSON.stringify(cityName), JSON.stringify(cityName));
        getCityWeather(cityName);
        currentWeatherCityEL.textContent = 'Currently in ' + citySearchInputEl.value + ':';
        addCity();
        citySearchInputEl.value = '';
    } else {
        alert('Please enter a valid City.');
    }
};

cityFormEl.addEventListener('submit', formSubmitHandler); 