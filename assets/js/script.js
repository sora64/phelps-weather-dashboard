const searchContainerEl = document.querySelector('#searchContainer');
const citySearchInputEl = document.querySelector('#cityname');
const currentWeatherCityEL = document.querySelector('#currentWeatherCityEl');
const cityFormEl = document.querySelector('#cityForm');
const mostRecentSearchContainerEL = document.querySelector('#mostRecentSearchContainer');
const citiesSearchedContainerEl = document.querySelector('#citiesSearchedContainer');
const currentDate = moment().format('L');


let citiesArray = [];
let weatherArray = [];
let futureWeatherArray = [];

function searchedCities() {
    for (let i = 0; i < localStorage.length; i++) {
        let cityButtonEl = document.createElement('button');
        cityButtonEl.classList = 'btn m-1 w-75 text-white font-weight-bold bg-dark';
        cityButtonEl.textContent = JSON.parse(localStorage.key(i));
        citiesSearchedContainerEl.appendChild(cityButtonEl);

        let searchedCurrentWeather = function() {
            let cityName = cityButtonEl.textContent;

            getCityWeather(cityName);
            currentWeatherCityEL.textContent = cityName + ' ' + '(' + currentDate + ')';
        }

        cityButtonEl.addEventListener('click', searchedCurrentWeather);
    }
}

searchedCities();

function addCity() {
    let cityButtonEl = document.createElement('button');
    cityButtonEl.classList = 'btn m-1 w-75 text-white font-weight-bold bg-dark';
    cityButtonEl.textContent = citySearchInputEl.value;
    mostRecentSearchContainerEL.appendChild(cityButtonEl);

    let addCityCurrentWeather = function() {
        let cityName = cityButtonEl.textContent;

        getCityWeather(cityName);
        currentWeatherCityEL.textContent = citySearchInputEl.value + ' ' + '(' + currentDate + ')';
    }
        

    cityButtonEl.addEventListener('click', addCityCurrentWeather);
}

function getCityWeather(city) {
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
                            displayCurrentWeather(data);
                            displayForecast(data);
                            
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
}

function formSubmitHandler(event) {
    event.preventDefault();

    let cityName = citySearchInputEl.value.trim();

    if (cityName) {
        localStorage.setItem(JSON.stringify(cityName), JSON.stringify(cityName));
        getCityWeather(cityName);
        currentWeatherCityEL.textContent = citySearchInputEl.value + ' ' + '(' + currentDate + ')';
        addCity();
        citySearchInputEl.value = '';
    } else {
        alert('Please enter a valid City.');
    }
}

function displayCurrentWeather(data) {
    // current weather element variables
    const currentWeatherIconEl = document.querySelector('#currentWeatherIconEl');
    const currentTemperatureEl = document.querySelector('#currentTempEl');
    const currentWindSpeedEl = document.querySelector('#currentWindSpeedEl');
    const currentHumidityEl = document.querySelector('#currentHumidityEl');
    const currentUVIEl = document.querySelector('#currentUVI');
    const currentUVIValueEL = document.querySelector('#uvi-value');

    weatherArray.push({ 'weather': data });

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
        currentUVIValueEL.classList.remove('bg-warning');
        currentUVIValueEL.classList.remove('bg-danger');
        currentUVIValueEL.classList.add('bg-success');
    } else if (currentUVI > 2 && currentUVI < 7) {
        currentUVIValueEL.classList.remove('bg-danger');
        currentUVIValueEL.classList.remove('bg-success');
        currentUVIValueEL.classList.add('bg-warning');
    } else if (currentUVI >= 7) {
        currentUVIValueEL.classList.remove('bg-warning');
        currentUVIValueEL.classList.remove('bg-success');
        currentUVIValueEL.classList.add('bg-danger');
    };

    let currentWeatherIcon = currentConditions.weather[0].icon;
    currentWeatherIconEl.src = "http://openweathermap.org/img/wn/" + currentWeatherIcon + "@2x.png";
    currentWeatherIconEl.classList.remove('d-none');
}

function displayForecast(data) {
    futureWeatherArray.push({ 'weather': data });
    let futureConditions = futureWeatherArray.pop().weather.daily;
    forecastedTemperatures(futureConditions);
    forecastedWindSpeeds(futureConditions);
    forecastedHumidity(futureConditions);
    forecastedUVI(futureConditions);
    forecastedIcons(futureConditions);
    displayForecastedDates();
}

