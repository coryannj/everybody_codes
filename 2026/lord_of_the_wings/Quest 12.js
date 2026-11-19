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
        if (!this.edges) return 1
        if (this.edges.length === 1) return edges[0].length
        if (this.edges.length === 2) return 2
        if (this.edges.length === 4) return edges[0].length + edges[1].length
        let fromConcave = this.edges.filter((e) => e.vertices.some((v) => v.type === 'concave'))
        console.log(fromConcave)
    }

}

//let vertices = []
let lines = input1.split(/[\r\n]+/).map((x) => x.split(''))
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
    let isConcave = nCorners(r, c)?.some((nd) => nd.split('').every((d) => neighbours.includes(d)))
    if (!isConvex && !isConcave) return []

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

// Make horizontal edges (and single point stacks)
pointsByRow.entries().forEach(([r, arr]) => {
    let vArr = arr.slice(0)
    while (vArr.length) {
        let v = vArr.shift()
        if (v.neighbours.length === 0) {
            stacks.push(new Stack(null, [v]))
        } else if (v.neighbours.includes('R')) {
            if (vArr.length && vArr[0].neighbours.includes('L')) {
                let next = vArr.shift()
                edges.push(new Edge(edgeId++, [v, next]))
                if (vArr.length && vArr[0].neighbours.includes('L')) {
                    let nextNext = vArr.shift()
                    edges.push(new Edge(edgeId++, [next, nextNext]))
                }
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
                let next = vArr.shift()
                edges.push(new Edge(edgeId++, [v, next]))
                if (vArr.length && vArr[0].neighbours.includes('U')) {
                    let nextNext = vArr.shift()
                    edges.push(new Edge(edgeId++, [next, nextNext]))
                }
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
console.log(stacks[1].spells())
//stacks.forEach((s) => console.log(s))