import * as express from "express"
import { ReqAndResController } from "./ReqAndResController"

export class PopularRequestsController extends ReqAndResController {
  constructor(
    req: express.Request,
    res: express.Response
  ) {
    super(req, res)
  }

  async prepareResponse(): Promise<void> {
  }
}