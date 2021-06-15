import { CorsOptions } from "cors"

export const server = {
  port: process.env.PORT || 8080,
  maxFoundSettlements: 10,

  supportingLanguages: ["ua", "en"],
  APIKEY: "aa8166d5cdfe4a00d121c327db4e38b1",

  cors: <CorsOptions>{
    // origin: "http://"
  }
}
