import axios from "axios";

export const WeatherApi = axios.create({
  baseURL: "http://api.weatherapi.com/v1",
  params: {
    key: process.env.WEATHER_API,
  },
});
