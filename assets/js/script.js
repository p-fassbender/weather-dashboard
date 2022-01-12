const apiKey = "b53e99656ff24a5b5005671f604cde31"

var cityInputEl = document.querySelector("#city-name");
var cityFormEl = document.querySelector("#city-form");

function getCityWeather(city) {
    // format the github url
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;
    // make arequest to the url
    fetch(apiURL)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (weatherData) {
                    displayWeather(weatherData);
                });
            }
            else {
                alert("Error: City Not Available");
            }
        })
        .catch(function (error) {
            alert("Unable to connect");
        });
};

function formSubmitHandler(event) {
    event.preventDefault();
    // get value from input element
    var city = cityInputEl.value.trim();
    if (city) {
        getCityWeather(city);
        cityInputEl.value = "";
    }
    else {
        alert("Please enter a valid city name.");
    }
};

var weatherInfoEl = document.querySelector("#weather-info");
var forecastEl = document.querySelector("#forecast");

function displayWeather(weatherData) {
    //weatherInfoEl.textContent = "";
    //forecastEl.textContent = "";
    document.querySelector("#currentName").innerText = weatherData.name;
    document.querySelector("#currentTemp").innerText = weatherData.main.temp;
    document.querySelector("#currentWind").innerText = weatherData.wind.speed;
    document.querySelector("#currentHumidity").innerText = weatherData.main.humidity;
    document.querySelector("#currentUV").innerText = "UV";
};

getCityWeather("milwaukee");

cityFormEl.addEventListener("submit", formSubmitHandler);