function forecastedTemperatures(futureConditions) {

    let tommorrowTemp = futureConditions[0].temp.day;
    const tomorrowTempValue = document.getElementById('tomorrowTempEl');
    tomorrowTempValue.textContent = 'Temp: ' + tommorrowTemp + '° F';

    let theNextDayTemp = futureConditions[1].temp.day;
    const theNextDayTempValue = document.getElementById('theNextDayTempEl');
    theNextDayTempValue.textContent = 'Temp: ' + theNextDayTemp + '° F';

    let theNextNextDayTemp = futureConditions[2].temp.day;
    const theNextNextDayTempValue = document.getElementById('theNextNextDayTempEl');
    theNextNextDayTempValue.textContent = 'Temp: ' + theNextNextDayTemp + '° F';

    let theNextNextNextDayTemp = futureConditions[3].temp.day;
    const theNextNextNextDayTempValue = document.getElementById('theNextNextNextDayTempEl');
    theNextNextNextDayTempValue.textContent = 'Temp: ' + theNextNextNextDayTemp + '° F';

    let theFinalDayTemp = futureConditions[4].temp.day;
    const theFinalDayTempValue = document.getElementById('theFinalDayTempEl');
    theFinalDayTempValue.textContent = 'Temp: ' + theFinalDayTemp + '° F';
}

function forecastedWindSpeeds(futureConditions) {

    let tommorrowWindSpeed = futureConditions[0].wind_speed;
    const tomorrowWindSpeedValue = document.getElementById('tomorrowWindSpeedEl');
    tomorrowWindSpeedValue.textContent = 'Wind Speed: ' + tommorrowWindSpeed + ' MPH';

    let theNextDayWindSpeed = futureConditions[1].wind_speed;
    const theNextDayWindSpeedValue = document.getElementById('theNextDayWindSpeedEl');
    theNextDayWindSpeedValue.textContent = 'Wind Speed: ' + theNextDayWindSpeed+ ' MPH';

    let theNextNextDayWindSpeed = futureConditions[2].wind_speed;
    const theNextNextDayWindSpeedValue = document.getElementById('theNextNextDayWindSpeedEl');
    theNextNextDayWindSpeedValue.textContent = 'Wind Speed: ' + theNextNextDayWindSpeed+ ' MPH';

    let theNextNextNextDayWindSpeed = futureConditions[3].wind_speed;
    const theNextNextNextDayWindSpeedValue = document.getElementById('theNextNextNextDayWindSpeedEl');
    theNextNextNextDayWindSpeedValue.textContent = 'Wind Speed: ' + theNextNextNextDayWindSpeed+ ' MPH';

    let theFinalDayWindSpeed = futureConditions[4].wind_speed;
    const theFinalDayWindSpeedValue = document.getElementById('theFinalDayWindSpeedEl');
    theFinalDayWindSpeedValue.textContent = 'Wind Speed: ' + theFinalDayWindSpeed+ ' MPH';
}

function forecastedHumidity(futureConditions) {

    let tomorrowHumidity = futureConditions[0].humidity;
    const tomorrowHumidityValue = document.getElementById('tomorrowHumidityEl');
    tomorrowHumidityValue.textContent = 'Humidity: ' + tomorrowHumidity + '%';

    let theNextDayHumidity = futureConditions[1].humidity;
    const theNextDayHumidityValue = document.getElementById('theNextDayHumidityEl');
    theNextDayHumidityValue.textContent = 'Humidity: ' + theNextDayHumidity + '%';

    let theNextNextDayHumidity = futureConditions[2].humidity;
    const theNextNextDayHumidityValue = document.getElementById('theNextNextDayHumidityEl');
    theNextNextDayHumidityValue.textContent = 'Humidity: ' + theNextNextDayHumidity + '%';

    let theNextNextNextDayHumidity = futureConditions[3].humidity;
    const theNextNextNextDayHumidityValue = document.getElementById('theNextNextNextDayHumidityEl');
    theNextNextNextDayHumidityValue.textContent = 'Humidity: ' + theNextNextNextDayHumidity + '%';

    let theFinalDayHumidity = futureConditions[4].humidity;
    const theFinalDayHumidityValue = document.getElementById('theFinalDayHumidityEl');
    theFinalDayHumidityValue.textContent = 'Humidity: ' + theFinalDayHumidity + '%';
}

