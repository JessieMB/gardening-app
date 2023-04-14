import {seeds} from "../seeds";
import {getDateInfo, getMaxPlantsForSquareFootage, getUuid} from "./seeds-util";

describe('util tests', () => {
    it('add uuid to json', () => {
        const idSeeds = seeds.map(seed => {
            const uuid = getUuid()
            seed.id = uuid
            return seed
        })
        const x = ''
    })

    it('getMaxPlantsForSquareFootage', () => {
        const ids = ["c697ac61-a5c0-434f-96c4-7b8cf637ad1d", "8cf89746-733a-4f23-855f-c678283b540b"]
        const map = getMaxPlantsForSquareFootage(ids, 1000, () => {}, () => {})
        const x = ''
    })

    it('date wizard', () => {
        const dateInfo = getDateInfo()
    })

    it('get total sq footage', () => { })

})