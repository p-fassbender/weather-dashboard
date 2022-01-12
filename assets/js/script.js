const apiKey = "b53e99656ff24a5b5005671f604cde31"

var cityInputEl = document.querySelector("#city-name");
var cityFormEl = document.querySelector("#city-form");

var weatherInfoEl = document.querySelector("#weather-info");
var forecastEl = document.querySelector("#forecast");

function displayWeather(weatherData, city) {
    //weatherInfoEl.textContent = "";
    forecastEl.textContent = "";
    document.querySelector("#currentName").innerText = city.toUpperCase();
    document.querySelector("#currentTemp").innerText = "Temp: " + weatherData.current.temp + " °F";
    document.querySelector("#currentWind").innerText = "Wind: " + weatherData.current.wind_speed + " MPH";
    document.querySelector("#currentHumidity").innerText = "Humidity: " + weatherData.current.humidity + " %";
    document.querySelector("#currentUV").innerText = "UV Index: " + weatherData.current.uvi;

    document.querySelector("#five-day").innerText = "5-Day Forecast";

    console.log(weatherData.daily);

    for (let i = 1; i <= 5; i++) {
        var forecastCardEl = document.createElement("div");
        forecastCardEl.classList.add("card", "py-2", "px-2");
        var dateP = document.createElement("p");
        var iconDiv = document.createElement("div");
        var tempP = document.createElement("p");
        var windP = document.createElement("p");
        var humidityP = document.createElement("p");
        dateP.textContent = "date"
        iconDiv.innerHTML = "<img src='http://openweathermap.org/img/wn/" + weatherData.daily[i].weather[0].icon + "@2x.png' alt='weather icon'>";
        tempP.textContent = "Temp: " + weatherData.daily[i].temp.day + " °F";
        windP.textContent = "Wind: " + weatherData.daily[i].wind_speed + " MPH";
        humidityP.textContent = "Humidity: " + weatherData.daily[i].humidity + " %";
        forecastCardEl.appendChild(dateP);
        forecastCardEl.appendChild(iconDiv);
        forecastCardEl.appendChild(tempP);
        forecastCardEl.appendChild(windP);
        forecastCardEl.appendChild(humidityP);
        forecastEl.appendChild(forecastCardEl);
    }
};

function getCityWeather(lat, lon, city) {
    var apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&units=imperial&appid=" + apiKey;

    fetch(apiURL)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (weatherData) {
                    displayWeather(weatherData, city);
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

function getCityCoords(city) {
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

    fetch(apiURL)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    getCityWeather(data.coord.lat, data.coord.lon, city);
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
    var city = cityInputEl.value.trim();
    if (city) {
        getCityCoords(city);
        cityInputEl.value = "";
    }
    else {
        alert("Please enter a valid city name.");
    }
};

getCityCoords("milwaukee");

cityFormEl.addEventListener("submit", formSubmitHandler);