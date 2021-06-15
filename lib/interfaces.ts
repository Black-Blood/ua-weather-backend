//* Запити на сервер
export interface IRequestsBody {
  language: string
  coordinates?: ICoordinates
  searchSettlement?: string
}

export interface ICoordinates {
  longitude: number
  latitude: number
}

//* Відповіді від сервера
export interface ISettlement {
  id: number

  names: {}
  areaNames?: {}
  regionNames?: {}

  coordinates: ICoordinates
}

export interface ISettlementsWeather {
  hourly: IWeather[]
  daily: IWeather[]
}

export interface IWeather {
  sun?: {
    sunrise?: string
    sunset?: string
  }
  general?: {
    clouds?: number
    humidity?: number
    pressure?: number
    dewPoint?: number
  }
  description?: {
    allText?: string
    icon?: string
    main?: string
  }
  precipitation?: {
    probability?: number
    rain?: number
    snow?: number
  }
  temperature?: {
    min?: number
    max?: number
    real?: {
      current?: number
      afternoon?: number
      evening?: number
      morning?: number
      night?: number
    }
    feelsLike?: {
      current?: number
      afternoon?: number
      evening?: number
      morning?: number
      night?: number
    }
  }
  wind?: {
    direction?: number
    gust?: number
    speed?: number
  }
  day?: string
  time?: string
}

//* Зберігання даних
export interface ISettlementsData {
  settlements: ISettlementData[]
  regions: IRegionData[]
  areas: IAreaData[]
}

export interface ISettlementData {
  id: number
  regionID?: number
  areaID?: number

  names: {}

  coordinates: {
    longitude: number
    latitude: number
  }
}

export interface IRegionData {
  id: number
  names: {}
}

export interface IAreaData {
  id: number
  names: {}
}


//* Дані від API 
export interface IAPIData {
  lat: number
  lon: number
  timezone: string
  timezone_offset: number

  hourly: IAPIHourly[]
  daily: IAPIDaily[]
}

export interface IAPIHourly {
  dt: number
  temp: number
  feels_like: number
  pressure: number
  humidity: number
  dew_point: number
  clouds: number
  visibility: number
  wind_speed: number
  wind_gust: number
  wind_deg: number
  pop: number
  rain: {
    "1h": number
  }
  snow: {
    "1h": number
  }
  weather: {
    id: number
    main: string
    description: string
    icon: string
  }[]
}

export interface IAPIDaily {
  dt: number
  sunrise: number
  sunset: number
  temp: {
    morn: number
    day: number
    eve: number
    night: number
    min: number
    max: number
  };
  feels_like: {
    morn: number
    day: number
    eve: number
    night: number
  };
  pressure: number
  humidity: number
  dew_point: number
  wind_speed: number
  wind_gust: number
  wind_deg: number
  clouds: number
  uvi: number
  visibility: number
  pop: number
  rain: number
  snow: number
  weather: {
    id: number
    main: string
    description: string
    icon: string
  }[]
}