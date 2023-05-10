import { useEffect, useState } from 'react'
import './App.css'
import { weather } from './data'
import axios from "axios";
import wIcon from "./assets/sunny.png";
import { toast } from "react-hot-toast";

function App() {
  const defaultLink = "https://images.pexels.com/photos/125510/pexels-photo-125510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
  // const iconImage = weather.filter((e) => (e.code===2000))[0]?.icon;
  const [location, setLocation] = useState("");  // --> Used for getting location from user 
  const [customProperties, setCustomProperties] = useState({
    code: 0,
    weather: "Unknown",
    icon: wIcon,
    bgImage: defaultLink,
  })
  const [weatherProperties, setWeatherProperties] = useState({
    weatherCode: 0,
    humidity: 12,
    location: "Default",
    temprature: 37,
    tempratureApparent: 42,
    visibility: 10,
    data: {},
  })


  useEffect(() => {
    axios.get(`http://localhost:3000/current`)
    .then((res) => {
      setLocation(res.data?.location);
      getData();
      toast.success("Got your data");
    })
    .catch((err) => {
      toast.error("Something went wrong")
      console.log(err)
    })
  },[])


  // Custom API call
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`http://localhost:3000`, {
        location
      },{
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      setWeatherProperties({
        weatherCode: data.weatherCode,
        humidity: data.humidity,
        location: data.location,
        temprature: data.temprature,
        tempratureApparent: data.tempratureApparent,
        visibility: data.visibility,
        data: data.data,
      })
      setCustomProperties({
        code: weatherProperties.weatherCode,
        weather: weather.filter((e) => (e.code===weatherProperties.weatherCode))[0]?.weather,
        icon: weather.filter((e) => (e.code===weatherProperties.weatherCode))[0]?.icon,
        bgImage: weather.filter((e) => (e.code===weatherProperties.weatherCode))[0]?.bgImage,
      })
      // // console.log(weather.filter((e) => (e.code===weatherProperties.weatherCode))[0]?.icon)
      // console.log(data)
      // console.log(weatherProperties.data)
      toast.success("Updated your custom data")
    } catch (error) {
      toast.error("Something Went Wrong, Try again later")
      console.log(error)
    }
  }


  async function getData(){
    const { data } = await axios.post(`http://localhost:3000`, {
      location
    },{
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    setWeatherProperties({
      weatherCode: data.weatherCode,
      humidity: data.humidity,
      location: data.location,
      temprature: data.temprature,
      tempratureApparent: data.tempratureApparent,
      visibility: data.visibility,
      data: data.data,
    })
     setCustomProperties({
      code: weatherProperties.weatherCode,
      weather: weather.filter((e) => (e.code===weatherProperties.weatherCode))[0]?.weather,
      icon: weather.filter((e) => (e.code===weatherProperties.weatherCode))[0]?.icon,
      bgImage: weather.filter((e) => (e.code===weatherProperties.weatherCode))[0]?.bgImage,
    })
    // console.log("You got your initial data boii")
  }



  
  return (
    <div className='container'>
      <div className='imageinfo'>
        <div className="image">
          <img className='imgContain' src={customProperties.bgImage? customProperties.bgImage:defaultLink} alt="" />
        </div>
        <div className='info'>
          <div className='heading'>
            <p>Additionl Details</p>
          </div>
          <div className='content'>
            <div className='item'>Temp feels like: {weatherProperties.tempratureApparent}°C</div>
            <div className="item">Pressure at Surface: {weatherProperties.data.pressureSurfaceLevel}</div>
            <div className="item">Visibility: {weatherProperties.data.visibility}</div>
            <div className="item">Wind speed: {weatherProperties.data.windSpeed}</div>
            <div className="item">Cloud Cover: {weatherProperties.data.cloudCover}</div>
            <div className="item">UV-Index: {weatherProperties.data.uvIndex}</div>
            <div className="item">Rain Intensity: {weatherProperties.data.rainIntensity}</div>
            <div className="item">Snow Intensity: {weatherProperties.data.snowIntensity}</div>
          </div>
        </div>
      </div>

      {/*  SearchBar for Specific location */}
      <div className='search'>
        <div className='icon'>
          <img className='iconContain' width={84} height={84} src={(customProperties.icon )? customProperties.icon : wIcon} alt="" />
        </div>
        <div className='searchBar'>
          <form onSubmit={handleSubmit}>
            <input value={location} onChange={(e) => setLocation(e.target.value)} type="text" placeholder='Enter Location:' />
            <button class="button">Find</button>
            {/* <button >Find</button> */}
          </form>
        </div>

        {/*  Weather Details for particular location */}
        <div className='weatherDetails'>
          <div className='heading'>
            <p>Weather Details</p>
          </div>
          <h4 className="detail">{customProperties.weather}</h4>
          <p className="detail">Location: {customProperties.location}</p>
          <p className="detail">Temp: {weatherProperties.temprature}</p>
          <p className="detail">Humidity: {weatherProperties.humidity}</p>
        </div>
      </div>
     
    </div>
  )
}

export default App
