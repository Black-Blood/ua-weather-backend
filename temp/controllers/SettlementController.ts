import * as express from "express"
import { SettlementModel } from "../models/SettlementModel"
import { ReqAndResController } from "./ReqAndResController"

export class SettlementController extends ReqAndResController {
  constructor(
    req: express.Request,
    res: express.Response
  ) {
    super(req, res)
  }

  async prepareResponse() {
    if (this.body.searchSettlement !== undefined) {
      this.response = SettlementModel.findSettlement(this.body.searchSettlement)
    }
  }
}