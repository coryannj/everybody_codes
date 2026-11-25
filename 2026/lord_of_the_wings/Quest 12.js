const { off } = require('cluster')
const fs = require('fs')
const [eventName, year, quest] = ['lord_of_the_wings', 2026, 12]
const filePath = `../../inputs/everybody_codes/${year}/${eventName}/quest${quest}`
const [input1, input2, input3] = [1, 2, 3].map((partNo) => fs.readFileSync(`${filePath}_${partNo}.txt`, { encoding: 'utf8', flag: 'a+' }))

class Point {
    constructor(r, c, n) {
        this.key = `${r}_${c}`
        this.row = r
        this.col = c
        this.neighbours = n
    }
}

const solve = (input) => {
    let lines = input.split(/[\r\n]+/).map((x) => x.split(''))
    const nSides = (r, c) => new Set([[r - 1, c], [r + 1, c], [r, c + 1], [r, c - 1]].flatMap(([nr, nc]) => lines?.[nr]?.[nc] === '#' ? [`${nr}_${nc}`] : []))

    let points = lines.flatMap((row, rowInd) => row.flatMap((val, colInd) => (val === '.') ? [] : [new Point(rowInd, colInd, nSides(rowInd, colInd))]
    ))

    let pointsByKey = Object.fromEntries(points.map((p) => [p.key, p])), pLen = points.length, gSeen = new Set(), stacks = []

    const bfs = (key) => {
        let queue = new Set([key]), seen = new Set()

        while (queue.size) {
            seen = seen.union(queue)
            queue = new Set(queue.values().flatMap((k) => pointsByKey[k].neighbours.difference(seen)))
        }

        return seen
    }

    for (const p of points) {
        if (gSeen.has(p.key)) continue;
        let thisStack = bfs(p.key)
        stacks.push(thisStack)
        gSeen = gSeen.union(thisStack)
        if (gSeen.size === pLen) break;
    }

    const getSpells = (s) => {
        if (s.size <= 2) return 1 // point or len 2 line

        let sPoints = s.values().map((k) => pointsByKey[k]).toArray()
        let byRow = Map.groupBy(sPoints, ({ row }) => row)
        let byCol = Map.groupBy(sPoints, ({ col }) => col)
        let rows = byRow.keys().toArray().sort((a, b) => a - b)
        let cols = byCol.keys().toArray().sort((a, b) => a - b)

        if (rows.length === 1 || cols.length === 1) return 1 // line

        let [minRow, maxRow, minCol, maxCol] = [rows[0], rows.at(-1), cols[0], cols.at(-1)]

        let height = maxRow - minRow + 1
        let width = maxCol - minCol + 1
        let maxLen = height * width

        if (maxLen === s.size) return Math.min(height, width) // solid rectangle

        if ([minRow, maxRow].some((r) => byRow.get(r).length < width)) {
            // L shape
            let hArm = [byRow.get(minRow), byRow.get(maxRow)].find((r) => r.length < width)
            let vArm = [byCol.get(minCol), byCol.get(maxCol)].find((c) => c.length < height)

            return Math.min(hArm.length + vArm.length, width, height)
        } else {
            // Rectgaptangle

            if (Math.min(height, width) <= 3) return 4 // Gap is a width 1 line/point

            let [holeMinRow, holeMaxRow] = [rows.find((r) => byRow.get(r).length < width), rows.findLast((r) => byRow.get(r).length < width)]

            let [holeMinCol, holeMaxCol] = [cols.find((c) => byCol.get(c).length < height), cols.findLast((c) => byCol.get(c).length < height)]

            let holeWidth = holeMaxCol - holeMinCol + 1
            let holeHeight = holeMaxRow - holeMinRow + 1

            let border = {
                U: holeMinRow - minRow,
                D: maxRow - holeMaxRow,
                L: holeMinCol - minCol,
                R: maxCol - holeMaxCol,
            }

            let deleted = [], notDeleted = [], delSpells = 0

            Object.entries(border).forEach(([dir, thickness]) => {
                let holeSide = 'LR'.includes(dir) ? holeHeight : holeWidth
                if (thickness <= holeSide) {
                    deleted.push(dir)
                    delSpells += thickness
                    'LR'.includes(dir) ? width -= thickness : height -= thickness
                } else {
                    notDeleted.push([thickness, holeSide])
                }
            })

            if (!deleted.length) return Math.min(height + holeHeight, width + holeWidth) // Can't delete border
            if (deleted.length === 4) return delSpells // Deleted whole border
            if (deleted.length === 1) return 'LR'.includes(deleted[0]) ? Math.min(height, width + holeWidth) + delSpells : Math.min(height + holeHeight, width) + delSpells // Deleted one side
            if (deleted.length === 3) return Math.min(...notDeleted[0]) + delSpells // Deleted 3 sides

            if (['UD', 'LR'].includes(deleted.join(''))) return notDeleted.reduce((a, c) => a + Math.min(...c), delSpells) // Deleted 2 opposite sides

            return delSpells + Math.min(notDeleted[0][0] + notDeleted[1][0], height, width) // Deleted 2 adjoining sides, L shape left
        }
    }

    return stacks.reduce((a, c) => a + getSpells(c), 0)
}

console.log(solve(input1))
console.log(solve(input2))
console.log(solve(input3))