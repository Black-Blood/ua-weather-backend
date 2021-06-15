import * as express from "express"

import { ReqAndResController } from "./controllers/ReqAndResController"
import { SettlementController } from "./controllers/SettlementController"
import { WeatherController } from "./controllers/WeatherController"

let controller: ReqAndResController

const router = express.Router()

router.post("/findSettlement", (req: express.Request, res: express.Response, next) => {
  controller = new SettlementController(req, res)
  next()
})
router.post("/getWeather", (req: express.Request, res: express.Response, next) => {
  controller = new WeatherController(req, res)
  next()
})

router.use("/", async (req: express.Request, res: express.Response) => {
  if (controller === undefined) {
    res.sendStatus(404)
  } else {
    await controller.prepareResponse()
    controller.giveResponse()
  }
})

export default router