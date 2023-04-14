import {v4 as uuidv4} from 'uuid';
import {seeds} from "../seeds";
import {DateTime, Interval} from "luxon";

const fs = require('fs')
const _ = require('underscore')
export const sortItems = (list, sortProp1, sortProp2) => {
    const x = list.sort((a, b) => a[sortProp2].localeCompare(b[sortProp2]))
    const y = x.sort((a, b) => a[sortProp1].localeCompare(b[sortProp1]))
    return y
}

export const writeJsonFile = (json) => {
    fs.writeFileSync('file.json', JSON.stringify(json));
}

export const getUuid = () => {
    return uuidv4()
}

export const getMaxPlantsForSquareFootage = (plantIDList, squareFootage, info, setInfo) => {
    const arr = []
    squareFootage = parseInt(squareFootage)
    const seedMap = getSeedMap()
    plantIDList.forEach(id => {
        arr.push(seedMap[id])
    })
    const plotSize = squareFootage / arr.length
    const map = {}
    arr.forEach(plant => {
        const sqFootage = getSquareFootage(plant)
        const maxNumPlantsPerPlot = Math.floor(plotSize / sqFootage)
        map[`${plant.name} ${plant.subcategory}`] = {maxNumPlantsPerPlot, sqFootage}
    })
    console.log(map)
    setInfo(map)
    return map
}


export const getSquareFootage = (plant) => {
    const sqInches = plant.spacingInchesX * plant.spacingInchesY
    const sqFeet = sqInches / 144
    return sqFeet
}

export const getSeedMap = () => {
    const map = {}
    seeds.forEach(seed => {
        map[seed.id] = seed
    })
    return map
}

export const getDateInfo = () => {
    const now = DateTime.now()
    let germinateNow = []
    let tooLate = []
    const map = {}
    seeds.forEach(seed => {
        const earliestDate = formatDate(seed.earliestPlantDate)
        const latestDate = formatDate(seed.latestPlantDate)
        const germinationAvgTime = Math.floor(seed.minDaysToGerm + seed.maxDaysToGerm / 2)
        const earliestGerminationDate = earliestDate.minus({days: germinationAvgTime})
        const latestGerminationDate = latestDate.minus({days: germinationAvgTime})
        const interval = Interval.fromDateTimes(earliestGerminationDate, latestGerminationDate)
        seed["earliestGerminationDate"] = earliestGerminationDate.ts
        seed["earliestGerminationDateStr"] = earliestGerminationDate.toLocaleString()
        seed["latestGerminationDate"] = latestGerminationDate.ts
        seed["latestGerminationDateStr"] = latestGerminationDate.toLocaleString()
        const int = Interval.fromDateTimes(now, latestGerminationDate)
        seed["daysLeftToGerminate"] = Math.floor(int.length('days'))
        if (interval.contains(now)) {
            germinateNow.push(seed)
        }
        if (seed["daysLeftToGerminate"] <= 0) {
            tooLate.push(seed)
        }
        map[`${seed.name} ${seed.subcategory}`] = {
            germinationAvgTime, earliestGerminationDate, latestGerminationDate
        }
    })
    const sortedGerminateNow = sortByDaysRemainingToGerminate(germinateNow)
    const sortedTooLate = sortByEarliestGerminationDate(tooLate)
    return {map, germinateNow: sortedGerminateNow, tooLate: sortedTooLate}
}

export const sortByEarliestGerminationDate = (seedsList) => {
    return _.sortBy(seedsList, 'earliestGerminationDate')
}

export const sortByDaysRemainingToGerminate = (seedsList) => {
    return _.sortBy(seedsList, 'daysLeftToGerminate')
}

export const formatDate = (date) => {
    const replaced = date.replace('/', '-')
    const withYear = `2023-${replaced}`
    return DateTime.fromISO(withYear)
}

export const getTotalSqFootage = (plots) => {
   const total = plots.reduce((acc, plot) => {
       return acc += plot.sqFootage
    }, 0)
    return total
}