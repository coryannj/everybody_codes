const fs = require('fs')
const year = '2026'
const eventName = 'lord_of_the_wings'
const quest = 7
const filePath = `../../inputs/everybody_codes/${year}/${eventName}/quest${quest}_`

const [input1, input2, input3] = [1, 2, 3].map((partNo) => fs.readFileSync(`${filePath}${partNo}.txt`, { encoding: 'utf8', flag: 'a+' }))

const solve = (input, partNo) => {
    lines = input.split(/[\r\n]+/).map((x) => x.split(/,\s/g).map((y) => y.split('=')))
    let clouds = {}, maxC = -Infinity, maxId

    lines.forEach(([[a, id], [b, energy], [c, connections]]) => {
        clouds[id] = { energy: +energy, connections: connections.split(',').map(Number) }
        if (connections.length > maxC) {
            maxId = id
            maxC = connections.length
        }
    })

    const propagate = (id, firstImpulse, clouds, explosion) => {
        let queue = new Map([[firstImpulse, new Map([[id, 1]])]])
        while (queue.size) {
            queue = queue.entries().reduce((newQueue, [impulse, subQueue]) => {
                subQueue.entries().forEach(([id, count]) => {
                    if (clouds[id]) {
                        clouds[id]['energy'] += (count * impulse)
                        if (impulse > 1) {
                            if (!newQueue.has(impulse - 1)) {
                                newQueue.set(impulse - 1, new Map())
                            }
                            clouds[id]['connections'].filter((c) => clouds[c]).forEach((c) => {
                                newQueue.get(impulse - 1).set(c, (newQueue.get(impulse - 1)?.get(c) || 0) + count)
                            })
                        }
                    }
                })
                return newQueue
            }, new Map())

            if (explosion) {
                Object.keys(clouds).filter((k) => clouds[k]['energy'] >= explosion).forEach((k) => {
                    clouds[k]['connections'].filter((c) => clouds[c]).forEach((c) => {
                        if (!queue.has(firstImpulse)) {
                            queue.set(firstImpulse, new Map())
                        }
                        queue.get(firstImpulse).set(c, (queue.get(firstImpulse)?.get(c) || 0) + 1)
                    })

                    delete clouds[k]
                })
            }
        }
        return Object.values(clouds).reduce((a, c) => a + c.energy, 0)
    }
    let start = partNo === 1 ? 5 : 10

    return partNo < 3 ? propagate(maxId, start, clouds) : Math.max(...Object.keys(clouds).map((k) => propagate(k, start, structuredClone(clouds), 1000000)))
}

console.log(solve(input1, 1))
console.log(solve(input2, 2))
console.log(solve(input3, 3))