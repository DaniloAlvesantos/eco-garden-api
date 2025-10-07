import axios from "axios";

const API_KEY = process.env.RAPID_API_GEOCODING_KEY;

export const MapData = axios.create({
  baseURL: "https://maps-data.p.rapidapi.com",
  headers: {
    "x-rapidapi-key": API_KEY,
    "x-rapidapi-host": "maps-data.p.rapidapi.com",
  },
});
