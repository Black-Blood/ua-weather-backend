import * as express from "express"
import { IRequestsBody } from "../lib/interfaces"

export abstract class ReqAndResController {
  protected response: false | string

  constructor(
    protected req: express.Request,
    protected res: express.Response,
  ) { }

  get body(): IRequestsBody {
    return <IRequestsBody>(this.req.body)
  }

  giveResponse() {
    if (this.response !== false) {
      this.res.json(this.response)
    } else {
      this.res.sendStatus(400)
    }
  }

  abstract prepareResponse(): Promise<void>
}