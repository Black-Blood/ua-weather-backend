import * as fs from "fs"
import { isLanguage } from "../lib/functions"
import { IVocabulary } from "../lib/interfaces"

export class VocabularyModel {
  static async findVocabulary(language: string): Promise<false | string> {
    if (!isLanguage(language)) {
      return false
    }

    let vocabularies = (<IVocabulary>JSON.parse(fs.readFileSync(__dirname + "/../data/vocabulary.json", "utf-8"))).vocabularies

    let result = vocabularies.find(vocabulary => vocabulary.language === language)

    return JSON.stringify(result)
  }
}