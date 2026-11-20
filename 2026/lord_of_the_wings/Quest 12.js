const { off } = require('cluster')
const fs = require('fs')
const [eventName, year, quest] = ['lord_of_the_wings', 2026, 12]
const filePath = `../../inputs/everybody_codes/${year}/${eventName}/quest${quest}`
const [input1, input2, input3] = [1, 2, 3].map((partNo) => fs.readFileSync(`${filePath}_${partNo}.txt`, { encoding: 'utf8', flag: 'a+' }))

class Point {
    constructor(id, r, c, n, isCorner, type) {
        this.id = id
        this.row = r
        this.col = c
        this.neighbours = n
        this.isCorner = isCorner
        this.type = isCorner ? type : null
    }
}

class Edge {
    constructor(id, vertices) {
        this.id = id
        this.start = vertices[0]
        this.end = vertices[1]
        this.vertices = vertices
        this.direction = vertices[0].row === vertices[1].row ? 'h' : 'v'
        this.length = vertices[0].row === vertices[1].row ? vertices[1].col - vertices[0].col + 1 : vertices[1].row - vertices[0].row + 1
    }
}

class Stack {
    constructor(edges, points) {
        //this.id = id
        this.edges = edges
        this.points = edges ? edges.flatMap((e) => e.vertices).filter((p, i, a) => i === a.findIndex((p2) => p2.id === p.id)) : points
    }

    spells() {
        if (!this.edges) return 1 // point
        // if (this.edges.length === 4) {
        //     console.log('is 4', this.edges.length, this.edges[0].length, this.edges[1].length, Math.min(this.edges[0].length, this.edges[1].length))
        //     //this.edges.forEach((e) => console.log(e))
        // }

        if (this.edges.length === 1) return 1 // single line
        if (this.edges.length === 2) return 2 // L shape both width 1
        if (this.edges.length === 4) return Math.min(this.edges[0].length, this.edges[1].length) // rectangle
        let fromConcave = this.edges.filter((e) => e.vertices.some((v) => v.type === 'concave'))
        if (fromConcave.length > 2) { // L shape - one arm width 1
            console.log('fromConcave.length >2')
            let vFromConcave = fromConcave.filter((e) => e.direction === 'v')
            let hFromConcave = fromConcave.filter((e) => e.direction === 'h')
            //console.log('fromConcave.length >2', 'vEdges is ', vFromConcave, 'hedges is ', hFromConcave)

            let arm = vFromConcave.length === 1 ? vFromConcave[0] : hFromConcave[0]
            let newWidth = vFromConcave.length === 1 ? arm.end.row - arm.start.row : arm.end.col - arm.start.col
            let armCornerId = arm.vertices.find((p) => p.type !== 'concave').id
            //console.log('newwidth is ', newWidth, 'armCorner is ', armCornerId)
            let armEdge = this.edges.find((e) => (e.start.id === armCornerId && e.end.type === 'convex') || (e.start.type === 'convex' && e.end.id === armCornerId))
            if (!armEdge) {
                console.log('           ')
                console.log('no armEdge')
                console.log('vfromcon', vFromConcave)
                console.log('hfromcon', hFromConcave)
                this.edges.forEach((e) => console.log(e))
            }
            //console.log('armEdge is ', armEdge)
            return 1 + Math.min(newWidth, armEdge.length)
        } else {
            let [vFromConcave, hFromConcave] = fromConcave[0].direction === 'v' ? fromConcave : fromConcave.reverse()

            let vArmCornerId = vFromConcave.start.type === 'convex' ? vFromConcave.start.id : vFromConcave.end.id
            let vArmEdge = this.edges.find((e) => (e.start.id === vArmCornerId && e.end.type === 'convex') || (e.start.type === 'convex' && e.end.id === vArmCornerId))
            let vArmLen = vArmEdge.length
            let vNewLen = vFromConcave.end.row - vFromConcave.start.row

            let hArmCornerId = hFromConcave.start.type === 'convex' ? hFromConcave.start.id : hFromConcave.end.id
            let hArmEdge = this.edges.find((e) => (e.start.id === hArmCornerId && e.end.type === 'convex') || (e.start.type === 'convex' && e.end.id === hArmCornerId))
            let hArmLen = hArmEdge.length
            let hNewLen = hFromConcave.end.col - hFromConcave.start.col
            //console.log('hFromConcave is ', hFromConcave, 'hid', hArmCornerId, 'hArmEdge', hArmEdge)
            console.log('L shape arms >1', 'vArm,vNew,vLong', vArmLen, vNewLen, vFromConcave.length + hArmLen - 1, ' harm hnew hlong', hArmLen, hNewLen, hFromConcave.length + vArmLen - 1)
            console.log('vArmLen + Math.min(hArmLen, hNewLen)', vArmLen + Math.min(hArmLen, hNewLen))
            console.log('hArmLen + Math.min(vArmLen, vNewLen)', hArmLen + Math.min(vArmLen, vNewLen))
            console.log('vFromConcave.length + hArmLen - 1', vFromConcave.length + hArmLen - 1)
            console.log('hFromConcave.length + vArmLen - 1', hFromConcave.length + vArmLen - 1)
            console.log('returned', Math.min(vArmLen + Math.min(hArmLen, hNewLen), hArmLen + Math.min(vArmLen, vNewLen), vFromConcave.length + hArmLen - 1, hFromConcave.length + vArmLen - 1))
            //console.log(vArmLen + Math.min(hArmLen, hNewLen), hArmLen + Math.min(vArmLen, vNewLen), vFromConcave.length + hArmLen - 1, hFromConcave.length + vArmLen - 1)

            //if (vArmLen < hArmLen) console.log('vArmLen < hArmLen', vArmLen, Math.min(hArmLen, hNewLen))
            //if (hArmLen < vArmLen) console.log('hArmLen < vArmLen', hArmLen, Math.min(vArmLen, vNewLen))
            //if (vArmLen === hArmLen) console.log('vArmLen === hArmLen', vArmLen, Math.min(vNewLen, hNewLen))

            //if (vArmLen < hArmLen) return vArmLen + Math.min(hArmLen, hNewLen)
            //if (hArmLen < vArmLen) return hArmLen + Math.min(vArmLen, vNewLen)

            // return Math.min(vArmLen + Math.min(hArmLen, hNewLen), hArmLen + Math.min(vArmLen, vNewLen), vFromConcave.length + hArmLen - 1, hFromConcave.length + vArmLen - 1)
            return Math.min(vArmLen + Math.min(hArmLen, hNewLen), hArmLen + Math.min(vArmLen, vNewLen))

        }
    }

}

