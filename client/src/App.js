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
    getCityByName(name: "${city}") {
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

  const { loading, error, data } = useQuery(GET_WEATHER);
  const [ weatherSearch, setWeatherSearch ] = useState("");
  if (error) return (
    <div className="error-container">
      <h1 className="error-message">Nope, something went wrong</h1>
      <button className="error-btn">
        <a style={{color: "white"}} href="/">Try again</a>
      </button>
    </div>
  );
  if (loading) return <h1 style={{textAlign: "center", color: "white"}}>Loading...</h1>;

  const onSearch = evt => {
    if (evt.key === "Enter" && !weatherSearch <= 0) {
      setCity(weatherSearch)
      console.log(weatherSearch);
      setWeatherSearch("");
    }
  }


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

  const sunOrRainImage = data.getCityByName.weather.temperature.actual > 16 ? Sun : Rain;
  const blueOrYellowLogo = data.getCityByName.weather.temperature.actual > 16 ? KYellow : KBlue;
  const temperature = Math.round(data.getCityByName.weather.temperature.actual);
  const cityNameSlice = data.getCityByName.name.length > 13 ? data.getCityByName.name.slice(0, 13) + "..." : data.getCityByName.name;

  return (
    <div className="App">
      <div className="container">
      <img src={blueOrYellowLogo} alt="sun" width="100px" height="100px"></img>
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Search for a city"
            onChange={e => setWeatherSearch(e.target.value)}
            onKeyPress={onSearch}
          />
        </div>
        <div className={data.getCityByName.weather.temperature.actual > 16 ? 'card-warm' : 'card-cold'}>
          {(typeof data.getCityByName != "undefined") ? (
            <div className="cardDetails">
              <div className="weather-details">
                {dateBuilder(new Date())}
                <img src={sunOrRainImage} alt="sun"></img>
                <div className="temperature">{temperature}°</div>
                <div className="condition">{data.getCityByName.weather.summary.title.toUpperCase()}</div>
              </div>
              <div className="city-container">
                <div className="city-details">
                  <p className="city-name">{cityNameSlice.toUpperCase()}</p>
                  <p className="country">{data.getCityByName.country}</p>
                </div>
              </div>
            </div>
          ) : ('')}
        </div>
      </div>
    </div>
    
  )
}

export default App;
