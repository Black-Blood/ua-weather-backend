import * as settings from "../settings"
import { ISettlement } from "../lib/interfaces"
import { getDataOfSettlements, prepareSettlement, updateDataOfSettlements } from "../lib/functions"

export class PopularRequestsModel {
  static getPopularRequests(): string {
    let data = getDataOfSettlements()

    let popularRequsts = data.rates
    let settlements = data.settlements
    let result: ISettlement[] = []

    let count = (popularRequsts.length > settings.server.maxPopularRequests) ? settings.server.maxPopularRequests : popularRequsts.length
    for (let i = 0; i < count; i++) {
      settlements.forEach(settlement => {
        if (settlement.id === popularRequsts[i].settlementID) {
          result.push(prepareSettlement(data, settlement.id))
        }
      })
    }

    return JSON.stringify(result)
  }

  static updateRate(settlementID: number) {
    let listOfSettlements = getDataOfSettlements()

    let index = listOfSettlements.rates.findIndex(rate => settlementID === rate.settlementID)

    if (index !== -1) {
      listOfSettlements.rates[index].rate += 1
    } else if (settlementID !== undefined) {
      listOfSettlements.rates.push({
        settlementID: settlementID,
        rate: 0
      })
    }

    updateDataOfSettlements(JSON.stringify(listOfSettlements))
  }
}
