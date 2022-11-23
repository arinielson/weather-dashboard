var APIKey = 'de7b898f901d5411133392f904e459a9';
var searchBtn = document.getElementById('search-button');

function getWeatherAPI() {
    var requestURL = `https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=` + APIKey;

    fetch(requestURL)
}

searchBtn.addEventListener('click', getWeatherAPI);