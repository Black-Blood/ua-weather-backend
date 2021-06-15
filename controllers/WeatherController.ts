import * as express from "express"
import * as settings from "../settings"
import * as WeatherModel from "../models/WeatherModel"
import { ReqAndResController } from "./ReqAndResController"

export class WeatherController extends ReqAndResController {
  constructor(
    req: express.Request,
    res: express.Response
  ) {
    super(req, res)
  }

  async PrepareResponse(): Promise<void> {
    if (
      this.body.coordinates !== undefined &&
      this.body.language !== undefined &&
      settings.server.supportingLanguages.includes(this.body.language.toLowerCase())
    ) {
      let dataFromAPI = await WeatherModel.GetDataFromAPI(this.body.language, this.body.coordinates)

      if (dataFromAPI === false) {
        this.response = false
      } else {
        this.response = await WeatherModel.PrepareDataFromAPI(dataFromAPI)
      }
    }
  }
}
