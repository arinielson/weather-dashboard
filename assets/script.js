var currentDay = dayjs();
var recentCities = [];

var APIKey = 'de7b898f901d5411133392f904e459a9';
var searchInput = document.getElementById('search-input');
var searchBtn = document.getElementById('search-button');
var recentSearches = document.getElementById('recent-searches');
var currentCityInfo = document.getElementById('city');

function loadPage() {
    let search = localStorage.getItem('cities');
    if (search) {
        recentCities = JSON.parse(search);
        createRecentButtons();
    }
}

function searchBtnClick(e) {
    if (searchInput.value != '') {
        e.preventDefault();
        var searchCity = searchInput.value;
        latLongFetch(searchCity);
        storeCityInput();
        localStorage.setItem('cities', JSON.stringify(recentCities));
        createRecentButtons();
    }
}

function recentBtnClick(e) {
    if (!e.target.matches('.button-history')) {
        return;
    }

    var targetButton = e.target;
    var searchCity = targetButton.getAttribute('city-search');
    latLongFetch(searchCity);
}

function storeCityInput() {
    recentCities.push(searchInput.value);
}

function createRecentButtons() {
    recentSearches.innerHTML = '';
    let i = recentCities.length - 1;

    for (i; i >= 0; i--) {
        var innerButtonTxt = localStorage.getItem('cities');
        var recentBtn = document.createElement('button');
        recentBtn.append(recentCities[i]);
        recentBtn.setAttribute('city-search', recentCities[i]);
        recentBtn.classList.add('btn-secondary');
        recentSearches.append(recentBtn);
    }
}

function latLongFetch(searchCity) {
    var latLongURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchCity},&limit=3&appid=${APIKey}`;
    
    fetch(latLongURL)
    .then(function (res) {
        return res.json();
    })
    .then(function (data) {
        if (!data[0]) {
            alert('Location not found');
        } else {
            getWeatherAPI(data[0]);
        }
    })
    .catch(function (err) {
        console.error(err);
    });
}

function getWeatherAPI(location) {
    var city = location.name;
    var lat = location.lat;
    var lon = location.lon;
    var requestWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${APIKey}`;

    fetch(requestWeatherURL)
    .then(function (res) {
        return res.json();
    })
    .then(function (data) {
        buildBoxes(city, data);
        currentCityHelper(city, data);
    })
    .catch(function (err) {
        console.error(err);
    });
}

function buildBoxes(city, data) {
    var weatherData = data.list;
    var fiveDayForecast = document.getElementById('five-day-forecast');
    fiveDayForecast.innerHTML = '';
    
    for (let i = 7; i <= weatherData.length; i += 8) {
        let newBox = document.createElement("div");
        newBox.setAttribute('class', 'card card-body text-bg-dark border-dark cd-sz');
        let newBoxDate = document.createElement('h2');
        newBoxDate.setAttribute('class', 'day-box-date');
        let iconWeatherDay = weatherData[i].weather[0].icon;
        let iconDayURL = ` http://openweathermap.org/img/wn/${iconWeatherDay}.png`;
        let currentCityIconDay = document.createElement('img');
        currentCityIconDay.setAttribute('src', iconDayURL);
        newBoxDate.innerHTML = `${dayjs(weatherData[i].dt_txt).format(
            'M/D/YYYY'
            )}<br/>`;
        newBoxDate.append(currentCityIconDay);
        let newBoxTemp = document.createElement("p");
        newBoxTemp.setAttribute('class', 'day-box-temp');
        newBoxTemp.innerHTML = `Temp: ${weatherData[i].main.temp} &#8457;`;
        let newBoxWind = document.createElement("p");
        newBoxWind.setAttribute('class', 'day-box-wind');
        newBoxWind.innerHTML = `wind: ${weatherData[i].wind.speed} mph`;
        let newBoxHum = document.createElement("p");
        newBoxHum.setAttribute('class', 'day-box-humidity');
        newBoxHum.innerHTML = `Humidity: ${weatherData[i].main.humidity} %`;
        newBox.append(newBoxDate);
        newBox.append(newBoxTemp);
        newBox.append(newBoxWind);
        newBox.append(newBoxHum);
        fiveDayForecast.append(newBox);
    }
}

function currentCityHelper(city, data) {
    const iconWeather = data.list[0].weather[0].icon;
    var iconURL = `http://openweathermap.org/img/wn/${iconWeather}.png`;
    currentCityInfo.innerText = `${city} ${currentTime.format('M/D/YYYY')}`;
    var currentCityIcon = document.createElement('img');
    currentCityIcon.setAttribute('src', iconURL);
    currentCityInfo.append(currentCityIcon);
    var currentCityTemp = document.getElementById('current-temp');
    currentCityTemp.innerHTML = `Temp: ${data.list[0].main.temp} &#8457;`;
    var currentCityWind = document.getElementById('current-wind');
    currentCityWind.innerHTML = `Wind: ${data.list[0].wind.speed} mph`;
    var currentCityHum = document.getElementById('current-humidity');
    currentCityHum.innerHTML = `Humidity: ${data.list[0].main.humidity} %`;
}

loadPage();

searchBtn.addEventListener('click', searchBtnClick);
recentSearches.addEventListener('click', recentBtnClick);
searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      searchBtnClick(e);
    }
  });