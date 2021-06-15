import { isLanguage } from "./functions"

export interface ITemperatureAllDay {
  current?: number
  morning?: number
  afternoon?: number
  evening?: number
  night?: number
}

export class Temperature {
  constructor(
    private min?: number,
    private max?: number,
    private dewPoint?: number,
    private real?: ITemperatureAllDay,
    private feelsLike?: ITemperatureAllDay
  ) { }

  private convertKelvinToCelsius(value: number): number {
    const KELVINE = 273.15
    return Math.round(value - KELVINE)
  }

  getTemperature(param: {
    simple?: "min" | "max" | "dewPoint"
    complex?: ["real" | "feelsLike", "current" | "morning" | "afternoon" | "evening" | "night"]
  }): number {
    if (param.simple !== undefined && this[param.simple] !== undefined) {
      return this.convertKelvinToCelsius(this[param.simple])
    }

    if (param.complex !== undefined && this[param.complex[0]][param.complex[1]] !== undefined) {
      return this.convertKelvinToCelsius(this[param.complex[0]][param.complex[1]])
    }

    return undefined
  }
}

export class Wind {
  constructor(
    private speed?: number,
    private direction?: number,
    private gust?: number
  ) {
    this.direction = this.selectDirection(this.direction)
  }

  private selectDirection(directionDeg: number): number {
    let calculateDirection = Math.round(directionDeg / 45)

    if (calculateDirection > 7) {
      calculateDirection -= 8
    }

    return calculateDirection
  }

  getWind(param: "speed" | "gust" | "direction"): number {
    if (param !== undefined && this[param] != undefined) {
      return this[param]
    }

    return undefined
  }
}

export class Precipitation {
  constructor(
    private probability?: number,
    private rain?: number,
    private snow?: number
  ) {
    this.probability = Math.round(this.probability)
  }

  getPrecipitation(param: "probability" | "rain" | "snow") {
    if (param == undefined || this[param] == undefined) {
      return undefined
    }

    return this[param]
  }
}

export class Atmosphere {
  sunrise: string
  sunset: string

  constructor(
    language: string,
    sunrise: Date,
    sunset: Date,
    private pressure: number,
    private humidity: number,
    private clouds: number,
    private visibility: number
  ) {
    this.humidity = Math.round(this.humidity)
    this.clouds = Math.round(this.clouds)
    this.pressure = this.convertPressure(this.pressure)

    this.sunrise = Time.getTime(language, sunrise)
    this.sunset = Time.getTime(language, sunset)
  }

  private convertPressure(value: number): number {
    const mmHg = 0.75
    return value * mmHg
  }

  getAtmosphere(param: "clouds" | "humidity" | "visibility" | "pressure" | "sunrise" | "sunset") {
    if (param == undefined || this[param] === undefined) {
      return undefined
    }

    return this[param]
  }
}

export class Description {
  constructor(
    public main: string,
    public allText: string,
    public icon: string,
  ) { }
}

export class Weather {
  constructor(
    private language: string,
    private date: Date,
    public temperature: Temperature,
    public wind: Wind,
    public precipitation: Precipitation,
    public atmosphere: Atmosphere,
    public description: Description
  ) { }

  get day(): string {
    return Time.getDate(this.date)
  }

  get time(): string {
    return Time.getTime(this.language, this.date)
  }
}

export class Time {
  static getDate(date: Date) {
    if (date === undefined) {
      return undefined
    }

    let day: string, month: string, year: string

    if (date.getDate() < 10) {
      day = "0" + date.getDate()
    } else {
      day = String(date.getDate())
    }

    if (date.getMonth() + 1 < 10) {
      month = "0" + (date.getMonth() + 1)
    } else {
      month = String(date.getMonth() + 1)
    }

    year = String(date.getFullYear())

    return day + "." + month + "." + year
  }

  static getTime(language: string, date: Date) {
    if (date === undefined) {
      return undefined
    }

    if (!isLanguage(language)) {
      language = "ua"
    }

    if (language == "en") {
      let hour: string
      let minute: string

      let temptHours = date.getHours()
      let AmOrPm = (temptHours >= 12) ? 'PM' : 'AM'

      temptHours = (temptHours % 12) || 12

      if (temptHours < 10) {
        hour = "0" + temptHours
      } else {
        hour = String(temptHours)
      }

      let tempMinutes = date.getMinutes()
      if (tempMinutes < 10) {
        minute = "0" + tempMinutes
      } else {
        minute = String(tempMinutes)
      }

      return hour + ":" + minute + " " + AmOrPm
    } else {
      let hour: string
      let minute: string

      if (date.getHours() < 10) {
        hour = "0" + date.getHours()
      } else {
        hour = String(date.getHours())
      }

      if (date.getMinutes() < 10) {
        minute = "0" + date.getMinutes()
      } else {
        minute = String(date.getMinutes())
      }

      return hour + ":" + minute
    }
  }
}