function forecastedUVI(futureConditions) {

    const uviTomorrowText = document.getElementById('tomorrowUVI');
    uviTomorrowText.textContent = 'UVI: ';

    const uviTheNextDayText = document.getElementById('theNextDayUVI');
    uviTheNextDayText.textContent = 'UVI: ';

    const uviTheNextNextDayText = document.getElementById('theNextNextDayUVI');
    uviTheNextNextDayText.textContent = 'UVI: ';

    const uviTheNextNextNextDayText = document.getElementById('theNextNextNextDayUVI');
    uviTheNextNextNextDayText.textContent = 'UVI: ';

    const uviTheFinalDayText = document.getElementById('theFinalDayUVI');
    uviTheFinalDayText.textContent = 'UVI: ';

    getTomorrowUVI();  
    getTheNextDayUVI();
    getTheNextNextDayUVI();
    getTheNextNextNextDayUVI();
    getTheFinalDayUVI();

    function getTomorrowUVI() {
        let tomorrowUVI = futureConditions[0].uvi;
        const tomorrowUVIValueEl = document.getElementById('uvi-value-two');
        tomorrowUVIValueEl.textContent = tomorrowUVI;
        if (tomorrowUVI <= 2) {
            tomorrowUVIValueEl.classList.remove('bg-warning');
            tomorrowUVIValueEl.classList.remove('bg-danger');
            tomorrowUVIValueEl.classList.add('bg-success');
        } else if (tomorrowUVI > 2 && tomorrowUVI < 7) {
            tomorrowUVIValueEl.classList.remove('bg-danger');
            tomorrowUVIValueEl.classList.remove('bg-success');
            tomorrowUVIValueEl.classList.add('bg-warning');
        } else if (tomorrowUVI >= 7) {
            tomorrowUVIValueEl.classList.remove('bg-warning');
            tomorrowUVIValueEl.classList.remove('bg-success');
            tomorrowUVIValueEl.classList.add('bg-danger');
        };
    }

    function getTheNextDayUVI() {
        let theNextDayUVI = futureConditions[1].uvi;
        const theNextDayUVIValueEl = document.getElementById('uvi-value-three');
        theNextDayUVIValueEl.textContent = theNextDayUVI;
        if (theNextDayUVI <= 2) {
            theNextDayUVIValueEl.classList.remove('bg-warning');
            theNextDayUVIValueEl.classList.remove('bg-danger');
            theNextDayUVIValueEl.classList.add('bg-success');
        } else if (theNextDayUVI > 2 && theNextDayUVI < 7) {
            theNextDayUVIValueEl.classList.remove('bg-danger');
            theNextDayUVIValueEl.classList.remove('bg-success');
            theNextDayUVIValueEl.classList.add('bg-warning');
        } else if (theNextDayUVI >= 7) {
            theNextDayUVIValueEl.classList.remove('bg-warning');
            theNextDayUVIValueEl.classList.remove('bg-success');
            theNextDayUVIValueEl.classList.add('bg-danger');
        };
    }

    function getTheNextNextDayUVI() {
        let theNextNextDayUVI = futureConditions[2].uvi;
        const theNextNextDayUVIValueEl = document.getElementById('uvi-value-four');
        theNextNextDayUVIValueEl.textContent = theNextNextDayUVI;
        if (theNextNextDayUVI <= 2) {
            theNextNextDayUVIValueEl.classList.remove('bg-warning');
            theNextNextDayUVIValueEl.classList.remove('bg-danger');
            theNextNextDayUVIValueEl.classList.add('bg-success');
        } else if (theNextNextDayUVI > 2 && theNextNextDayUVI < 7) {
            theNextNextDayUVIValueEl.classList.remove('bg-danger');
            theNextNextDayUVIValueEl.classList.remove('bg-success');
            theNextNextDayUVIValueEl.classList.add('bg-warning');
        } else if (theNextNextDayUVI >= 7) {
            theNextNextDayUVIValueEl.classList.remove('bg-warning');
            theNextNextDayUVIValueEl.classList.remove('bg-success');
            theNextNextDayUVIValueEl.classList.add('bg-danger');
        };
    }

    function getTheNextNextNextDayUVI() {
        let theNextNextNextDayUVI = futureConditions[3].uvi;
        const theNextNextNextDayUVIValueEl = document.getElementById('uvi-value-five');
        theNextNextNextDayUVIValueEl.textContent = theNextNextNextDayUVI;
        if (theNextNextNextDayUVI <= 2) {
            theNextNextNextDayUVIValueEl.classList.remove('bg-warning');
            theNextNextNextDayUVIValueEl.classList.remove('bg-danger');
            theNextNextNextDayUVIValueEl.classList.add('bg-success');
        } else if (theNextNextNextDayUVI > 2 && theNextNextNextDayUVI < 7) {
            theNextNextNextDayUVIValueEl.classList.remove('bg-danger');
            theNextNextNextDayUVIValueEl.classList.remove('bg-success');
            theNextNextNextDayUVIValueEl.classList.add('bg-warning');
        } else if (theNextNextNextDayUVI >= 7) {
            theNextNextNextDayUVIValueEl.classList.remove('bg-warning');
            theNextNextNextDayUVIValueEl.classList.remove('bg-success');
            theNextNextNextDayUVIValueEl.classList.add('bg-danger');
        };
    }

    function getTheFinalDayUVI() {
        let theFinalDayUVI = futureConditions[4].uvi;
        const theFinalDayUVIValueEl = document.getElementById('uvi-value-six');
        theFinalDayUVIValueEl.textContent = theFinalDayUVI;
        if (theFinalDayUVI <= 2) {
            theFinalDayUVIValueEl.classList.remove('bg-warning');
            theFinalDayUVIValueEl.classList.remove('bg-danger');
            theFinalDayUVIValueEl.classList.add('bg-success');
        } else if (theFinalDayUVI > 2 && theFinalDayUVI < 7) {
            theFinalDayUVIValueEl.classList.remove('bg-danger');
            theFinalDayUVIValueEl.classList.remove('bg-success');
            theFinalDayUVIValueEl.classList.add('bg-warning');
        } else if (theFinalDayUVI >= 7) {
            theFinalDayUVIValueEl.classList.remove('bg-warning');
            theFinalDayUVIValueEl.classList.remove('bg-success');
            theFinalDayUVIValueEl.classList.add('bg-danger');
        };
    }
}

