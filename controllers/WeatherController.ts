import * as express from "express"
import { PopularRequestsModel } from "../models/PopularRequestsModel"
import { WeatherModel } from "../models/WeatherModel"
import { ReqAndResController } from "./ReqAndResController"

export class WeatherController extends ReqAndResController {
  constructor(
    req: express.Request,
    res: express.Response
  ) {
    super(req, res)
  }

  async prepareResponse(): Promise<void> {
    let coordinates = this.body.coordinates || this.body.settlement.coordinates

    if (this.body.settlement !== undefined) {
      PopularRequestsModel.updateRate(this.body.settlement.id)
    }

    let dataFromAPI = await WeatherModel.getDataFromAPI(this.body.language, coordinates)

    if (dataFromAPI === false) {
      this.response = false
    } else {
      this.response = await WeatherModel.prepareDataFromAPI(dataFromAPI, this.body.language)
    }
  }
}
