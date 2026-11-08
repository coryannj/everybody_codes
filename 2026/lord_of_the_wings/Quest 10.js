const { off } = require('cluster')
const fs = require('fs')
const [eventName, year, quest] = ['lord_of_the_wings', 2026, 10]
const filePath = `../../inputs/everybody_codes/${year}/${eventName}/quest${quest}`
const [input1, input2, input3] = [1, 2, 3].map((partNo) => fs.readFileSync(`${filePath}_${partNo}.txt`, { encoding: 'utf8', flag: 'a+' }))

const solve = (input, partNo) => {
    let lines = input.split(/[\r\n]+/).map((x) => x.split(''))
    let grid = {}, ghosts = []
    const neighbours = (r, c) => Object.fromEntries([[r + 1, c, 'D'], [r - 1, c, 'U'], [r, c + 1, 'R'], [r, c - 1, 'L']].flatMap(([nr, nc, d]) => lines?.[nr]?.[nc] && lines[nr][nc] !== '#' ? [[d, `${nr}_${nc}_${d}`]] : []))

    const dirs = ['D', 'U', 'L', 'R']
    const turn90 = { L: 'U', U: 'R', R: 'D', D: 'L' }
    const turn180 = { L: 'R', R: 'L', U: 'D', D: 'U' }

    lines.forEach((row, rowInd) => {
        row.forEach((val, colInd) => {
            if (val !== '#') {
                let key = `${rowInd}_${colInd}`
                let n = neighbours(rowInd, colInd)
                dirs.forEach((dir) => grid[`${key}_${dir}`] = { baseKey: key, turn90: `${key}_${turn90[dir]}`, turn180: `${key}_${turn180[dir]}`, neighbours: n })


                if (val !== '.') {
                    let d = { '<': 'L', '>': 'R', '^': 'U', 'v': 'D' }
                    ghosts.push(`${key}_${d[val]}`)
                }
            }
        })
    })

    ghosts = ghosts.map((x, i) => [i, x])
    let collisions = Array(ghosts.length).fill(0).map((x) => x)

    function* moveGhosts(rounds = 0, limit = Infinity) {
        const move = ([id, key]) => {
            let samedir = grid[key]['neighbours'][key.at(-1)]
            if (samedir) return [id, samedir]

            collisions[id]++
            return [id, grid[key]['turn90']]
        }

        while (true) {
            rounds++
            let counts = {}
            ghosts = ghosts.map((g) => {
                let next = move(g)
                let nKey = grid[next[1]]['baseKey']
                counts[nKey] = (counts[nKey] || 0) + 1
                return next
            }).flatMap(([id, k], i, a) => {
                let thisCollisions = collisions[id]

                if (thisCollisions >= limit) {
                    //console.log('id ', id, ' removed at round', rounds, 'before collision')
                    return []
                }

                if (counts[grid[k]['baseKey']] > 1) {
                    collisions[id]++
                    if (thisCollisions + 1 === limit) {
                        //console.log('id ', id, ' removed at round', rounds, 'after nullghost collision')
                        return []
                    } else {
                        return [[id, grid[k]['turn180']]]
                    }
                }
                return [[id, k]]
            })

            yield [rounds, ghosts, collisions]
        }
    }

    if (partNo === 1) return moveGhosts().find(([r, g, c]) => r === 10)[2].reduce((a, c) => a + c, 0)
    //if (partNo === 2) return moveGhosts(0, 10000).find(([r, g, c]) => !g.length)[0]

    let cycleRound = 0
    let limit = partNo === 2 ? 10000 : 1000000000000
    let states

    function* skipMoves(limit) {
        while (ghosts.length) {
            states = {}
            for (const [lastRound, lastGhosts, lastCollisions] of moveGhosts(cycleRound, limit)) {
                let key = JSON.stringify(lastGhosts)
                if (states[key]) {
                    yield [lastRound, lastGhosts, lastCollisions, key]
                    break;
                }
                states[key] = [lastRound, [...lastCollisions]]
            }
        }

        yield [cycleRound, ghosts, collisions]
    }

    return skipMoves(limit).map(([lastRound, lastGhosts, lastCollisions, key]) => {
        let [firstRound, firstCollisions] = states[key], cycleLen = lastRound - firstRound, minFullCycles = Infinity

        let cycles = lastGhosts.map(([i, k]) => {
            let offset = firstCollisions[i], target = limit - offset, cycle = lastCollisions[i] - offset, fullCycles = Math.floor(target / cycle)

            if (fullCycles < minFullCycles) minFullCycles = fullCycles

            return [i, offset, cycle, fullCycles]
        })

        cycleRound = firstRound + (minFullCycles * cycleLen)

        cycles.forEach(([id, offset, cycleCollisions, fullCycles, remainder]) => collisions[id] += (cycleCollisions * (minFullCycles - 1)))

        if (lastGhosts.length === 1) {
            let [id, offset, cycleCollisions, fullCycles] = cycles[0]
            let [remRounds, remCollisions] = Object.values(states).find(([r, c]) => c[id] === offset + cycleCollisions)
            cycleRound -= cycleLen
            cycleRound += (remRounds - firstRound)
            lastGhosts.shift()
        }

        return [cycleRound, ghosts, collisions]
    }).find(([r, g, c]) => g.length === 0)[0]
}

console.log(solve(input1, 1))
console.log(solve(input2, 2))
console.log(solve(input3, 3))