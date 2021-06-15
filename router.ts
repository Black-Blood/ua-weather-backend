import * as express from "express"
import { SettlementController } from "./controllers/SettlementController"
import { WeatherController } from "./controllers/WeatherController"

const router = express.Router()

router.post("/findSettlement", async (req: express.Request, res: express.Response, next) => {
  let controller = new SettlementController(req, res)

  await controller.PrepareResponse()
  controller.GiveResponse()
})
router.post("/getWeather", async (req: express.Request, res: express.Response, next) => {
  let controller = new WeatherController(req, res)

  await controller.PrepareResponse()
  controller.GiveResponse()
})

router.use("/", (req: express.Request, res: express.Response) => {
  res.sendStatus(404)
})

export default router