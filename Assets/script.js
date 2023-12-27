//OpenWeatherMap API key
var apiKey = "899443335eed251daaacb2a6fab4d812";
 
// References to HTML elements
var searchForm = document.getElementById('search-form');
var cityInput = document.getElementById('city-input');
var currentWeatherData = document.getElementById('current-weather-data');
var forecastData = document.getElementById('forecast-data');
var searchHistory = document.getElementById('search-history');

// Event listener for the search form submission
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    var city = cityInput.value.trim();

    if (city) {
        getWeatherData(city);
        cityInput.value = '';
    }
});

// Function to fetch weather data from the OpenWeatherMap API
function getWeatherData(city) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            displayCurrentWeather(data);
            displayForecast(data);
            addToSearchHistory(city);
        })
        .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
            alert('Unable to fetch weather data. Please try again.');
        });
}

// Function to display current weather data
function displayCurrentWeather(data) {
    var currentWeather = data.list[0]; // Assuming the first item is the current weather data

    var city = data.city.name;
    var date = new Date(currentWeather.dt * 1000); 
    var iconUrl = `https://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png`;
    var temperature = currentWeather.main.temp;
    var humidity = currentWeather.main.humidity;
    var windSpeed = currentWeather.wind.speed;
    var description = currentWeather.weather[0].description;

    // Creates the HTML content for current weather
    var currentWeatherHtml = `
        <h3>${city} (${date.toLocaleDateString()}) <img src="${iconUrl}" alt="${description}"></h3>
        <p>Temperature: ${temperature} °C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
    `;

    // Updates the current-weather-data element with the HTML content
    currentWeatherData.innerHTML = currentWeatherHtml;
}

// Function to display 5-day forecast
function displayForecast(data) {
    // Assuming the API provides 5-day forecast data starting from index 1
    var forecastList = data.list.slice(1, 6);

    let forecastHtml = '';

    forecastList.forEach((item) => {
        var date = new Date(item.dt * 1000); // Convert timestamp to date
        var iconUrl = `https://openweathermap.org/img/w/${item.weather[0].icon}.png`;
        var temperature = item.main.temp;
        var humidity = item.main.humidity;
        var windSpeed = item.wind.speed;
        var description = item.weather[0].description;

        // Create HTML content for each forecast item
        var forecastItemHtml = `
            <div class="forecast-item">
                <p>${date.toLocaleDateString()}</p>
                <img src="${iconUrl}" alt="${description}">
                <p>Temp: ${temperature} °C</p>
                <p>Humidity: ${humidity}%</p>
                <p>Wind: ${windSpeed} m/s</p>
            </div>
        `;

        forecastHtml += forecastItemHtml;
    });

    // Update the forecast-data element with the HTML content
    forecastData.innerHTML = forecastHtml;
}

// Function to add a city to the search history
function addToSearchHistory(city) {
    var listItem = document.createElement('li');
    listItem.textContent = city;
    listItem.classList.add('search-history-item');

    // Add a click event listener to the newly created list item
    listItem.addEventListener('click', () => {
        getWeatherData(city);
    });

    // Append the list item to the search-history element
    searchHistory.appendChild(listItem);
}


// Function to handle clicks on search history items
function handleSearchHistoryClick(event) {
    var clickedCity = event.target.textContent;
    getWeatherData(clickedCity);
}

// Attach click event listeners to search history items
searchHistory.addEventListener('click', (event) => {
    if (event.target && event.target.classList.contains('search-history-item')) {
        handleSearchHistoryClick(event);
    }
});
