import '../scss/main.scss'
// Отримання поточної дати
function updateDate() {
    const dateElement = document.getElementById("date");
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date().toLocaleDateString('en-US', options);
    dateElement.textContent = today;
}

// Отримання поточного місцезнаходження та погоди через API
async function updateWeather() {
    const locationElement = document.getElementById("location");
    const weatherElement = document.getElementById("weather");

    try {
        // Отримання координат користувача
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;

        // Використання OpenWeatherMap API
        const apiKey = '940c1cc91d19d593d5546e088c9abc08';
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`);
        const weatherData = await weatherResponse.json();

        // Отримання міста та погоди
        const city = weatherData.name;
        const temperature = weatherData.main.temp;
        const weatherDescription = weatherData.weather[0].description;

        // Оновлення елементів на сторінці
        locationElement.textContent = city;
        weatherElement.textContent = `${temperature}°C, ${weatherDescription}`;
    } catch (error) {
        locationElement.textContent = "Unable to get location";
        weatherElement.textContent = "Unable to get weather";
    }
}

// Виклик функцій для оновлення дати, місцезнаходження та погоди
updateDate();
updateWeather();

const linkEl = document.querySelector(".nav-list");

linkEl.addEventListener("click", function (event) {
    const selectedLink = event.target;
    selectedLink.classList.toggle("is-active");
});

// const onLinkElClick = (e) => {
//     const selectedLink = e.currentTarget;
//     console.log(selectedLink);


//     selectedLink.classList.toggle("is-active");
// }

// linkEl.addEventListener("click", onLinkElClick);


