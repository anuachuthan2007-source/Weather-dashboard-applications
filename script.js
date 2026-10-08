async function getWeather() {

    const cityInput = document.getElementById("cityInput");
    const city = cityInput.value.trim();

    const errorMessage = document.getElementById("errorMessage");

    if (city === "") {
        showError("Please enter a city name.");
        return;
    }

    errorMessage.style.display = "none";

    try {

        // Get city coordinates
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!geoResponse.ok) {
            throw new Error("Unable to connect to weather service.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            showError("City not found. Please enter a valid city name.");
            return;
        }

        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        // Get current weather
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`
        );

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather information.");
        }

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;

        document.getElementById("cityName").textContent =
            location.name + (location.country ? ", " + location.country : "");

        document.getElementById("temperature").textContent =
            current.temperature_2m + " °C";

        document.getElementById("humidity").textContent =
            current.relative_humidity_2m + "%";

        document.getElementById("wind").textContent =
            current.wind_speed_10m + " km/h";

        document.getElementById("feelsLike").textContent =
            current.apparent_temperature + " °C";

        const weatherInfo = getWeatherDescription(current.weather_code);

        document.getElementById("condition").textContent =
            weatherInfo.description;

        document.getElementById("weatherIcon").textContent =
            weatherInfo.icon;

    } catch (error) {

        showError("Something went wrong. Please try again.");

        console.log(error);
    }
}


function showError(message) {

    const errorMessage = document.getElementById("errorMessage");

    errorMessage.textContent = message;
    errorMessage.style.display = "block";
}


function getWeatherDescription(code) {

    if (code === 0) {
        return {
            description: "Clear Sky",
            icon: "☀️"
        };
    }

    if (code === 1 || code === 2 || code === 3) {
        return {
            description: "Partly Cloudy",
            icon: "⛅"
        };
    }

    if (code === 45 || code === 48) {
        return {
            description: "Foggy",
            icon: "🌫️"
        };
    }

    if (
        code === 51 ||
        code === 53 ||
        code === 55 ||
        code === 56 ||
        code === 57
    ) {
        return {
            description: "Drizzle",
            icon: "🌦️"
        };
    }

    if (
        code === 61 ||
        code === 63 ||
        code === 65 ||
        code === 66 ||
        code === 67
    ) {
        return {
            description: "Rain",
            icon: "🌧️"
        };
    }

    if (
        code === 71 ||
        code === 73 ||
        code === 75 ||
        code === 77
    ) {
        return {
            description: "Snow",
            icon: "❄️"
        };
    }

    if (
        code === 80 ||
        code === 81 ||
        code === 82
    ) {
        return {
            description: "Rain Showers",
            icon: "🌦️"
        };
    }

    if (
        code === 95 ||
        code === 96 ||
        code === 99
    ) {
        return {
            description: "Thunderstorm",
            icon: "⛈️"
        };
    }

    return {
        description: "Unknown Weather",
        icon: "🌤️"
    };
}