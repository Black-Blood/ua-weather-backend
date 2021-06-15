import * as fs from "fs"
import * as settings from "../settings"
import { ISettlement, ISettlementData } from "./interfaces"

export function isLanguage(language: string): boolean {
  return settings.server.supportingLanguages.includes(language)
}

export function prepareSettlement(listOfSettlements: ISettlementData, settlementID: number): ISettlement {
  let tempSettlement = listOfSettlements.settlements.find(settlement => settlement.id === settlementID)
  let tempArea = listOfSettlements.areas.find(area => area.id === tempSettlement.areaID)
  let tempRegion = listOfSettlements.regions.find(region => region.id === tempSettlement.regionID)
  let tempRate = listOfSettlements.rates.find(region => region.settlementID === settlementID)

  let result: ISettlement = {
    id: tempSettlement.id,

    rate: (tempRate !== undefined) ? tempRate.rate : undefined,

    settlementRadius: tempSettlement.settlementRadius,

    names: tempSettlement.names,

    areaNames: (tempArea !== undefined) ? tempArea.names : undefined,

    regionNames: (tempRegion !== undefined) ? tempRegion.names : undefined,

    coordinates: tempSettlement.coordinates,
  }

  return result
}

export function getDataOfSettlements(): ISettlementData {
  return <ISettlementData>(JSON.parse(fs.readFileSync(__dirname + "/../data/settlements.json", "utf-8")))
}

export function updateDataOfSettlements(data: string) {
  fs.writeFileSync(__dirname + "/../data/settlements.json", data)
}