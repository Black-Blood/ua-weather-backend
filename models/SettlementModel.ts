import * as fs from "fs";
import * as settings from "../settings"
import { ICoordinates, ISettlement, ISettlementData } from "../lib/interfaces";
import { getDataOfSettlements, prepareSettlement, updateDataOfSettlements } from "../lib/functions";

export class SettlementModel {
  static findNearestSettlement(coordinates: ICoordinates): false | string {
    let listOfSettlements = getDataOfSettlements()

    let vectorLength: number

    let settlementsIDbyCircle: number[] = []
    let settlementsIDbyVector: number

    listOfSettlements.settlements.forEach(settlement => {
      let myVector = {
        x: coordinates.latitude - settlement.coordinates.latitude,
        y: coordinates.longitude - settlement.coordinates.longitude,
      }

      let myVectorlength = Math.pow((Math.pow(myVector.x, 2) + Math.pow(myVector.y, 2)), 0.5)

      if (vectorLength === undefined || myVectorlength < vectorLength) {
        vectorLength = myVectorlength
        settlementsIDbyVector = settlement.id
      }

      if (settlement.settlementRadius !== undefined) {
        let a = settlement.coordinates.latitude
        let b = settlement.coordinates.longitude

        let x = coordinates.latitude
        let y = coordinates.longitude

        let r = settlement.settlementRadius

        if (Math.pow((x - a), 2) + Math.pow((y - b), 2) <= Math.pow(r, 2)) {
          settlementsIDbyCircle.push(settlement.id)
        }
      }
    })

    let result: false | string
    if (settlementsIDbyCircle.length !== 0) {
      let prevResult: ISettlement
      settlementsIDbyCircle.forEach(settlementsID => {
        if (result !== undefined) {
          let temp = prepareSettlement(listOfSettlements, settlementsID)

          if (temp.settlementRadius < prevResult.settlementRadius) {
            prevResult = temp
            result = JSON.stringify(temp)
          }
        } else {
          result = JSON.stringify(prepareSettlement(listOfSettlements, settlementsID))
        }
      })
    } else {
      result = JSON.stringify(prepareSettlement(listOfSettlements, settlementsIDbyVector))
    }

    return result
  }

  static setSettlementsRadius(settlementsID: number, coordinates: ICoordinates) {
    let listOfSettlements = getDataOfSettlements()

    let settlementArrayID = listOfSettlements.settlements.findIndex(settlement => settlement.id === settlementsID)

    if (settlementArrayID !== -1) {
      let myVector = {
        x: coordinates.latitude - listOfSettlements.settlements[settlementArrayID].coordinates.latitude,
        y: coordinates.longitude - listOfSettlements.settlements[settlementArrayID].coordinates.longitude,
      }

      let myVectorlength = Math.pow((Math.pow(myVector.x, 2) + Math.pow(myVector.y, 2)), 0.5)

      listOfSettlements.settlements[settlementArrayID].settlementRadius = myVectorlength + 0.001
    }

    updateDataOfSettlements(JSON.stringify(listOfSettlements))
  }

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

    return JSON.stringify(result)
  }

  private static rewriteListOfSettlements(data: string) {
    fs.writeFileSync(__dirname + "/../data/settlements.json", data)
  }
}
