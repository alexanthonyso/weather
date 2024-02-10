import React, { useState, useEffect } from "react";

import OvercastCloudsImg from "../assets/img/overcast-clouds.jpg";
import SnowImg from "../assets/img/snow.jpg";
import RainImg from "../assets/img/rain.jpg";
import ClearImg from "../assets/img/clear-sky.jpg";
import ThunderImg from "../assets/img/thunderstorm.jpg";
import MistImg from "../assets/img/mist.jpg";
import BrokenImg from "../assets/img/broken-clouds.jpg";
import ModerateImg from "../assets/img/moderate-rain.jpg";
import ScatteredImg from "../assets/img/scattered-clouds.jpg";
import FewImg from "../assets/img/few-cloud.jpg";
import LightImg from "../assets/img/light-rain.jpg";
import "../styles/weather.css";
import Tilt from "react-parallax-tilt";

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState({ name: "Quebec", country: "CA" });
  const [weatherIcon, setWeatherIcon] = useState(null);
  const [userCityInput, setUserCityInput] = useState("");
  const [forecastData, setForecastData] = useState(null);
  const [citySuggestions, setCitySuggestions] = useState([]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const apiKey = "4ea1a72d01253d794169d43c40b06fdb";
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city.name},${city.country}&appid=${apiKey}&units=metric`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city.name},${city.country}&appid=${apiKey}&units=metric`;

        const [currentResponse, forecastResponse] = await Promise.all([
          fetch(currentWeatherUrl),
          fetch(forecastUrl),
        ]);

        if (!currentResponse.ok || !forecastResponse.ok) {
          throw new Error("Network response was not ok");
        }

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        setWeatherData({ current: currentData, forecast: forecastData });

        if (currentData.weather && currentData.weather.length > 0) {
          setWeatherIcon(currentData.weather[0].icon);
        }

        setForecastData(forecastData.list.slice(0, 4));
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données météo",
          error
        );
      }
    };

    fetchWeatherData();
  }, [city]);

  useEffect(() => {
    if (!weatherData) return;

    const weatherDescription = weatherData.current.weather[0].description;
    const backgroundElement = document.querySelector(".background");

    if (!backgroundElement) return;

    if (weatherDescription.includes("snow")) {
      backgroundElement.style.backgroundImage = `url(${SnowImg})`;
    } else if (weatherDescription.includes("overcast")) {
      backgroundElement.style.backgroundImage = `url(${OvercastCloudsImg})`;
    } else if (weatherDescription.includes("moderate")) {
      backgroundElement.style.backgroundImage = `url(${ModerateImg})`;
    } else if (weatherDescription.includes("rain")) {
      backgroundElement.style.backgroundImage = `url(${RainImg})`;
    } else if (weatherDescription.includes("mist")) {
      backgroundElement.style.backgroundImage = `url(${MistImg})`;
    } else if (weatherDescription.includes("broken")) {
      backgroundElement.style.backgroundImage = `url(${BrokenImg})`;
    } else if (weatherDescription.includes("clear")) {
      backgroundElement.style.backgroundImage = `url(${ClearImg})`;
    } else if (weatherDescription.includes("thunder")) {
      backgroundElement.style.backgroundImage = `url(${ThunderImg})`;
    } else if (weatherDescription.includes("few")) {
      backgroundElement.style.backgroundImage = `url(${FewImg})`;
    } else if (weatherDescription.includes("scattered")) {
      backgroundElement.style.backgroundImage = `url(${ScatteredImg})`;
    } else if (weatherDescription.includes("light")) {
      backgroundElement.style.backgroundImage = `url(${LightImg})`;
    } else {
      backgroundElement.style.backgroundImage = "none";
    }
  }, [weatherData]);

  const handleCityInputChange = async (e) => {
    const inputText = e.target.value;
    setUserCityInput(inputText);

    if (inputText.trim() !== "") {
      const suggestions = await fetchCitySuggestions(inputText);
      setCitySuggestions(suggestions);
    } else {
      setCitySuggestions([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCity({ name: userCityInput, country: "" }); // Set the country as needed
    setCitySuggestions([]);
  };

  const handleSuggestionClick = (selectedCity) => {
    setCity({ name: selectedCity.name, country: selectedCity.country });
    setCitySuggestions([]);
  };

  const fetchCitySuggestions = async (searchTerm) => {
    try {
      const apiKey = "4ea1a72d01253d794169d43c40b06fdb";
      const suggestionsUrl = `https://api.openweathermap.org/data/2.5/find?q=${searchTerm}&type=like&sort=population&cnt=5&appid=${apiKey}&units=metric`;

      const response = await fetch(suggestionsUrl);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data.list.map((city) => ({
        name: city.name,
        country: city.sys.country,
        temperature: city.main.temp,
        icon: city.weather[0].icon,
        flag: `https://flagcdn.com/64x48/${city.sys.country.toLowerCase()}.png`,
      }));
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des suggestions de villes",
        error
      );
      return [];
    }
  };

  return (
    <div className="infomain">
      {weatherData && (
        <div>
          <section className="formcontainer">
          <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="LOCATION"
                value={userCityInput}
                onChange={handleCityInputChange}
              />
              {/* <img
                className="logo"
                src={Form}
                alt="Get Weather"
                onClick={handleSubmit}
                style={{ cursor: "pointer" }}
              /> */}
              {citySuggestions.length > 0 && (
                <ul className="suggestions">
                  {citySuggestions.map((city, index) => (
                    <li key={index} onClick={() => handleSuggestionClick(city)}>
                      <p>
                        {`${city.name}, ${city.country}`}
                        <img
                          src={city.flag}
                          alt="Country Flag"
                          className="country-flag"
                        />
                        {` - ${city.temperature}°C`}
                      </p>
                      <img
                        src={`https://openweathermap.org/img/wn/${city.icon}.png`}
                        alt="Weather Icon"
                      />
                    </li>
                  ))}
                </ul>
              )}
            </form>
            </section>
          <div className="info2">
            
            <div className="infotext">
              <h4>DETAILS</h4>
              <div className="inline">
                <h5>Feels like</h5>
                <p>{weatherData.current.main.feels_like}°C</p>
              </div>
              <div className="inline">
                <h5>Humidity</h5>
                <p>{weatherData.current.main.humidity}%</p>
              </div>
              <div className="inline">
                <h5>Pressure</h5>
                <p>{weatherData.current.main.pressure} hPa</p>
              </div>
              <div className="inline">
                <h5>Wind Speed</h5>
                <p>{weatherData.current.wind.speed} m/s</p>
              </div>
              <div className="inline">
                <h5>Visibility</h5>
                <p>{weatherData.current.visibility / 1000} km</p>
              </div>
              {forecastData && (
                <div className="forecast">
                  <h4>FORECAST</h4>
                  {forecastData.map((forecast, index) => (
                    <div key={index} className="forecast-item">
                      <p>{forecast.dt_txt.split(' ')[1]}</p>
                      <p>{Math.floor(forecast.main.temp)}°C</p>
                      <img
                        src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
                        alt="Weather Icon"
                      />
                      <p>{forecast.weather[0].description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <h2 className="title">WEATHER HUB</h2>

          <div className="weather">
            <Tilt>
              <div className="info">
                <h3>{Math.floor(weatherData.current.main.temp)}°</h3>
                <p className="location">
                  {`${weatherData.current.name.toUpperCase()}, ${
                    weatherData.current.sys.country
                  }`}
                  <img
                    src={`https://flagcdn.com/64x48/${weatherData.current.sys.country.toLowerCase()}.png`}
                    alt="Country Flag"
                    className="country-flag2"
                  />
                </p>
                <div className="icon">
                  {weatherIcon && (
                    <img
                      src={`https://openweathermap.org/img/wn/${weatherIcon}.png`}
                      alt="Weather Icon"
                    />
                  )}
                  <p>
                    {weatherData.current.weather[0].description.toUpperCase()}
                  </p>
                </div>
              </div>
            </Tilt>
          </div>
        </div>
      )}
      <div
        className="background"
        style={{
          width: "100vw",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: -1,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
};

export default Weather;
