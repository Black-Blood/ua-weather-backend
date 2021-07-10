import * as fs from "fs"

let text = fs.readFileSync(__dirname + "/ua-list.csv", "utf-8")
let textArr = text.split("\n")


let data: {
  settlements: ISettlement[]
  areas: IArea[]
  regions: IRegion[]
  rates: []
} = {
  "settlements": [],
  "areas": [],
  "regions": [],
  "rates": []
}

textArr.forEach(settlement => {
  let temp = settlement.split(";")

  temp.forEach((el, index, array) => {
    el = el.toLowerCase().replace("м.", "").replace("м ", "")
    array[index] = el
  })

  let nameUA = prepareSettlementName(temp[2])
  let areaUA = prepareSettlementName(temp[1])
  let regionUA = prepareSettlementName(temp[0]) + " область"

  let coordinates = {
    longitude: Number(temp[3]),
    latitude: Number(temp[4]),
  }

  let regionID = data.regions.findIndex(searchRegion => searchRegion.names["ua"] === regionUA)

  if (regionID === -1) {
    regionID = data.regions.length
    data.regions.push({
      id: regionID,
      names: {
        "ua": regionUA,
        "en": translateSettlementName(regionUA)
      }
    })
  }

  let areaID = data.areas.findIndex(searchArea => searchArea.names["ua"] === areaUA + " район")

  if (areaID === -1) {
    areaID = data.areas.length
    data.areas.push({
      id: areaID,

      names: {
        "ua": areaUA + " район",
        "en": translateSettlementName(areaUA) + " district"
      }
    })
  }

  if (nameUA != "") {
    data.settlements.push({
      id: data.settlements.length,
      regionID: (nameUA != regionUA) ? regionID : undefined,
      areaID: (nameUA != areaUA) ? areaID : undefined,

      names: {
        "ua": nameUA,
        "en": translateSettlementName(nameUA)
      },

      coordinates: coordinates
    })
  }
})

fs.writeFileSync(__dirname + "/settlements.json", JSON.stringify(data))

console.log(data.regions.length);
console.log(data.areas.length);
console.log(data.settlements.length);



interface ISettlement {
  id: number
  regionID?: number
  areaID?: number

  names: {}

  coordinates: {
    longitude: number
    latitude: number
  }
}

interface IArea {
  id: number

  names: {}
}

interface IRegion {
  id: number

  names: {}
}

function translateSettlementName(text: string) {
  if (text == "") return ""

  const alphabet = {
    "а": "a",
    "б": "b",
    "в": "v",
    "г": "h",
    "ґ": "g",
    "д": "d",
    "е": "e",
    "є": "ie",
    "ж": "zh",
    "з": "z",
    "и": "y",
    "і": "i",
    "ї": "i",
    "й": "i",
    "к": "k",
    "л": "l",
    "м": "m",
    "н": "n",
    "о": "o",
    "п": "p",
    "р": "r",
    "с": "s",
    "т": "t",
    "у": "u",
    "ф": "f",
    "х": "kh",
    "ц": "ts",
    "ч": "ch",
    "ш": "sh",
    "щ": "shch",
    "ю": "iu",
    "я": "ia",
    "-": "-",
    " ": " "
  }

  const alphabetEx = {
    "зг": "zgh"
  }

  const firstlater = {
    "є": "y",
    "ї": "yi",
    "й": "y",
    "ю": "yu",
    "я": "ya",
  }

  text = text.toLowerCase()

  let result = ""

  for (let i = 0; i < text.length; i++) {
    if (alphabetEx[text[i] + text[i + 1]] !== undefined) {
      result += alphabetEx[text[i] + text[i + 1]]
      continue
    }

    if (i == 0 && firstlater[text[i]] !== undefined) {
      result += firstlater[text[i]]
      continue
    }

    if (alphabet[text[i]] !== undefined) {
      result += alphabet[text[i]]
      continue
    }
  }

  console.log(result);

  return prepareSettlementName(result)
}

function prepareSettlementName(text: string) {
  if (text == "") return ""

  let resultArr = text.split(" ")

  let result = ""

  resultArr.forEach((word, index) => {
    if (index !== 0) {
      result += " "
    }

    result += word[0].toUpperCase()

    let part = word.slice(1)

    result += part
  })

  resultArr = result.split("-")

  result = ""

  resultArr.forEach((word, index) => {
    if (index !== 0) {
      result += "-"
    }

    result += word[0].toUpperCase()

    let part = word.slice(1)

    result += part
  })

  return result
}
