import * as fs from "fs";
import * as settings from "../settings"
import { ISettlementData } from "../lib/interfaces";
import { getDataOfSettlements, prepareSettlement } from "../lib/functions";

export class SettlementModel {
  static findSettlement(searchSettlement: string): false | string {
    let listOfSettlements = getDataOfSettlements()

    //! 0- settlement, 1- region, 2- area
    let searchSettlementComponents = searchSettlement.split(",")

    searchSettlementComponents.forEach((element, index, array) => {
      element = element.trim()
      array[index] = element
    })

    let listOfFoundSettlements: ISettlementData = {
      "settlements": [],
      "areas": [],
      "regions": []
    }

    if (searchSettlementComponents[2] !== undefined) {
      listOfSettlements.areas.forEach(area => {
        settings.server.supportingLanguages.forEach(language => {
          if (area.names[language].toLowerCase().includes(searchSettlementComponents[2].toLowerCase())) {
            listOfFoundSettlements.areas.push(area)
          }
        })
      })
    }

    if (searchSettlementComponents[1] !== undefined) {
      listOfSettlements.regions.forEach(region => {
        settings.server.supportingLanguages.forEach(language => {
          if (region.names[language].toLowerCase().includes(searchSettlementComponents[1].toLowerCase())) {
            listOfFoundSettlements.regions.push(region)
          }
        })
      })
    }

    if (searchSettlementComponents[0] !== undefined) {
      listOfSettlements.settlements.forEach(settlement => {
        settings.server.supportingLanguages.forEach(language => {
          if (settlement.names[language].toLowerCase().includes(searchSettlementComponents[0].toLowerCase())) {
            listOfFoundSettlements.settlements.push(settlement)
          }
        })
      })
    }

    let result = []

    for (let i = 0; i < listOfFoundSettlements.settlements.length; i++) {
      let settlement = listOfFoundSettlements.settlements[i]
      if (
        (
          searchSettlementComponents[2] !== undefined &&
          (listOfFoundSettlements.areas.findIndex(region => region.id === settlement.areaID) === -1)
        ) ||
        (
          searchSettlementComponents[1] !== undefined &&
          (listOfFoundSettlements.regions.findIndex(region => region.id === settlement.regionID) === -1)
        )
      ) {
        continue
      }

      result.push(prepareSettlement(listOfSettlements, settlement.id))
    }

    let arr = []

    for (let i = 0; i < settings.server.maxFoundedCity; i++) {
      arr.push(result[i])
    }

    return JSON.stringify(arr)
  }
}
