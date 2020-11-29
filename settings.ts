import { CorsOptions } from "cors"

const cors: CorsOptions = {
  origin: "https://ua-weather.herokuapp.com"
}

export const server = {
  port: process.env.PORT || 8080,

  maxPopularRequests: 12,
  maxFoundedCity: 100,

  supportingLanguages: ["ua", "en"],
  APIKEY: "aa8166d5cdfe4a00d121c327db4e38b1",

  cors: cors
}
