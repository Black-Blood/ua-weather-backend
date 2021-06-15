import * as express from "express"
import * as settings from "../settings"
import * as SettlementModel from "../models/SettlementModel"
import { ReqAndResController } from "./ReqAndResController"



export class SettlementController extends ReqAndResController {
  constructor(
    req: express.Request,
    res: express.Response
  ) {
    super(req, res)
  }

  async PrepareResponse() {
    if (
      this.body.searchSettlement !== undefined && // Не передали рядок з пошуку
      this.body.language !== undefined && // Не передали мову тексту
      settings.server.supportingLanguages.includes(this.body.language.toLowerCase()) // отримана мова не підтримується сервером
    ) {
      this.response = await SettlementModel.FindSettlement(this.body.searchSettlement, this.body.language)
    }
  }
}