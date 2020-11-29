import * as express from "express"
import { ReqAndResController } from "../controllers/ReqAndResController"
import { VocabularyModel } from "../models/VocabularyModel"

export class VocabularyController extends ReqAndResController {
  constructor(
    req: express.Request,
    res: express.Response
  ) {
    super(req, res)
  }

  async prepareResponse(): Promise<void> {
    let language = this.body.language
    this.response = await VocabularyModel.findVocabulary(language)
  }
}