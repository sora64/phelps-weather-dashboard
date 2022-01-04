const citySearchInputEl = document.querySelector('#cityname');
const cityFormEl = document.querySelector('#cityForm');

let getCityWeather = function(city) {
    // formate the OpenWeather One Call api url
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=26e14b1e1bdcd3e4a900e722776adf30";

    // make a request to the url
    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                localStorage.setItem(JSON.stringify(data.name), JSON.stringify(data));
                displayCities();
            })
        } else {
            alert('Error: City Not Found!')
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
        citySearchInputEl.value = '';
    } else {
        alert('Please enter a valid City.');
    }
};

cityFormEl.addEventListener('submit', formSubmitHandler);

let displayCities = function(i) {
    for (i = 0; i < localStorage.length; i++) {
        let cityArray = JSON.parse(localStorage.getItem(localStorage.key(i))).name;
        
        let currentIndex = localStorage.length-=1;

        console.log(currentIndex);

        let currentCity = cityArray.slice(currentIndex);

        console.log(currentCity);
    }
};

displayCities();