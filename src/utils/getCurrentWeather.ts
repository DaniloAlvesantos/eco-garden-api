import type { CurrentWeather } from "../@types/weatheApi.type";
import { WeatherApi } from "../lib/weather";

type props = {
  q: {
    city?: string;
    lat?: number;
    lon?: number;
  };
};

export const getCurrentWeather = async ({ q }: props) => {
  let param;
  if (q.lat && q.lon) {
    param = `lat=${q.lat}&lon=${q.lon}`;
  } else if (q.city) {
    param = `q=${q.city}`;
  } else {
    param = null;
  }

  if (param === null) return;

  const response = await WeatherApi.get<CurrentWeather>("/current.json", {
    params: {
      q: param,
    },
  });

  return response.data;
};