//let vertices = []
let lines = input1.split(/[\r\n]+/).map((x) => x.split(''))
console.log(lines.length, lines[0].length)
let pointId = 0
let rId = 0

const nSides = (r, c) => [[r - 1, c, 'U'], [r + 1, c, 'D'], [r, c + 1, 'R'], [r, c - 1, 'L']].flatMap(([nr, nc, nd]) => lines?.[nr]?.[nc] && lines[nr][nc] !== '.' ? [nd] : [])

const nCorners = (r, c) => [[r - 1, c - 1, 'UL'], [r - 1, c + 1, 'UR'], [r + 1, c - 1, 'DL'], [r + 1, c + 1, 'DR']].flatMap(([nr, nc, nd]) => lines?.[nr]?.[nc] === '.' ? [nd] : [])

const cDirs = ['UL', 'UR', 'DL', 'DR']
const dirs = ['T', 'B', 'L', 'R']
const oppDirs = { T: 'B', B: 'T', R: 'L', L: 'R' }

const findCorners = (r, c) => {
    if (lines[r][c] === '.') return []

    let neighbours = nSides(r, c)

    if (neighbours.length < 2) return [new Point(pointId++, r, c, neighbours, false)]

    let isConvex = neighbours.length === 2 && cDirs.some((cd) => cd.split('').every((d) => neighbours.includes(d)))
    let cNeighbours = nCorners(r, c).filter((nd) => nd.split('').every((d) => neighbours.includes(d)))
    let isConcave = !!cNeighbours.length
    if (!isConvex && !isConcave) return []

    if (isConcave && neighbours.length === 4) neighbours = cNeighbours[0].split('')

    let cornerType = isConvex && isConcave ? 'both' : isConvex ? 'convex' : 'concave'

    return [new Point(pointId++, r, c, neighbours, true, cornerType)]
}

let points = lines.flatMap((row, rowInd) => row.flatMap((val, colInd) => findCorners(rowInd, colInd)))
//console.log(points)
let pointsByRow = Map.groupBy(points, ({ row }) => row)
let pointsByCol = Map.groupBy(points, ({ col }) => col)

let edges = []
let stacks = []
let edgeId = 0

