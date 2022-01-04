const citySearchInputEl = document.querySelector('#cityname');
const cityFormEl = document.querySelector('#cityForm');
const citiesSearchedContainerEl = document.querySelector('#citiesSearchedContainer');

let citiesArray = [];
let weatherArray = [];

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
                // console.log(cityLat);
                let cityLon = data.coord.lon;
                // console.log(cityLon);
                citiesArray.push(data.name);
                // console.log(citiesArray);
                localStorage.setItem("cities", JSON.stringify(citiesArray));

                let apiUrlTwo = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&exclude=minutely,hourly&appid=26e14b1e1bdcd3e4a900e722776adf30"

                // make a request to the second url
                fetch(apiUrlTwo)
                .then(function(response) {
                    if (response.ok) {
                        response.json().then(function(data) {
                            weatherArray.push({"weather": data});
                            // console.log(weatherArray);
                            localStorage.setItem("weather", JSON.stringify(weatherArray));
                        })
                    } else {
                        alert('Error: City Not Found!');
                    }
                })
            })
            displayCities();
        } else {
            alert ('Error: City Not Found!')
        }
    })
    .catch(function(error) {
        alert('Unable to connect to OpenWeather.')
    });
};

let formSubmitHandler = function(event) {
    event.preventDefault();

    let cityName = citySearchInputEl.value.trim();

    if (cityName) {
        getCityWeather(cityName);
    } else {
        alert('Please enter a valid City.');
    }
};

cityFormEl.addEventListener('submit', formSubmitHandler);

let displayCities = function() {
    let citiesSearched = JSON.parse(localStorage.getItem("cities"));
    for (let i = 0; i < citiesSearched.length; i++) {
        console.log(citiesSearched[i]);
    }
};

displayCities();