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
        time = BigInt(growth),
        splits = BigInt(1),
        elements = BigInt(3)

    function grow3() {
        while (elements - splits < limit) {
            splits += elements
            elements *= 3n
            time += 2n
        }
        return { time: time }
    }

    if (growth === 3n) return grow3()

    let
        half = (growth - 1n) / 2n,
        plant = [[half, 2n], [1n, 1n]]

    function* growStep() {
        while (true) {
            let [maxLen, maxCount] = plant.shift()
            elements += (maxCount * 2n)
            splits += maxCount
            let nextSplitTime = growth - maxLen
            time += nextSplitTime
            let noHalfInd = true

            plant = plant.map(([len, count]) => {
                if (len + nextSplitTime === half) {
                    noHalfInd = false
                    count += (maxCount * 2n)
                }
                return [len + nextSplitTime, count]
            })

            if (noHalfInd) {
                let insertInd = plant.findIndex(([fl, fc]) => fl < half)
                if (insertInd === -1) {
                    plant.push([half, 2n * maxCount])
                } else {
                    plant.splice(insertInd, 0, [half, 2n * maxCount])
                }
            }

            plant.push([1n, maxCount])

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