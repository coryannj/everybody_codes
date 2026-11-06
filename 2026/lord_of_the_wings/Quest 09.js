const fs = require('fs')
const [eventName, year, quest] = ['lord_of_the_wings', 2026, 9]
const filePath = `../../inputs/everybody_codes/${year}/${eventName}/quest${quest}`
const [input1, input2, input3] = [1, 2, 3].map((partNo) => fs.readFileSync(`${filePath}_${partNo}.txt`, { encoding: 'utf8', flag: 'a+' }))

const solvep1 = () => {
    return input1.split(/[\r\n]+/).map((x) => x.match(/\d+/g).slice(1).map(Number)).reduce((total, [growth, limit]) => {
        let elements = 0, time = 0, plant = [0], splits = 0, split = [Math.floor(growth / 2), Math.floor(growth / 2), 1]

        while (elements + splits < limit) {
            time++
            elements += plant.length
            plant = plant.flatMap((e) => {
                if (e + 1 < growth) {
                    return [e + 1]
                } else {
                    splits++
                    return split
                }
            })
        }
        return total + time
    }, 0)
}

const grow = ([growth, limit]) => {
    if (limit <= growth) return { time: limit }

    let
        half = (growth - 1n) / 2n,
        plant = half === 1n ? [[half, BigInt(3)]] : [[half, BigInt(2)], [BigInt(1), BigInt(1)]],
        time = BigInt(growth),
        splits = BigInt(1),
        elements = BigInt(3),
        split = structuredClone(plant)

    function* growStep() {
        while (true) {
            let [maxLen, maxCount] = plant.shift()
            elements += (maxCount * 2n)
            splits += maxCount
            let nextSplitTime = growth - maxLen
            time += nextSplitTime
            let halfInd

            plant = plant.map(([len, count], ind) => {
                if (len + nextSplitTime === half) {
                    halfInd = ind
                }
                return [len + nextSplitTime, count]
            })

            split.forEach(([len, count]) => {
                let newCount = count * maxCount
                if (len === half) {
                    if (halfInd) {
                        plant[halfInd][1] += newCount
                    } else {
                        let insertInd = plant.findIndex(([fl, fc]) => fl < len)
                        if (insertInd === -1) {
                            plant.push([len, newCount])
                        } else {
                            plant.splice(insertInd, 0, [len, newCount])
                        }
                    }
                } else {
                    plant.push([len, newCount])
                }
            })

            yield { time, splits, limit, elements }
        }

    }

    return growStep().find(({ time, splits, limit, elements }) => elements - splits >= limit)
}

const solvep2p3 = (input) => {
    return input.split(/[\r\n]+/).map((x) => x.match(/\d+/g).slice(1).map((n) => BigInt(n))).reduce((a, c) => a + grow(c).time, 0n)
}

console.log(solvep1())
console.log(solvep2p3(input2))
console.log(solvep2p3(input3))