function forecastedIcons(futureConditions) {

    const tomorrowWeatherIconEl = document.getElementById('tomorrowWeatherIconEl');
    let tomorrowWeatherIcon = futureConditions[0].weather[0].icon;
    tomorrowWeatherIconEl.src = "http://openweathermap.org/img/wn/" + tomorrowWeatherIcon + "@2x.png";
    tomorrowWeatherIconEl.classList.remove('d-none');

    const theNextDayWeatherIconEl = document.getElementById('theNextDayWeatherIconEl');
    let theNextDayWeatherIcon = futureConditions[1].weather[0].icon;
    theNextDayWeatherIconEl.src = "http://openweathermap.org/img/wn/" + theNextDayWeatherIcon + "@2x.png";
    theNextDayWeatherIconEl.classList.remove('d-none');

    const theNextNextDayWeatherIconEl = document.getElementById('theNextNextDayWeatherIconEl');
    let theNextNextDayWeatherIcon = futureConditions[2].weather[0].icon;
    theNextNextDayWeatherIconEl.src = "http://openweathermap.org/img/wn/" + theNextNextDayWeatherIcon + "@2x.png";
    theNextNextDayWeatherIconEl.classList.remove('d-none');

    const theNextNextNextDayWeatherIconEl = document.getElementById('theNextNextNextDayWeatherIconEl');
    let theNextNextNextDayWeatherIcon = futureConditions[3].weather[0].icon;
    theNextNextNextDayWeatherIconEl.src = "http://openweathermap.org/img/wn/" + theNextNextNextDayWeatherIcon + "@2x.png";
    theNextNextNextDayWeatherIconEl.classList.remove('d-none');

    const theFinalDayWeatherIconEl = document.getElementById('theFinalDayWeatherIconEl');
    let theFinalDayWeatherIcon = futureConditions[4].weather[0].icon;
    theFinalDayWeatherIconEl.src = "http://openweathermap.org/img/wn/" + theFinalDayWeatherIcon + "@2x.png";
    theFinalDayWeatherIconEl.classList.remove('d-none');
}

function displayForecastedDates() {
    const tomorrowDateEl = document.getElementById('tomorrowDateEl');
    tomorrowDateEl.textContent = moment().add(1, 'days').format('L');

    const theNextDateEl = document.getElementById('theNextDateEl');
    theNextDateEl.textContent = moment().add(2, 'days').format('L');

    const theNextNextDateEl = document.getElementById('theNextNextDateEl');
    theNextNextDateEl.textContent = moment().add(3, 'days').format('L');

    const theNextNextNextDateEl = document.getElementById('theNextNextNextDateEl');
    theNextNextNextDateEl.textContent = moment().add(4, 'days').format('L');

    const theFinalDateEl = document.getElementById('theFinalDateEl');
    theFinalDateEl.textContent = moment().add(5, 'days').format('L');
}

cityFormEl.addEventListener('submit', formSubmitHandler);   