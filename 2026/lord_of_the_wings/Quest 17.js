const { off } = require('cluster')
const fs = require('fs')
const [eventName, year, quest] = ['lord_of_the_wings', 2026, 17]
const filePath = `../../inputs/everybody_codes/${year}/${eventName}/quest${quest}`
const [input1, input2, input3] = [1, 2, 3].map((partNo) => fs.readFileSync(`${filePath}_${partNo}.txt`, { encoding: 'utf8', flag: 'a+' }))

class Point {
    constructor(k, r, c, v, n, gaps) {
        this.key = k
        this.row = r
        this.col = c
        this.val = v
        this.neighbours = n ? new Set(n) : null
        this.gaps = gaps
    }
}

const solve = (input, partNo) => {
    let lines = input.split(/[\r\n]+/).map((x) => x.split(''))
    let points = []

    const getSolid = (r, c) => [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].flatMap(([nr, nc, nd]) => lines?.[nr]?.[nc] === '#' ? [`${nr}_${nc}`] : [])

    const getGaps = (r, c) => new Set([[r - 1, c - 1], [r - 1, c], [r - 1, c + 1], [r + 1, c - 1], [r + 1, c], [r + 1, c + 1], [r, c - 1], [r, c + 1]].flatMap(([nr, nc]) => lines?.[nr]?.[nc] === '.' ? [`${nr}_${nc}`] : []))

    lines.forEach((row, rowInd) => {
        row.forEach((val, colInd) => {
            if (val === '#') {
                points.push(new Point(`${rowInd}_${colInd}`, rowInd, colInd, val, getSolid(rowInd, colInd), null))
            } else if (partNo === 3) {
                points.push(new Point(`${rowInd}_${colInd}`, rowInd, colInd, val, getSolid(rowInd, colInd), getGaps(rowInd, colInd)))
            }
        })
    })

    let rowLen = lines.length, colLen = lines[0].length, endKey = `${lines.length - 1}_${lines[0].length - 1}`, pointsByKey = Object.fromEntries(points.map((p) => [p.key, p]))

    const bfs = (queue, partNo) => {
        const callBack = () => partNo === 1 ? !queue.has(endKey) : queue.size
        const neighbourKey = partNo === 1 ? 'neighbours' : 'gaps'
        let seen = new Set()
        let steps = 0

        while (callBack()) {
            steps++
            seen = seen.union(queue)
            queue = new Set(queue.values().flatMap((key) => pointsByKey?.[key]?.[neighbourKey]?.difference(seen) || []))
        }

        return partNo === 1 ? steps : seen.values().reduce((a, c) => a + pointsByKey[c]['neighbours'].size, 0)
    }

    if (partNo === 1) return bfs(new Set(['0_0']), partNo)

    let allEdges = points.flatMap((p) => p.val === '#' ? [4 - (p?.['neighbours']?.size || 0)] : []).reduce((a, c) => a + c, 0)

    if (partNo === 2) return allEdges

    let leftBottomSolid = points.filter((p) => p.val === '#' && (p.col === 0 || p.row === rowLen - 1))
    let isBottomCorner = pointsByKey[`${rowLen - 1}_${0}`].val === '#'
    let solidEdges = leftBottomSolid.length + isBottomCorner

    let leftBottomGaps = points.filter((p) => p.val === '.' && (p.col === 0 || p.row === rowLen - 1))
    let gapEdges = bfs(new Set(leftBottomGaps.map((p) => p.key)), partNo)
    let totalSideEdges = solidEdges + gapEdges

    return Math.min(totalSideEdges, allEdges - totalSideEdges)
}

console.log(solve(input1, 1))
console.log(solve(input2, 2))
console.log(solve(input3, 3))