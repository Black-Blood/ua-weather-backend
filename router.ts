import * as express from "express"

import { VocabularyController } from "./controllers/VocabularyController"
import { SettlementController } from "./controllers/SettlementController"
import { WeatherController } from "./controllers/WeatherController"
import { PopularRequestsController } from "./controllers/PopularRequestsController"

let controller: VocabularyController | SettlementController | WeatherController | PopularRequestsController

const router = express.Router()

router.post("/getVocabulary", (req: express.Request, res: express.Response, next) => {
  controller = new VocabularyController(req, res)
  next()
})
router.post("/findSettlement", (req: express.Request, res: express.Response, next) => {
  controller = new SettlementController(req, res)
  next()
})
router.post("/getWeather", (req: express.Request, res: express.Response, next) => {
  controller = new WeatherController(req, res)
  next()
})
router.post("/getPopularRequests", (req: express.Request, res: express.Response, next) => {
  controller = new PopularRequestsController(req, res)
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