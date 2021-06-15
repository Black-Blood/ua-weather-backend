import * as settings from "../settings"
import * as fetch from "node-fetch"
import { IAPIDaily, IAPIData, IAPIHourly, ICoordinates, ISettlementsWeather, IWeather } from "../lib/interfaces";
import { isLanguage } from "../lib/functions";
import { Atmosphere, Description, Precipitation, Temperature, Weather, Wind } from "../lib/weather";

export class WeatherModel {
  static async getDataFromAPI(language: string, coordinates?: ICoordinates): Promise<IAPIData | false> {
    if (!isLanguage(language)) {
      return false
    }

    return await fetch.default(
      "https://api.openweathermap.org/data/2.5/onecall" + "?" +
      "lat=" + coordinates.latitude + "&" +
      "lon=" + coordinates.longitude + "&" +
      "exclude=minutely,current" + "&" +
      "lang=" + language + "&" +
      "appid=" + settings.server.APIKEY
    ).then(res => res.json()).then(
      (data) => {
        if (data.message !== undefined) {
          return false
        }
        return (<IAPIData>data)
      },
      (error) => {
        return false
      }
    )
  }

  static async prepareDataFromAPI(dataFromAPI: IAPIData, language: string): Promise<string> {
    if (!isLanguage(language)) {
      language = "ua"
    }

    return JSON.stringify(this.parseAPIWeather(dataFromAPI, language))
  }

  private static parseAPIWeather(dataFromAPI: IAPIData, language: string): ISettlementsWeather {
    let result: ISettlementsWeather = {
      hourly: [],
      daily: []
    }

    dataFromAPI.hourly.forEach(
      hour => {
        result.hourly.push(this.returnWeatherData(this.handleWeatherData(hour, language)))
      }
    )
    dataFromAPI.daily.forEach(
      day => {
        result.daily.push(this.returnWeatherData(this.handleWeatherData(day, language)))
      }
    )

    return result
  }

  private static handleWeatherData(data: IAPIDaily | IAPIHourly, language: string): Weather {
    let checkType = function (type: IAPIDaily | IAPIHourly): type is IAPIDaily {
      return (type as IAPIDaily).sunrise !== undefined
    }

    return new Weather(
      language,
      new Date(data.dt * 1000),
      new Temperature(
        (typeof data.temp !== "number") ? data.temp.min : undefined,
        (typeof data.temp !== "number") ? data.temp.max : undefined,
        data.dew_point,
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
      new Atmosphere(
        language,
        (checkType(data)) ? new Date(data.sunrise * 1000) : undefined,
        (checkType(data)) ? new Date(data.sunset * 1000) : undefined,
        data.pressure,
        data.humidity,
        data.clouds,
        data.visibility
      ),
      new Description(
        data.weather[0].main,
        data.weather[0].description,
        data.weather[0].icon,
      )
    )
  }

  private static returnWeatherData(weather: Weather): IWeather {
    return {
      atmosphere: {
        clouds: <number>weather.atmosphere.getAtmosphere("clouds"),
        humidity: <number>weather.atmosphere.getAtmosphere("humidity"),
        pressure: <number>weather.atmosphere.getAtmosphere("pressure"),
        sunrise: <string>weather.atmosphere.getAtmosphere("sunrise"),
        sunset: <string>weather.atmosphere.getAtmosphere("sunset"),
        visibility: <number>weather.atmosphere.getAtmosphere("visibility"),
      },
      description: {
        allText: weather.description.allText,
        icon: weather.description.icon,
        main: weather.description.main
      },
      precipitation: {
        probability: weather.precipitation.getPrecipitation("probability"),
        rain: weather.precipitation.getPrecipitation("rain"),
        snow: weather.precipitation.getPrecipitation("snow")
      },
      temperature: {
        min: weather.temperature.getTemperature({ simple: "min" }),
        max: weather.temperature.getTemperature({ simple: "max" }),
        dewPoint: weather.temperature.getTemperature({ simple: "dewPoint" }),
        real: {
          current: weather.temperature.getTemperature({ complex: ["real", "current"] }),
          afternoon: weather.temperature.getTemperature({ complex: ["real", "afternoon"] }),
          evening: weather.temperature.getTemperature({ complex: ["real", "evening"] }),
          morning: weather.temperature.getTemperature({ complex: ["real", "morning"] }),
          night: weather.temperature.getTemperature({ complex: ["real", "night"] }),
        },
        feelsLike: {
          current: weather.temperature.getTemperature({ complex: ["feelsLike", "current"] }),
          afternoon: weather.temperature.getTemperature({ complex: ["feelsLike", "afternoon"] }),
          evening: weather.temperature.getTemperature({ complex: ["feelsLike", "evening"] }),
          morning: weather.temperature.getTemperature({ complex: ["feelsLike", "morning"] }),
          night: weather.temperature.getTemperature({ complex: ["feelsLike", "night"] }),
        }
      },
      wind: {
        direction: weather.wind.getWind("direction"),
        gust: weather.wind.getWind("gust"),
        speed: weather.wind.getWind("speed")
      },
      day: weather.day,
      time: weather.time
    }
  }
}
