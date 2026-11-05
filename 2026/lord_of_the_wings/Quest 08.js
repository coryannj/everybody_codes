const fs = require('fs')
const [eventName, year, quest] = ['lord_of_the_wings', 2026, 8]
const filePath = `../../inputs/everybody_codes/${year}/${eventName}/quest${quest}`
const [input1, input2, input3] = [1, 2, 3].map((partNo) => fs.readFileSync(`${filePath}_${partNo}.txt`, { encoding: 'utf8', flag: 'a+' }))

const solve = (input, partNo) => {
    let lines = input.split(/[\r\n]+/).map((x) => x.split('')), grid = {}, rowLen = lines.length

    const neighbours = (r, c) => Object.fromEntries([['UL', r - 1, c - 1], ['UR', r - 1, c + 1], ['DL', r + 1, c - 1], ['DR', r + 1, c + 1]].flatMap(([d, nr, nc]) => lines?.[nr]?.[nc] && lines[nr][nc] !== '.' ? [[d, `${nr}_${nc}`]] : []))

    lines.forEach((row, rowInd) => {
        row.forEach((val, colInd) => {
            if (val !== '.') {
                let key = `${rowInd}_${colInd}`
                grid[key] = { value: +val, neighbours: neighbours(rowInd, colInd) }
            }
        })
    })

    const getDiagonal = (key, d) => {
        let result = [key]

        for (const v of result) {
            if (!v) break;
            result.push(grid[v]['neighbours'][d])
        }
        result.pop()
        return result
    }

    const dirs = partNo === 1 ? ['DR'] : ['DR', 'DL', 'L', 'UL', 'UR', 'R']

    const queues = dirs.map((d) => {
        if (d === 'L' || d === 'R') return Array(rowLen).fill().map((x, i) => Object.keys(grid).filter((k) => k.startsWith(`${i}_`))).map((x) => d === 'R' ? x : x.reverse())

        let opp = { 'DR': 'UL', 'DL': 'UR', 'UL': 'DR', 'UR': 'DL' }

        return Object.keys(grid).filter((k) => !grid[k]['neighbours'][opp[d]]).map((k) => getDiagonal(k, d))
    })

    let energy = 0
    let warriors = 0

    const hasEnergy = (queue, partNo) => {
        queue.forEach((q) => {
            let max = -Infinity

            q.forEach((k) => {
                max--
                let v = grid[k]['value']

                if (1 <= v && v <= 9) {
                    if (v > max) {
                        energy++
                        max = v
                        if (partNo === 3) {
                            grid[k]['value']++
                            if (v === 9) warriors++
                        }
                    }
                } else {
                    grid[k]['value'] = (v + 1) % 12
                }
            })
        })
    }

    if (partNo < 3) {
        queues.forEach((q) => hasEnergy(q, partNo))
    } else {
        outer: {
            while (true) {
                for (const q of queues) {
                    hasEnergy(q, partNo)
                    if (warriors >= 100000) break outer;
                }
            }
        }
    }

    return energy
}

console.log(solve(input1, 1))
console.log(solve(input2, 2))
console.log(solve(input3, 3))