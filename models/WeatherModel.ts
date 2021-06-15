import * as settings from "../settings"
import * as fetch from "node-fetch"
import { IAPIDaily, IAPIData, IAPIHourly, ICoordinates, ISettlementsWeather, IWeather } from "../lib/interfaces";
import { General, Sun, Description, Precipitation, Temperature, Weather, Wind } from "../lib/weather";

export async function GetDataFromAPI(language: string, coordinates?: ICoordinates): Promise<IAPIData | false> {
  return await fetch.default(
    "https://api.openweathermap.org/data/2.5/onecall" + "?" +
    "lat=" + coordinates.latitude + "&" +
    "lon=" + coordinates.longitude + "&" +
    "exclude=minutely,current" + "&" +
    "lang=" + language + "&" +
    "appid=" + settings.server.APIKEY
  ).then(res => res.json()).then(
    (data) => (data.message !== undefined) ? false : (<IAPIData>data),
    () => false
  )
}

export async function PrepareDataFromAPI(dataFromAPI: IAPIData): Promise<string> {
  return JSON.stringify(ParseAPIWeather(dataFromAPI))
}

function ParseAPIWeather(dataFromAPI: IAPIData): ISettlementsWeather {
  let result: ISettlementsWeather = {
    hourly: [],
    daily: []
  }

  dataFromAPI.hourly.forEach(
    hour => result.hourly.push(ReturnWeatherData(HandleWeatherData(hour)))
  )
  dataFromAPI.daily.forEach(
    day => result.daily.push(ReturnWeatherData(HandleWeatherData(day)))
  )

  return result
}

function HandleWeatherData(data: IAPIDaily | IAPIHourly): Weather {
  let checkType = function (type: IAPIDaily | IAPIHourly): type is IAPIDaily {
    return (type as IAPIDaily).sunrise !== undefined
  }

  return new Weather(
    new Date(data.dt * 1000),
    new Temperature(
      (typeof data.temp !== "number") ? data.temp.min : undefined,
      (typeof data.temp !== "number") ? data.temp.max : undefined,
      {
        current: (typeof data.temp === "number") ? data.temp : undefined,
        morning: (typeof data.temp !== "number") ? data.temp.morn : undefined,
        afternoon: (typeof data.temp !== "number") ? data.temp.day : undefined,
        evening: (typeof data.temp !== "number") ? data.temp.eve : undefined,
        night: (typeof data.temp !== "number") ? data.temp.night : undefined,
      },
      {
        current: (typeof data.feels_like === "number") ? data.feels_like : undefined,
        morning: (typeof data.feels_like !== "number") ? data.feels_like.morn : undefined,
        afternoon: (typeof data.feels_like !== "number") ? data.feels_like.day : undefined,
        evening: (typeof data.feels_like !== "number") ? data.feels_like.eve : undefined,
        night: (typeof data.feels_like !== "number") ? data.feels_like.night : undefined,
      }
    ),
    new Wind(
      data.wind_speed,
      data.wind_deg,
      data.wind_gust,
    ),
    new Precipitation(
      data.pop * 100,
      (typeof data.rain === "number" && data.rain !== undefined) ? data.rain : (data.rain !== undefined) ? data.rain["1h"] : undefined,
      (typeof data.snow === "number" && data.snow !== undefined) ? data.snow : (data.snow !== undefined) ? data.snow["1h"] : undefined,
    ),
    new Sun(
      (checkType(data)) ? new Date(data.sunrise * 1000) : undefined,
      (checkType(data)) ? new Date(data.sunset * 1000) : undefined,
    ),
    new General(
      data.pressure,
      data.humidity,
      data.clouds,
      data.dew_point,
    ),
    new Description(
      data.weather[0].main,
      data.weather[0].description,
      data.weather[0].icon,
    )
  )
}

function ReturnWeatherData(weather: Weather): IWeather {
  return {
    sun: {
      sunrise: <string>weather.sun.getParam("sunrise"),
      sunset: <string>weather.sun.getParam("sunset"),
    },
    general: {
      clouds: <number>weather.general.getParam("clouds"),
      humidity: <number>weather.general.getParam("humidity"),
      pressure: <number>weather.general.getParam("pressure"),
      dewPoint: weather.general.getParam("dewPoint"),
    },
    description: {
      allText: weather.description.allText,
      icon: weather.description.icon,
      main: weather.description.main
    },
    precipitation: {
      probability: weather.precipitation.getParam("probability"),
      rain: weather.precipitation.getParam("rain"),
      snow: weather.precipitation.getParam("snow")
    },
    temperature: {
      min: weather.temperature.getParam({ simple: "min" }),
      max: weather.temperature.getParam({ simple: "max" }),
      real: {
        current: weather.temperature.getParam({ complex: ["real", "current"] }),
        afternoon: weather.temperature.getParam({ complex: ["real", "afternoon"] }),
        evening: weather.temperature.getParam({ complex: ["real", "evening"] }),
        morning: weather.temperature.getParam({ complex: ["real", "morning"] }),
        night: weather.temperature.getParam({ complex: ["real", "night"] }),
      },
      feelsLike: {
        current: weather.temperature.getParam({ complex: ["feelsLike", "current"] }),
        afternoon: weather.temperature.getParam({ complex: ["feelsLike", "afternoon"] }),
        evening: weather.temperature.getParam({ complex: ["feelsLike", "evening"] }),
        morning: weather.temperature.getParam({ complex: ["feelsLike", "morning"] }),
        night: weather.temperature.getParam({ complex: ["feelsLike", "night"] }),
      }
    },
    wind: {
      direction: weather.wind.getParam("direction"),
      gust: weather.wind.getParam("gust"),
      speed: weather.wind.getParam("speed")
    },
    day: weather.day,
    time: weather.time
  }
}