// pointsByRow.entries().forEach(([r, a]) => { console.log('         '), console.log(r); a.forEach((v) => console.log(v)) })

// Make horizontal edges (and single point stacks)
pointsByRow.entries().forEach(([r, arr]) => {
    let vArr = arr.slice(0)
    while (vArr.length) {
        let v = vArr.shift()
        if (v.neighbours.length === 0) {
            stacks.push(new Stack(null, [v]))
        } else if (v.neighbours.includes('R')) {
            if (vArr.length && vArr[0].neighbours.includes('L')) {
                let next = vArr[0]
                edges.push(new Edge(edgeId++, [v, next]))
                // if (vArr.length && next.neighbours.includes('R') && vArr[0].neighbours.includes('L')) {
                //     let nextNext = vArr[0]
                //     edges.push(new Edge(edgeId++, [next, nextNext]))
                // }
            }
        }
    }
})

// Make vertical edges
pointsByCol.entries().forEach(([c, arr]) => {
    let vArr = arr.slice(0)
    while (vArr.length) {
        let v = vArr.shift()
        if (v.neighbours.includes('D')) {
            if (vArr.length && vArr[0].neighbours.includes('U')) {
                let next = vArr[0]
                edges.push(new Edge(edgeId++, [v, next]))
                // if (vArr.length && next.neighbours !vArr[0].neighbours.includes('D')) {
                //     let nextNext = vArr.shift()
                //     edges.push(new Edge(edgeId++, [next, nextNext]))
                // }
            }
        }
    }
})
console.log('edges done')
// Make stacks


const bfs = (edge) => {
    let eSeen = new Set([edge.id])
    let result = [edge]

    while (edges.some((e) => !eSeen.has(e.id) && result.some((e2) => e2.vertices.some((c) => c.id === e.start.id || c.id === e.end.id)))) {
        let toAdd = edges.filter((e) => !eSeen.has(e.id) && result.some((e2) => e2.vertices.some((c) => c.id === e.start.id || c.id === e.end.id)))
        toAdd.forEach((e) => {
            eSeen.add(e.id)
            result.push(e)
        })
    }
    return result
}

let sSeen = new Set()


edges.forEach((e, i, a) => {
    if (!sSeen.has(e.id)) {
        let adjacent = bfs(e)
        adjacent.forEach((e2) => sSeen.add(e2.id))
        stacks.push(new Stack(adjacent))
    }
})

// stacks.forEach((s) => {
//     console.log('               ')
//     console.log('stack edges length', s?.edges?.length)
//     if (s.edges && s.edges.length > 6) {
//         s.edges.forEach((e) => console.log(e))
//         s.points.forEach((p) => console.log(p))
//     }

// })




// console.log(stacks.map((x) => ['spells', x.spells(), 'edges len ', x?.edges?.length]))
// console.log(stacks.reduce((a, c) => a + c.spells(), 0))


stacks.sort((s1, s2) => {
    let s1MinRow = Math.min(...s1.points.map((p) => p.row))
    let s2MinRow = Math.min(...s2.points.map((p) => p.row))
    if (s1MinRow === s2MinRow) {
        let s1MinCol = Math.min(...s1.points.map((p) => p.col))
        let s2MinCol = Math.min(...s2.points.map((p) => p.col))
        return s1MinCol - s2MinCol
    }
    return s1MinRow - s2MinRow
})

// stacks.forEach((s, i) => {
//     console.log('                   ')
//     console.log('                   ')

//     if (s.points.length === 1) {
//         console.log(i, ' point', s.points[0])
//     } else {
//         let mincol = Math.min(...s.points.map((p) => p.col))
//         let maxcol = Math.max(...s.points.map((p) => p.col))
//         let minrow = Math.min(...s.points.map((p) => p.row))
//         let maxrow = Math.max(...s.points.map((p) => p.row))

//         lines.filter((x, rowInd) => minrow <= rowInd && rowInd <= maxrow).forEach((row) => {
//             console.log(row.slice(mincol, maxcol + 1).join(''))
//         })
//         console.log('                   ')

//         console.log(i, ' edges len', s.edges.length)
//         console.log('minrow,mincol', minrow, mincol)
//         console.log('maxrow,mincol', maxrow, maxcol)
//         //console.log('spells is ', s.spells())
//         s.edges.forEach((e) => console.log(e))
//     }


// })


console.log(stacks.reduce((a, c) => a + c.spells(), 0))