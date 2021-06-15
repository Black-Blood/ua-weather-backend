import { server } from "../settings"
import * as fs from "fs"
import { ISettlement, ISettlementData, ISettlementsData } from "../lib/interfaces"

export async function FindSettlement(searchSettlement: string, language: string): Promise<string> {
  let listOfSettlements = <ISettlementsData>(JSON.parse(fs.readFileSync(__dirname + "/../data/settlements.json", "utf-8")))

  //! 0- settlement, 1- area, 2- region
  let searchSettlementComponents = searchSettlement.split(",")

  let searchSettlementName = searchSettlementComponents[0]?.trim()?.toLowerCase()
  let searchAreaName = searchSettlementComponents[1]?.trim()?.toLowerCase()
  let searchRegionName = searchSettlementComponents[2]?.trim()?.toLowerCase()




  let matchList: ISettlementsData = {
    settlements: [],
    areas: [],
    regions: [],
  }


  // Виконуємо пошук
  if (searchSettlementName !== undefined) {
    listOfSettlements.settlements.forEach(settlement => {
      settlement.names[language].toLowerCase().includes(searchSettlementName) ? matchList.settlements.push(settlement) : undefined
    })
  }

  if (searchAreaName !== undefined) {
    listOfSettlements.areas.forEach(area => {
      area.names[language].toLowerCase().includes(searchAreaName) ? matchList.areas.push(area) : undefined
    })
  }

  if (searchRegionName !== undefined) {
    listOfSettlements.regions.forEach(region => {
      region.names[language].toLowerCase().includes(searchRegionName) ? matchList.regions.push(region) : undefined
    })
  }

  let tempResult: ISettlementData[] = matchList.settlements

  tempResult = tempResult.filter(settlement => {
    if (matchList.regions.length === 0 && searchRegionName !== undefined) return false
    if (matchList.regions.length === 0) return true

    return matchList.regions.filter(region => region.id === settlement.regionID).length > 0
  })

  tempResult = tempResult.filter(settlement => {
    if (matchList.areas.length === 0 && searchAreaName !== undefined) return false
    if (matchList.areas.length === 0) return true

    return matchList.areas.filter(area => area.id === settlement.areaID).length > 0
  })
  // Якщо результат є - готуємо відповідь
  let result: ISettlement[] = []

  for (let i = 0; i < server.maxFoundSettlements && i < tempResult.length; i++) {
    result.push(PrepareSettlement(listOfSettlements, tempResult[i].id))
  }


  return JSON.stringify(result)
}


function PrepareSettlement(listOfSettlements: ISettlementsData, settlementID: number): ISettlement {
  let tempSettlement = listOfSettlements.settlements.find(settlement => settlement.id === settlementID)
  let tempArea = listOfSettlements.areas.find(area => area.id === tempSettlement.areaID)
  let tempRegion = listOfSettlements.regions.find(region => region.id === tempSettlement.regionID)

  let result: ISettlement = {
    id: tempSettlement.id,

    names: tempSettlement.names,
    areaNames: (tempArea !== undefined) ? tempArea.names : undefined,
    regionNames: (tempRegion !== undefined) ? tempRegion.names : undefined,

    coordinates: tempSettlement.coordinates,
  }

  return result
}