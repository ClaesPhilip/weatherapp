import React, { useState } from "react"
import { useQuery } from "@apollo/react-hooks"
import gql from "graphql-tag"
import "./App.scss"

//IMAGES
import Sun from './images/sun1.svg';
import Rain from './images/rain.svg';
import KYellow from './images/yellow1.png';
import KBlue from './images/blue1.png';

function App() {
  
  // GRAPHQL QUERY
  const [ city, setCity ] = useState("Stockholm");
  const GET_WEATHER = gql`
  {
    getCity(name: "${city}") {
      name
      country
      weather {
        summary {
          title
        }
        temperature {
          actual
        }
        wind {
          speed
        }
        clouds {
          all
        }
      }
    }
  }
  `
  // STATES
  const { loading, error, data } = useQuery(GET_WEATHER);
  const [ weatherSearch, setWeatherSearch ] = useState("");

  // ERROR & LOADING
  if (error) return (
    <div className="error-container">
      <h1 className="error-message">Nope, something went wrong</h1>
      <button className="error-btn">
        <a style={{color: "white"}} href="/">Try again</a>
      </button>
    </div>
  );
  if (loading) return <h4 className="loading">Loading...</h4>;

  // SEARCH-HANDLER
  const onSearch = evt => {
    if (evt.key === "Enter" && !weatherSearch <= 0) {
      setCity(weatherSearch)
      console.log(weatherSearch);
      setWeatherSearch("");
    }
  }

  // DATE
  const dateBuilder = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let date = d.getDate();
    let hours = `${d.getHours()}:`;
    let minutes = d.getMinutes();
    let time = `${hours}${minutes < 10 ? "0" + minutes : minutes}`
    let month = months[d.getMonth()].length > 5 ? months[d.getMonth()].slice(0, 3) : months[d.getMonth()];

    return (
      <div className="date-container">
        <p className="time">{time}</p>
        <p className="month">{date} {month.toUpperCase()}</p>
      </div>
    )
  }

  // NICE VARIABLES
  const sunOrRainImage = data.getCity.weather.temperature.actual > 16 ? Sun : Rain;
  const coldOrWarmLogo = data.getCity.weather.temperature.actual > 16 ? KYellow : KBlue;
  const temperature = Math.round(data.getCity.weather.temperature.actual);
  const cityNameSlice = data.getCity.name.length > 13 ? data.getCity.name.slice(0, 13) + "..." : data.getCity.name;

  return (
    <div className="App">
      <div className="container">
        <img className="logo" src={coldOrWarmLogo} alt="logo"></img>
          <div className="search-container">
            <input
              type="text"
              className="search-bar"
              placeholder="Search for a city"
              onChange={e => setWeatherSearch(e.target.value)}
              onKeyPress={onSearch}
            />
          </div>
          <div className={data.getCity.weather.temperature.actual > 16 ? 'card-warm' : 'card-cold'}>
            <div className="cardDetails">
              <div className="weather-details">
                {dateBuilder(new Date())}
                <img src={sunOrRainImage} alt="weather condition"></img>
                <p className="temperature">{temperature}°</p>
                <p className="condition">{data.getCity.weather.summary.title.toUpperCase()}</p>
              </div>
              <div className="city-container">
                <div className="city-details">
                  <p className="city-name">{cityNameSlice.toUpperCase()}</p>
                  <p className="country">{data.getCity.country}</p>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default App;
