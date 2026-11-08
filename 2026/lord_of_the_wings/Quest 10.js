const { off } = require('cluster')
const fs = require('fs')
const [eventName, year, quest] = ['lord_of_the_wings', 2026, 10]
const filePath = `../../inputs/everybody_codes/${year}/${eventName}/quest${quest}`
const [input1, input2, input3] = [1, 2, 3].map((partNo) => fs.readFileSync(`${filePath}_${partNo}.txt`, { encoding: 'utf8', flag: 'a+' }))

const solve = (input, partNo) => {
    let lines = input.split(/[\r\n]+/).map((x) => x.split('')), grid = {}, ghosts = []

    const neighbours = (r, c) => Object.fromEntries([[r + 1, c, 'D'], [r - 1, c, 'U'], [r, c + 1, 'R'], [r, c - 1, 'L']].flatMap(([nr, nc, d]) => lines?.[nr]?.[nc] && lines[nr][nc] !== '#' ? [[d, `${nr}_${nc}_${d}`]] : []))

    const dirs = ['D', 'U', 'L', 'R']
    const turn90 = { L: 'U', U: 'R', R: 'D', D: 'L' }
    const turn180 = { L: 'R', R: 'L', U: 'D', D: 'U' }
    const arrows = { '<': 'L', '>': 'R', '^': 'U', 'v': 'D' }
    let gInd = 0

    lines.forEach((row, rowInd) => {
        row.forEach((val, colInd) => {
            if (val !== '#') {
                let key = `${rowInd}_${colInd}`, n = neighbours(rowInd, colInd)

                dirs.forEach((dir) => grid[`${key}_${dir}`] = { baseKey: key, turn90: `${key}_${turn90[dir]}`, turn180: `${key}_${turn180[dir]}`, neighbours: n })

                if (val !== '.') ghosts.push([gInd++, `${key}_${arrows[val]}`])
            }
        })
    })

    let collisions = Array(ghosts.length).fill(0).map((x) => x)
    let rounds = 0
    let limit = partNo === 1 ? Infinity : partNo === 2 ? 10000 : 1000000000000
    let states = {}
    let storeState = true

    function* moveGhosts() {
        while (true) {
            rounds++
            let counts = {}

            const move = ([id, key]) => {
                let nextKey = grid[key]['neighbours'][key.at(-1)]

                if (!nextKey) {
                    if (collisions[id] + 1 === limit) {
                        states = {}
                        storeState = true
                        return []
                    }
                    collisions[id]++
                    nextKey = grid[key]['turn90']
                }
                let nKey = grid[nextKey]['baseKey']
                counts[nKey] = (counts[nKey] || 0) + 1

                return [[id, nextKey]]
            }

            const collide = ([id, key]) => {
                if (counts[grid[key]['baseKey']] === 1) return [[id, key]]
                if (collisions[id] + 1 === limit) {
                    states = {}
                    storeState = true
                    return []
                }
                collisions[id]++
                return [[id, grid[key]['turn180']]]
            }

            ghosts = ghosts.flatMap(move).flatMap(collide)

            yield [rounds, ghosts, collisions]
        }
    }

    if (partNo === 1) return moveGhosts().find(([r, g, c]) => r === 10)[2].reduce((a, c) => a + c, 0)
    //if (partNo === 2) return moveGhosts(rounds, limit).find(([r, g, c]) => !g.length)[0]

    return moveGhosts(rounds, limit).map((x) => {
        if (!storeState) return x

        let key = JSON.stringify(x[1])

        if (!states[key]) {
            states[key] = [x[0], [...x[2]]]
            return x
        }

        let
            [firstRound, firstCollisions] = states[key],
            [lastRound, lastGhosts, lastCollisions] = x,
            cycleLen = lastRound - firstRound,
            minFullCycles = Infinity

        let cycles = lastGhosts.map(([i, k]) => {
            let offset = firstCollisions[i], target = limit - offset, cycle = lastCollisions[i] - offset, fullCycles = Math.floor(target / cycle)

            if (fullCycles < minFullCycles) minFullCycles = fullCycles

            return [i, cycle]
        })

        rounds = firstRound + (minFullCycles * cycleLen)

        minFullCycles--

        if (lastGhosts.length === 1) {
            rounds -= cycleLen
            minFullCycles--
        }

        cycles.forEach(([id, cycleCollisions]) => collisions[id] += (cycleCollisions * minFullCycles))

        states = {}
        storeState = false

        return [rounds, ghosts, collisions]
    }).find(([r, g, c]) => g.length === 0)[0]
}

console.log(solve(input1, 1))
console.log(solve(input2, 2))
console.log(solve(input3, 3))