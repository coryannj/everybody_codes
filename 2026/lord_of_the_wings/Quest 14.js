const { off } = require('cluster')
const fs = require('fs')
const [eventName, year, quest] = ['lord_of_the_wings', 2026, 14]
const filePath = `../../inputs/everybody_codes/${year}/${eventName}/quest${quest}`
const [input1, input2, input3] = [1, 2, 3].map((partNo) => fs.readFileSync(`${filePath}_${partNo}.txt`, { encoding: 'utf8', flag: 'a+' }))

const solve = (input, partNo) => {
    let lines = input.split(/[\r\n]+/).map((x) => x.split(''))
    let keys = [...new Set(lines.flat())].sort().concat('edge')
    let keysLen = keys.length
    let dict = Object.fromEntries(keys.map((x, i) => [x, i]))
    let baseArr = Array(keys.length).fill(0).map(x => x)
    let counts = Array(keys.length).fill().map((x) => baseArr.slice(0))

    const getNeighbours = (r, c) => [[r + 1, c], [r - 1, c], [r, c - 1], [r, c + 1]].flatMap(([nr, nc]) => {
        let currVal = dict[lines[r][c]]
        let newVal = dict[lines?.[nr]?.[nc] || 'edge']
        return currVal !== newVal ? [newVal] : []
    })

    lines.forEach((row, rowInd) => {
        row.forEach((val, colInd) => {
            getNeighbours(rowInd, colInd).forEach((n) => counts[dict[val]][n]++)
        })
    })


    if (partNo === 1) return counts.slice(0, -1).flatMap((x, i) => x.slice(i + 1)).reduce((a, c) => a + c, 0)

    const findRoot = (id, arr) => {
        while (arr[id] !== id) {
            id = arr[id]
        }
        return id
    }

    const minForest = (len, edges, unionArr = baseArr.map((x, i) => i), unionSize = baseArr.slice(0), seen = new Set()) => {

        for (const [id1, id2, count] of edges) {
            let id1Root = findRoot(id1, unionArr)
            let id2Root = findRoot(id2, unionArr)
            let id1Size = unionSize[id1Root]
            let id2Size = unionSize[id2Root]

            if (id1Root === id2Root) continue;

            if (!seen.has(id1) && !seen.has(id2)) { // Both nodes not seen
                unionArr[id1] = id2
                unionSize[id2] = count
            } else {
                if (id2Size <= id1Size) {
                    unionArr[id1Root] = id2Root
                    unionSize[id2Root] += (id1Size + count)
                    unionSize[id1Root] = 0
                } else {
                    unionArr[id2Root] = id1Root
                    unionSize[id1Root] += (id2Size + count)
                    unionSize[id2Root] = 0
                }
            }
            seen.add(id1)
            seen.add(id2)
            if (seen.size === len) break;
        }

        return unionSize.reduce((a, c) => a + c, 0)
    }

    let edges = counts.flatMap((x, i) => x.flatMap((y, yi) => yi > i && y ? [[i, yi, y]] : [])).sort((a, b) => a[2] - b[2])

    if (partNo === 2) return minForest(keysLen, edges)

    let p3Min = Infinity, edgeInd = keysLen - 1

    for (id1 = 0; id1 < edgeInd; id1++) {
        for (id2 = id1 + 1; id2 < edgeInd; id2++) {
            let newEdges = edges.map(([e1, e2, l]) => e1 === id1 || e2 === id1 || e1 === id2 || e2 === id2 ? [e1, e2, 0] : [e1, e2, l]).sort((a, b) => a[2] - b[2])

            let bindings = minForest(keysLen, newEdges)
            if (bindings < p3Min) p3Min = bindings
        }
    }

    return p3Min
}

console.log(solve(input1, 1))
console.log(solve(input2, 2))
console.log(solve(input3, 3))