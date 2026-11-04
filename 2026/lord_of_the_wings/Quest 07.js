const fs = require('fs')
const [eventName, year, quest] = ['lord_of_the_wings', 2026, 7]
const filePath = `../../inputs/everybody_codes/${year}/${eventName}/quest${quest}`
const [input1, input2, input3] = [1, 2, 3].map((partNo) => fs.readFileSync(`${filePath}_${partNo}.txt`, { encoding: 'utf8', flag: 'a+' }))

const parseInput = (input, partNo) => {
    let lines = input.split(/[\r\n]+/).map((x) => x.match(/\d+/g).map(Number))
    let clouds = Object.fromEntries(lines.map(([id, e, ...c]) => [id, { energy: e, connections: c }]))

    return [clouds, lines.at(-1)[0], partNo < 3 ? Object.entries(clouds).reduce(([mid, mLen], [id, v]) => v.connections.length > mLen ? [id, v.connections.length] : [mid, mLen], [0, -Infinity])[0] : null]
}

const solvep1p2 = (input, partNo) => {
    let
        [clouds, highestId, maxId] = parseInput(input, partNo),
        start = partNo === 1 ? 5 : 10,
        baseQueue = Array(highestId + 1).fill(0).map((x) => x),
        queue = baseQueue.with(maxId, 1)

    for (impulse = start; impulse > 0; impulse--) {
        queue = queue.reduce((newQueue, count, id) => {
            if (count) {
                clouds[id]['energy'] += (count * impulse)
                if (impulse > 1) clouds[id]['connections'].forEach((c) => newQueue[c] += count)
            }
            return newQueue
        }, baseQueue.slice(0))
    }

    return Object.values(clouds).reduce((a, c) => a + c.energy, 0)
}

const solvep3 = (input, partNo) => {
    let
        [clouds, highestId, maxId] = parseInput(input, partNo),
        start = 10,
        baseQueue = Array(11).fill().map((x) => null),
        baseSubQueue = Array(highestId + 1).fill(0).map((x) => x)

    const propagate = (firstId, firstImpulse, clouds, explosion) => {
        let queue = baseQueue.slice()
        queue[firstImpulse] = baseSubQueue.with(firstId, 1)

        while (queue.some((x) => x)) {
            let newQueue = baseQueue.slice(0)

            queue.forEach((subQueue, impulse) => {
                if (subQueue) {
                    subQueue.forEach((count, id) => {
                        if (count && clouds[id]) {
                            clouds[id]['energy'] += (count * impulse)
                            if (impulse > 1) {
                                if (!newQueue[impulse - 1]) newQueue[impulse - 1] = baseSubQueue.slice(0)
                                clouds[id]['connections'].forEach((c) => {
                                    if (clouds[c]) newQueue[impulse - 1][c] += count
                                })
                            }
                        }
                    })
                }
            })

            queue = newQueue

            Object.keys(clouds).filter((k) => clouds[k]['energy'] >= explosion).forEach((k) => {
                if (!queue[firstImpulse]) queue[firstImpulse] = baseSubQueue.slice(0)

                clouds[k]['connections'].forEach((c) => {
                    if (clouds[c]) queue[firstImpulse][c]++
                })

                delete clouds[k]
            })
        }

        return Object.values(clouds).reduce((a, c) => a + c.energy, 0)
    }

    return Math.max(...Object.keys(clouds).map((id) => propagate(+id, start, structuredClone(clouds), 1000000)))
}

console.log(solvep1p2(input1, 1))
console.log(solvep1p2(input2, 2))
console.log(solvep3(input3, 3))