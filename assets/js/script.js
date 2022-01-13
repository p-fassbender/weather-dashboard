const apiKey = "b53e99656ff24a5b5005671f604cde31"

var currentDate = moment().format("MM/DD/YYYY");

var cityInputEl = document.querySelector("#city-name");
var cityFormEl = document.querySelector("#city-form");

var weatherInfoEl = document.querySelector("#weather-info");
var forecastEl = document.querySelector("#forecast");

var listEl = document.querySelector("#historyList");
var historyArray = [];

function displayWeather(weatherData, city) {
    // clears dynamically created cards
    forecastEl.textContent = "";

    // get info from api and inject it into the html for current day
    document.querySelector("#currentName").innerText = city.toUpperCase() + " - " + currentDate;
    document.querySelector("#currentTemp").innerText = "Temp: " + weatherData.current.temp + " °F";
    document.querySelector("#currentWind").innerText = "Wind: " + weatherData.current.wind_speed + " MPH";
    document.querySelector("#currentHumidity").innerText = "Humidity: " + weatherData.current.humidity + " %";
    document.querySelector("#currentUV").innerText = "UV Index: " + weatherData.current.uvi;
    document.querySelector("#five-day").innerText = "5-Day Forecast";

    // loops through the daily weather and creates a card for 5 days in the future
    for (let i = 1; i <= 5; i++) {
        var forecastCardEl = document.createElement("div");
        forecastCardEl.classList.add("card", "py-2", "px-2");

        var dateH5 = document.createElement("h5");
        var iconDiv = document.createElement("div");
        var tempP = document.createElement("p");
        var windP = document.createElement("p");
        var humidityP = document.createElement("p");
        var futureDate = moment().add(i, "days").format("MM/DD/YYYY");

        // get info from api and inject it into the html for day i after current day
        dateH5.textContent = futureDate;
        iconDiv.innerHTML = "<img src='http://openweathermap.org/img/wn/" + weatherData.daily[i].weather[0].icon + "@2x.png' alt='weather icon'>";
        tempP.textContent = "Temp: " + weatherData.daily[i].temp.day + " °F";
        windP.textContent = "Wind: " + weatherData.daily[i].wind_speed + " MPH";
        humidityP.textContent = "Humidity: " + weatherData.daily[i].humidity + " %";

        forecastCardEl.appendChild(dateH5);
        forecastCardEl.appendChild(iconDiv);
        forecastCardEl.appendChild(tempP);
        forecastCardEl.appendChild(windP);
        forecastCardEl.appendChild(humidityP);
        forecastEl.appendChild(forecastCardEl);
    }
};

// takes city name and coordinates and fetches weather information from openweathermap api. sends data response to displayWeather
function getCityWeather(lat, lon, city) {
    var apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&units=imperial&appid=" + apiKey;

    fetch(apiURL)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (weatherData) {
                    loadSearch();
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

// takes a city name and fetches city coordinates from openweathermap api. sends those coordinates to getCityWeather function
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

// loops though search history array and displays the contents in a list
function displayHistory(historyArray) {
    listEl.textContent = "";
    for (let i = 0; i < historyArray.length; i++) {
        var historyEl = document.createElement("li");
        historyEl.className = "list-group-item"
        historyEl.textContent = historyArray[i].toUpperCase();
        listEl.appendChild(historyEl);
    }
};

// gets search history from localstorage
function loadSearch() {
    var savedSearches = JSON.parse(localStorage.getItem("search-history")) || [];
    if (!savedSearches) {
        return false;
    }
    for (let i = 0; i < savedSearches.length; i++) {
        historyArray[i] = savedSearches[i];
    }
    let uniqueHistory = [...new Set(historyArray)];
    displayHistory(uniqueHistory);
};

// saves search history array in localstorage
function saveSearch(city) {
    historyArray.push(city);
    let uniqueHistory = [...new Set(historyArray)];
    localStorage.setItem("search-history", JSON.stringify(uniqueHistory));
};

// upon form submission takes the value from the input field and sends it to getCityCoords
function formSubmitHandler(event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();
    if (city) {
        getCityCoords(city);
        saveSearch(city);
        cityInputEl.value = "";
    }
    else {
        alert("Please enter a valid city name.");
    }
};

// listens for a click on the search button
cityFormEl.addEventListener("submit", formSubmitHandler);

//listens for a click on the search history list li elements and displays the weather for the clicked city
listEl.addEventListener("click",function(event){
    if (event.target && event.target.nodeName == "LI") {
        var cityName = event.target.textContent;
        getCityCoords(cityName);
    }
})

loadSearch();