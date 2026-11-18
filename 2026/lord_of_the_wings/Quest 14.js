const { off } = require('cluster')
const fs = require('fs')
const [eventName, year, quest] = ['lord_of_the_wings', 2026, 14]
const filePath = `../../inputs/everybody_codes/${year}/${eventName}/quest${quest}`
const [input1, input2, input3] = [1, 2, 3].map((partNo) => fs.readFileSync(`${filePath}_${partNo}.txt`, { encoding: 'utf8', flag: 'a+' }))



let lines = input1.split(/[\r\n]+/).map((x) => x.split(''))

let rowLen = lines.length
let colLen = lines[0].length

//console.log(rowLen, colLen, rowLen * colLen)
// let debugColLen = colLen + (colLen - 1)
// let debug = lines.flatMap((row, rowInd) => rowInd + 1 < rowLen ? [row.flatMap((val, colInd) => colInd + 1 < colLen ? [val, ' '] : [val]), Array(debugColLen).fill().map((x) => ' ')] : [row.flatMap((val, colInd) => colInd + 1 < colLen ? [val, ' '] : [val])])

class Point {
    constructor(r, c, key, val, neighbours, isEdge) {
        this.row = r
        this.col = c
        this.key = key
        this.val = val
        this.neighbours = neighbours
        this.isEdge = isEdge
    }
}

class Window {
    constructor(val, points) {
        this.val = val
        //this.points = points
        this.toFrame = points.some((p) => p.neighbours.length < 4)
        this.outside = points.flatMap((p) => p.neighbours.length < 4 ? [4 - p.neighbours.length] : []).reduce((a, c) => a + c, 0) || null
        this.inside = countNeighbours(val, points.flatMap((p) => p.neighbours.filter(([k, v]) => v !== val)))
    }
}

const getNeighbours = (r, c) => [[r + 1, c, 'D'], [r - 1, c, 'U'], [r, c - 1, 'L'], [r, c + 1, 'R']].flatMap(([nr, nc, nd]) => lines?.[nr]?.[nc] ? [[nd, lines[nr][nc]]] : [])

const countNeighbours = (val, neighbours) => {
    let counts = neighbours.reduce((a, [k, v]) => { return a[v] ? a[v]++ : a[v] = 1, a }, {})

    return Object.entries(counts).map(([k, v]) => [val, k, v])
}

let points = []


lines.forEach((row, rowInd) => row.forEach((val, colInd) => {
    let key = `${rowInd}_${colInd}`
    let n = getNeighbours(rowInd, colInd)
    points.push(new Point(rowInd, colInd, key, val, n, n.some(([k, v]) => v !== val) || n.length < 4))

}))

let windows = []



Map.groupBy(points, ({ val }) => val).entries().forEach(([val, points]) => {
    let w = new Window(val, points)
    windows.push(new Window(val, points))
})

let wByKey = Map.groupBy(windows, (w) => w.val)
console.log(wByKey.get('u'), wByKey.get('2'))


// windows.forEach((w) => {
//     console.log('           ')
//     console.log('val is ', w.val, ' toFrame', w.toFrame, ' outside', w.outside)
//     w.inside.forEach((x) => console.log(x))
// })




//let kGroups = new Map(windows.filter((w) => w.toFrame).map((w, i, a) => [i, { connected: new Set([w.val]), toOutside: true, frameLen: w.outside, frameVal: w.val, edges: [] }]))
//console.log(kGroups)

let kGroups = new Map()
let kgSeen = new Set()
let wLen = windows.length

//let kgSeen = kGroups.values().map((g) => g.connected).reduce((a, c) => a.union(c))
console.log(kgSeen)

let edges = Object.values(windows).flatMap((w) => w.inside.map(([p, n, dist]) => [p, n].sort().concat(dist))).sort((a, b) => {
    // if (a[2] === b[2]) {
    //     return b.slice(0, 2).filter((x) => kgSeen.has(x)).length - a.slice(0, 2).filter((x) => kgSeen.has(x)).length
    // }
    return a[2] - b[2]
}).filter((x, i, a) => i === a.findIndex((v) => v[0] === x[0] && v[1] === x[1]))

//console.log(edges.length)


let kgId = 0

for (const [prev, next, dist] of edges) {
    if (!kgSeen.has(prev) && !kgSeen.has(next)) {
        kGroups.set(kgId++, { connected: new Set([prev, next]), edges: [[prev, next, dist]] })
    } else if (kgSeen.has(prev) && !kgSeen.has(next)) {
        let id = kGroups.keys().find((k) => kGroups.get(k).connected.has(prev))
        kGroups.get(id).connected.add(next)
        kGroups.get(id).edges.push([prev, next, dist])
    } else if (!kgSeen.has(prev) && kgSeen.has(next)) {
        let id = kGroups.keys().find((k) => kGroups.get(k).connected.has(next))
        kGroups.get(id).connected.add(prev)
        kGroups.get(id).edges.push([prev, next, dist])
    }
    kgSeen.add(prev)
    kgSeen.add(next)
    if (kgSeen.size === wLen) break;
}

console.log(kGroups.values().reduce((a, c) => a + c.edges.reduce((acc, cum) => acc + cum[2], 0), 0))

//console.log(kGroups)

console.log(edges.find(([p, n, d]) => {
    let ent = kGroups.entries().filter(([id, o]) => o.connected.has(p) || o.connected.has(n)).toArray()
    return ent.length === 2 && ent.some(([id, o]) => o.connected.values().toArray().filter((v) => wByKey.get(v)[0].toFrame).length === 0)
}))

let noOutside = edges.find(([p, n, d]) => {
    let ent = kGroups.entries().filter(([id, o]) => o.connected.has(p) || o.connected.has(n)).toArray()
    return ent.length === 2 && ent.some(([id, o]) => o.connected.values().toArray().filter((v) => wByKey.get(v)[0].toFrame).length === 0)
})

while (noOutside) {
    let [p, n, d] = noOutside
    console.log(kGroups.size, noOutside)
    let [[id, o], [id2, o2]] = kGroups.entries().filter(([k, v]) => v.connected.has(p) || v.connected.has(n))

    if (o.connected.values().toArray().filter((v) => wByKey.get(v)[0].toFrame).length === 0) {
        kGroups.get(id2).edges.push(noOutside, ...o.edges)
        o.connected.values().forEach((v) => kGroups.get(id2).connected.add(v))
        kGroups.delete(id)
    } else {
        kGroups.get(id).edges.push(noOutside, ...o2.edges)
        o2.connected.values().forEach((v) => kGroups.get(id).connected.add(v))
        kGroups.delete(id2)
    }


    noOutside = edges.find(([p, n, d]) => {
        let ent = kGroups.entries().filter(([id, o]) => o.connected.has(p) || o.connected.has(n)).toArray()
        return ent.length === 2 && ent.some(([id, o]) => o.connected.values().toArray().filter((v) => wByKey.get(v)[0].toFrame).length === 0)
    })
}





// while (kGroups.values().some((o) => o.connected.values().toArray().filter((v) => wByKey.get(v)[0].toFrame).length === 0)) {
//     kGroups.entries().filter(([id, o]) => o.connected.values().toArray().filter((v) => wByKey.get(v)[0].toFrame).length === 0).forEach(([id, o]) => {
//         if (kGroups.has(id)) {
//             let join = edges.find(([p, n, d]) => (o.connected.has(p) && !o.connected.has(n)) || (!o.connected.has(p) && o.connected.has(n)))
//             console.log('no outside, join is', join)
//             let joinKey = o.connected.has(join[0]) ? join[1] : join[0]
//             let joinId = kGroups.keys().find((k) => kGroups.get(k).connected.has(joinKey))
//             kGroups.get(joinId).edges.push(join, ...o.edges)
//             o.connected.values().forEach((v) => kGroups.get(joinId).connected.add(v))
//             kGroups.delete(id)
//         }
//     })
//     console.log('SUM ', kGroups.values().reduce((a, c) => {
//         let outLen = c?.outLen || 0
//         let insideLen = c.edges.reduce((acc, cum) => acc + cum[2], 0)
//         return a + outLen + insideLen
//     }, 0))
// }

//while (kGroups.values().some((o) => !o.outLen)) {
kGroups.entries().forEach(([id, o]) => {
    if (kGroups.has(id)) {
        let outside = o.connected.values().flatMap((v) => wByKey.get(v)[0].toFrame ? [[v, wByKey.get(v)[0].outside]] : []).toArray().sort((a, b) => a[1] - b[1])
        let join = edges.find(([p, n, d]) => (o.connected.has(p) && !o.connected.has(n)) || (!o.connected.has(p) && o.connected.has(n)))
        //console.log('               ')
        //console.log(id, o.connected, o.edges)
        console.log('outside is ', outside)
        //console.log('join is ', join)

        // if (join && join[2] < outside[0][1]) {
        //     console.log('join smaller', join)
        //     let joinKey = o.connected.has(join[0]) ? join[1] : join[0]
        //     let joinId = kGroups.keys().find((k) => kGroups.get(k).connected.has(joinKey))
        //     kGroups.get(joinId).edges.push(join, ...o.edges)
        //     o.connected.values().forEach((v) => kGroups.get(joinId).connected.add(v))
        //     kGroups.delete(id)
        // } else {
        //console.log('outside is shorter')
        kGroups.get(id)['outside'] = true
        kGroups.get(id)['outVal'] = outside[0][0]
        kGroups.get(id)['outLen'] = outside[0][1]
        //}
        console.log('SUM ', kGroups.values().reduce((a, c) => {
            let outLen = c?.outLen || 0
            let insideLen = c.edges.reduce((acc, cum) => acc + cum[2], 0)
            return a + outLen + insideLen
        }, 0))
    }
})

console.log('SUM ', kGroups.values().reduce((a, c) => {
    let outLen = c?.outLen || 0
    let insideLen = c.edges.reduce((acc, cum) => acc + cum[2], 0)
    return a + outLen + insideLen
}, 0))
//}



console.log('SUM ', kGroups.values().reduce((a, c) => {
    let outLen = c?.outLen || 0
    let insideLen = c.edges.reduce((acc, cum) => acc + cum[2], 0)
    return a + outLen + insideLen
}, 0))

let oSorted = kGroups.entries().map(([id, o]) => [id, o.outLen]).toArray().sort((a, b) => a[1] - b[1])
console.log(oSorted)

while (kGroups.entries().some(([id, o]) => oSorted.find(([id2, outLen2]) => {
    if (!kGroups.has(id2)) return false
    let o2Connections = kGroups.get(id2).connected
    return kGroups.has(id2) && id !== id2 && outLen2 <= o.outLen && edges.some(([p, n, d]) => (o.connected.has(p) && o2Connections.has(n) && d < o.outLen) || (o.connected.has(n) && o2Connections.has(p) && d < o.outLen))
}))) {

    kGroups.entries().filter(([id, o]) => oSorted.find(([id2, outLen2]) => {
        if (!kGroups.has(id2)) return false
        let o2Connections = kGroups.get(id2).connected
        return kGroups.has(id2) && id !== id2 && outLen2 <= o.outLen && edges.some(([p, n, d]) => (o.connected.has(p) && o2Connections.has(n) && d < o.outLen) || (o.connected.has(n) && o2Connections.has(p) && d < o.outLen))
    })).forEach(([id, o]) => {
        console.log('id is ', id, ' o is ', o)

        console.log('TEST ', oSorted.filter(([id2, oLen2]) => id2 !== id).map(([id2, oLen2]) => {
            let o2Connections = kGroups.get(id2).connected
            let jEdge = edges.find(([p, n, d]) => (o.connected.has(p) && o2Connections.has(n) && d < o.outLen) || (o.connected.has(n) && o2Connections.has(p) && d < o.outLen))?.[2] || Infinity
            return [id2, oLen2, jEdge, oLen2 + jEdge]
        }).sort((a, b) => a[3] - b[3]))






        let [joinId, joinOutLen] = oSorted.find(([id2, outLen2]) => {
            if (!kGroups.has(id2)) return false
            let o2Connections = kGroups.get(id2).connected
            return kGroups.has(id2) && id !== id2 && outLen2 <= o.outLen && edges.some(([p, n, d]) => (o.connected.has(p) && o2Connections.has(n) && d < o.outLen) || (o.connected.has(n) && o2Connections.has(p) && d < o.outLen))
        })
        console.log('joinId,joinOutlen', joinId, joinOutLen)
        let joinObj = kGroups.get(joinId)
        let joinEdge = edges.find(([p, n, d]) => (o.connected.has(p) && joinObj.connected.has(n)) || (o.connected.has(n) && joinObj.connected.has(p)))
        console.log('curr outlen is ', o.outLen, 'joinId is ', joinId, ' join outlen ', joinObj.outLen, ' joinedge is ', joinEdge)
        //let joinKey = o.connected.has(join[0]) ? join[1] : join[0]
        //let joinId = kGroups.keys().find((k) => kGroups.get(k).connected.has(joinKey))
        kGroups.get(joinId).edges.push(joinEdge, ...o.edges)
        o.connected.values().forEach((v) => kGroups.get(joinId).connected.add(v))
        kGroups.delete(id)
        oSorted = oSorted.filter(([id, v]) => kGroups.has(id))
        console.log('SUM ', kGroups.values().reduce((a, c) => {
            let outLen = c.outLen
            let insideLen = c.edges.reduce((acc, cum) => acc + cum[2], 0)
            return a + outLen + insideLen
        }, 0))
    })
}






// while(kGroups.entries().some(([id, o]) => kGroups.entries().some(([id2, o2]) => id !== id2 && o2.outLen <= o.outLen && edges.some(([p, n, d]) => (o.connected.has(p) && o2.connected.has(n) && d < o.outLen) || (o.connected.has(n) && o2.connected.has(p) && d < o.outLen))))){
//     kGroups.entries().filter(([id, o]) => kGroups.entries().some(([id2, o2]) => id !== id2 && o2.outLen <= o.outLen && edges.some(([p, n, d]) => (o.connected.has(p) && o2.connected.has(n) && d < o.outLen) || (o.connected.has(n) && o2.connected.has(p) && d < o.outLen)))).forEach(([id,o])=>{
//         let [joinId,joinObj] = kGroups.entries().some(([id2, o2]) => id !== id2 && o2.outLen <= o.outLen && edges.some(([p, n, d]) => (o.connected.has(p) && o2.connected.has(n) && d < o.outLen) || (o.connected.has(n) && o2.connected.has(p) && d < o.outLen)))
//     })
// }

while (kGroups.entries().some(([id, o]) => kGroups.entries().some(([id2, o2]) => id !== id2 && o2.outLen < o.outLen && edges.some(([p, n, d]) => (o.connected.has(p) && o2.connected.has(n) && d < o.outLen) || (o.connected.has(n) && o2.connected.has(p) && d < o.outLen))))) {
    kGroups.entries().filter(([id, o]) => kGroups.entries().some(([id2, o2]) => id !== id2 && o2.outLen < o.outLen && edges.some(([p, n, d]) => (o.connected.has(p) && o2.connected.has(n) && d < o.outLen) || (o.connected.has(n) && o2.connected.has(p) && d < o.outLen)))).forEach(([id, o]) => {
        console.log('id is ', id, ' o is ', o)
        let [joinId, joinObj] = kGroups.entries().find(([id2, o2]) => id !== id2 && o2.outLen < o.outLen && edges.some(([p, n, d]) => (o.connected.has(p) && o2.connected.has(n) && d < o.outLen) || (o.connected.has(n) && o2.connected.has(p) && d < o.outLen)))

        let joinEdge = edges.find(([p, n, d]) => (o.connected.has(p) && joinObj.connected.has(n)) || (o.connected.has(n) && joinObj.connected.has(p)))
        console.log('curr outlen is ', o.outLen, 'joinId is ', joinId, ' join outlen ', joinObj.outLen, ' joinedge is ', joinEdge)
        //let joinKey = o.connected.has(join[0]) ? join[1] : join[0]
        //let joinId = kGroups.keys().find((k) => kGroups.get(k).connected.has(joinKey))
        kGroups.get(joinId).edges.push(joinEdge, ...o.edges)
        o.connected.values().forEach((v) => kGroups.get(joinId).connected.add(v))
        kGroups.delete(id)

        console.log('SUM ', kGroups.values().reduce((a, c) => {
            let outLen = c.outLen
            let insideLen = c.edges.reduce((acc, cum) => acc + cum[2], 0)
            return a + outLen + insideLen
        }, 0))
    })
}


console.log(kGroups.size)
let primsQueue = windows.filter((w) => w.toFrame && w.inside.every(([p, n, d]) => d > w.outside))

let pSeen = new Set(primsQueue.map((w) => w.val))
console.log(pSeen)

let sum = kGroups.values().reduce((a, c) => {
    let outLen = c.outLen
    let insideLen = c.edges.reduce((acc, cum) => acc + cum[2], 0)
    return a + outLen + insideLen
}, 0)


let last = kGroups.values().toArray()[0]
console.log(last)
let adjusted = pSeen.values().filter((v) => v !== last.outVal).map((v) => [wByKey.get(v)[0].outside, last.edges.find((x) => x.includes(v))]).toArray()[0]
console.log(adjusted)
sum += (adjusted[0] - adjusted[1][2])
console.log(sum)
console.log(wByKey.get('2')[0])

console.log(kGroups.entries().filter(([id, o]) => kGroups.entries().some(([id2, o2]) => id !== id2 && o2.outLen <= o.outLen && edges.some(([p, n, d]) => (o.connected.has(p) && o2.connected.has(n) && d <= o.outLen) || (o.connected.has(n) && o2.connected.has(p) && d <= o.outLen)))).toArray())





while (kGroups.entries().some(([id, o]) => !o?.outside || o.outLen < edges?.find(([p, n, d]) => (o.connected.has(p) && !o.connected.has(n)) || (!o.connected.has(p) && o.connected.has(n)))?.[2] || 0)) {





    kGroups.entries().filter(([id, o]) => !o?.outside || o.outLen < edges?.find(([p, n, d]) => (o.connected.has(p) && !o.connected.has(n)) || (!o.connected.has(p) && o.connected.has(n)))?.[2] || 0).forEach(([id, o]) => {
        if (kGroups.has(id)) {
            if (o.outLen) {
                let join = edges.find(([p, n, d]) => (o.connected.has(p) && !o.connected.has(n)) || (!o.connected.has(p) && o.connected.has(n)) && d < o.outLen)
                console.log('join is smaller than outLen', join)
                let joinKey = o.connected.has(join[0]) ? join[1] : join[0]
                let joinId = kGroups.keys().find((k) => kGroups.get(k).connected.has(joinKey))
                kGroups.get(joinId).edges.push(join, ...o.edges)
                o.connected.values().forEach((v) => kGroups.get(joinId).connected.add(v))
                kGroups.delete(id)
            } else {
                let outside = o.connected.values().flatMap((v) => wByKey.get(v)[0].toFrame ? [[v, wByKey.get(v)[0].outside]] : []).toArray().sort((a, b) => a[1] - b[1])
                console.log('               ')
                console.log(id, o.connected, o.edges)

                //console.log('join is ', edges.find(([p, n, d]) => (o.connected.has(p) && !o.connected.has(n)) || (!o.connected.has(p) && o.connected.has(n))))
                if (outside.length) {
                    console.log('outside is ', outside)
                    kGroups.get(id)['outside'] = true
                    kGroups.get(id)['outVal'] = outside[0][0]
                    kGroups.get(id)['outLen'] = outside[0][1]
                    //console.log(id, o.connected, outside)
                } else {

                }
            }




        }

    })

    console.log('SUM ', kGroups.values().reduce((a, c) => {
        let outLen = c?.outLen || 0
        let insideLen = c.edges.reduce((acc, cum) => acc + cum[2], 0)
        return a + outLen + insideLen
    }, 0))
}


kGroups.entries().forEach(([id, g]) => {
    console.log(id)
    console.log(g)
    console.log(g.outLen, edges.find(([p, n, d]) => (g.connected.has(p) && !g.connected.has(n)) || (g.connected.has(n) && !g.connected.has(p))))
})



console.log(kGroups)






let edgesCopy = structuredClone(edges)

edges.forEach(([prev, next, dist]) => {
    console.log('                   ')
    console.log('NEW ', '           ')
    console.log([prev, next, dist])
    if (!kgSeen.has(prev) && !kgSeen.has(next)) {
        console.log('both not in group')
        let out = [prev, next].map((v) => wByKey.get(v)[0]).filter((w) => w.toFrame).map((w) => [w.val, w.outside]).sort((a, b) => a[1] - b[1])

        let toOutSideVal = out.length ? true : false
        let frameVal = out.length ? out[0][0] : null
        let frameLen = out.length ? out[0][1] : null


        kGroups.set(kgId++, { connected: new Set([prev, next]), toOutside: toOutSideVal, frameLen: frameLen, frameVal: frameVal })
    } else if (!kgSeen.has(prev) && kgSeen.has(next)) {
        console.log('prev not in map')
        let id = kGroups.keys().find((k) => kGroups.get(k).connected.has(next))
        //kGroups.get(id).edges.push([prev, next, dist])
        kGroups.get(id).connected.add(prev)
    } else if (kgSeen.has(prev) && !kgSeen.has(next)) {

        let id = kGroups.keys().find((k) => kGroups.get(k).connected.has(prev))
        console.log('next not in map', 'id is ', id, kGroups.get(id))
        //kGroups.get(id).edges.push([prev, next, dist])
        kGroups.get(id).connected.add(next)
    } else if (kGroups.values().map((v) => v.connected).filter((c) => c.has(prev) || c.has(next)).toArray().length === 2) {
        console.log('to merge', prev, next, dist)
        let prevId = kGroups.keys().find((k) => kGroups.get(k).connected.has(prev))
        let nextId = kGroups.keys().find((k) => kGroups.get(k).connected.has(next))

        let pObj = kGroups.get(prevId)
        let nObj = kGroups.get(nextId)
        console.log('prevObj is ', pObj)
        console.log('nextObj is ', nObj)
        if (!pObj.toOutside && !nObj.toOutside) {
            //kGroups.get(prevId).edges.push([prev, next, dist], ...nObj.edges)
            nObj.connected.values().forEach((v) => kGroups.get(prevId).connected.add(v))
            // } else if (pObj.frameVal === prev && nObj.frameVal === next) {
            //     if (dist < pObj.frameLen || dist < nObj.frameLen) {
            //         console.log('dist < framelen')
            //         if (pObj.frameLen < nObj.frameLen) {
            //             console.log('prev framelen < next framelen')
            //             kGroups.get(prevId).edges.push([prev, next, dist], ...nObj.edges)
            //             nObj.connected.values().forEach((v) => kGroups.get(prevId).connected.add(v))
            //             kGroups.delete(nextId)
            //         } else if (nObj.frameLen < pObj.frameLen) {
            //             console.log('next framelen < prev framelen')
            //             kGroups.get(nextId).edges.push([prev, next, dist], ...pObj.edges)
            //             pObj.connected.values().forEach((v) => kGroups.get(nextId).connected.add(v))
            //             kGroups.delete(prevId)
            //         } else {
            //             console.log('prev and next frame dist is same,merging to prev')
            //             kGroups.get(prevId).edges.push([prev, next, dist], ...nObj.edges)
            //             nObj.connected.values().forEach((v) => kGroups.get(prevId).connected.add(v))
            //             kGroups.delete(nextId)
            //         }
            //     }
        } else if (pObj.toOutside && nObj.toOutside) {
            console.log('')
            if (dist < nObj.frameLen && pObj.frameLen < nObj.frameLen) {
                console.log('prev framelen < next framelen')
                //kGroups.get(prevId).edges.push([prev, next, dist], ...nObj.edges)
                nObj.connected.values().forEach((v) => kGroups.get(prevId).connected.add(v))
                kGroups.delete(nextId)
            } else if (dist < pObj.frameLen && nObj.frameLen < pObj.frameLen) {
                console.log('next framelen < prev framelen')
                //kGroups.get(nextId).edges.push([prev, next, dist], ...pObj.edges)
                pObj.connected.values().forEach((v) => kGroups.get(nextId).connected.add(v))
                kGroups.delete(prevId)
            } else {
                if (dist < nObj.frameLen || dist < pObj.frameLen) {
                    if (nObj.frameLen === pObj.frameLen) {
                        console.log(' EQUAL')
                        //kGroups.get(prevId).edges.push([prev, next, dist], ...nObj.edges)
                        nObj.connected.values().forEach((v) => kGroups.get(prevId).connected.add(v))
                        kGroups.delete(nextId)
                    }
                } else {
                    console.log(' NO MERGE DIST HIGHER', [prev, next, dist])
                }
            }
        } else if (pObj.toOutside && !nObj.toOutside) {
            console.log('prev connection to outside and nObj not')
            //kGroups.get(prevId).edges.push([prev, next, dist], ...nObj.edges)
            nObj.connected.values().forEach((v) => kGroups.get(prevId).connected.add(v))
            kGroups.delete(nextId)
        } else if (!pObj.toOutside && nObj.toOutside) {
            console.log('next connection to outside and pObj not')
            //kGroups.get(nextId).edges.push([prev, next, dist], ...pObj.edges)
            pObj.connected.values().forEach((v) => kGroups.get(nextId).connected.add(v))
            kGroups.delete(prevId)
        } else {
            console.log('still more weird stuff')
        }



    } else {
        console.log('same id???!?', prev, next, dist)
    }
    kgSeen.add(prev)
    kgSeen.add(next)
})

kGroups.entries().forEach(([id, g]) => {
    console.log(id)
    console.log(g)
})







// while (kGroups.values().some((v) => !v.toOutside)) {
//     kGroups.keys().forEach((id) => {
//         if (kGroups.has(id)) {
//             let g = kGroups.get(id)


//             console.log('JOIN LOOP id is ', id, ' g is ', g.connected.size, g.toOutside, g.frameLen)
//             let join = edges.filter(([p, n, d]) => (g.connected.has(p) && !g.connected.has(n)) || (g.connected.has(n) && !g.connected.has(p)))
//             console.log('join', join.slice(0, 10))
//             if (!g.toOutside || g.frameLen > join[0][2]) {
//                 console.log('JOIN FOUND', join, join.slice(0, 10))
//                 let [p, n, d] = join[0]
//                 let joinVal = g.connected.has(p) ? n : p
//                 let joinId = kGroups.keys().find((k) => kGroups.get(k).connected.has(joinVal))
//                 //let prevId = kGroups.keys().find((k) => kGroups.get(k).connected.has(prev))
//                 console.log('MADE JOIN joinVal is ', joinVal, ' joinId is ', joinId, ' join is ', kGroups.get(joinId))
//                 kGroups.get(joinId).edges.push([p, n, d], ...g.edges)
//                 g.connected.values().forEach((v) => kGroups.get(joinId).connected.add(v))
//                 kGroups.delete(id)
//             }
//         }
//     })
// }


let kTotal = 0

kGroups.entries().forEach(([id, g]) => {
    let edgesTotal = g.edges.reduce((a, c) => a + c[2], 0)

    console.log('LAST LOOP', id, g.frameLen, edgesTotal, g)
    let join = edges.filter(([p, n, d]) => (g.connected.has(p) && !g.connected.has(n)) || (g.connected.has(n) && !g.connected.has(p)))
    //console.log('join', join.slice(0, 10))
    kTotal += g.frameLen
    kTotal += edgesTotal
})



console.log(kTotal)





// //console.log(grid.windows.S)

// //console.log(Object.entries(grid.windows)[0][1].inside)

// let maxConnections = Math.max(...Object.values(grid.windows).flatMap((w) => w.inside.map((v) => v[2])))

// //let

// let primsQueue = Object.values(grid.windows).filter((w) => w.toFrame && w.inside.every(([p, n, d]) => d > w.outside))

// let pSeen = new Set(primsQueue.map((w) => w.val))
// console.log(pSeen)



// //console.log([...new Set(lines.flat(2))].map((x) => [x, edges.find((y) => y.includes(x))]))


// let groups = new Map()
// let groupId = 0

// let gSeen = new Set()

// while (edges.length) {
//     let [p, n, dist] = edges.shift()
//     if (!groups.size || (!gSeen.has(p) && !gSeen.has(n))) {
//         groups.set(groupId++, { windows: new Set([p, n]), edges: [[p, n, dist]] })
//         gSeen.add(p)
//         gSeen.add(n)
//     } else if (!gSeen.has(p) || !gSeen.has(n)) {
//         let gKey = groups.keys().find((k) => {
//             let w = groups.get(k).windows
//             return w.has(p) || w.has(n)
//         })
//         groups.get(gKey).windows.add(p)
//         groups.get(gKey).windows.add(n)
//         groups.get(gKey).edges.push([p, n, dist])
//         gSeen.add(p)
//         gSeen.add(n)
//     }

//     edges.sort((a, b) => {
//         if (a[2] === b[2]) {
//             return b.filter((bv) => gSeen.has(bv)).length - a.filter((av) => gSeen.has(av)).length
//         }
//         return a[2] - b[2]
//     })
// }


// //0 20
// //1 19 39
// // 3 6 45
// // 4 20 65





// // groups.values().toArray().sort((a, b) => b.windows.size - a.windows.size).forEach((v) => console.log('v is ', v))


// groups.entries().forEach(([id, g]) => {
//     let toOutside = g.windows.values().flatMap((v) => grid.windows[v].toFrame ? [[v, grid.windows[v].outside]] : []).toArray().sort((a, b) => a[1] - b[1])

//     if (toOutside.length) {
//         if (toOutside[0][1] === 1) {
//             groups.get(id).isOutside = true
//             groups.get(id).toOutside = toOutside[0]
//         } else {
//             let join = edgesCopy.filter(([p, n, d]) => (!g.windows.has(p) && g.windows.has(n)) || (!g.windows.has(n) && g.windows.has(p)))
//             //console.log('tooutside', toOutside.slice(0, 5), 'join is ', join.slice(0, 5))
//             if (join.length && join[0][2] < toOutside[0][1]) {
//                 let [k1, k2, dist] = join[0]
//                 let joinKey = g.windows.has(k1) ? k2 : k1

//                 let joinId = groups.keys().find((k) => groups.get(k).windows.has(joinKey))


//                 groups.get(joinId).edges.push([k1, k2, dist], ...g.edges)
//                 g.windows.values().forEach((gv) => groups.get(joinId).windows.add(gv))
//                 //console.log('merged', groups.get(groups.keys().find((k) => groups.get(k).windows.has(joinKey))))
//                 groups.delete(id)
//             } else {
//                 groups.get(id).isOutside = true
//                 groups.get(id).toOutside = toOutside[0]
//                 //console.log('not merged')
//                 // join to outside
//             }

//         }
//     } else {
//         let join = edgesCopy.filter(([p, n, d]) => (!g.windows.has(p) && g.windows.has(n) && grid.windows[p].toFrame) || (!g.windows.has(n) && g.windows.has(p) && grid.windows[n].toFrame))

//         //console.log('no outside', id, g, 'join is ', join.slice(0, 5))

//         if (join.length) {
//             let [k1, k2, dist] = join[0]
//             let joinKey = g.windows.has(k1) ? k2 : k1

//             let joinId = groups.keys().find((k) => groups.get(k).windows.has(joinKey))


//             groups.get(joinId).edges.push([k1, k2, dist], ...g.edges)
//             g.windows.values().forEach((gv) => groups.get(joinId).windows.add(gv))
//             //console.log('merged', groups.get(groups.keys().find((k) => groups.get(k).windows.has(joinKey))))
//             groups.delete(id)
//         } else {
//             //console.log('no outside', id, g)
//         }
//     }
// })

// groups.entries().forEach(([id, g]) => {
//     console.log('id is ', id, g.windows)
//     g.edges.forEach((e) => console.log(e))
// })


// let total = 0
// groups.entries().forEach(([id, g]) => {
//     if (g.toOutside) {
//         console.log(id, g.toOutside, g.edges)
//         let outSideVal = g.toOutside[0]
//         let subTotal = g.toOutside[1]
//         console.log('id is ', id, ' outside is ', g.toOutside)
//         g.edges.forEach(([p, n, d]) => {
//             if (p === outSideVal || n === outSideVal) {
//                 subTotal += d
//             } else if (pSeen.has(p) || pSeen.has(n)) {
//                 console.log('edge is ', [p, n, d], 'p is ', p, 'pseen ', pSeen.has(p), g.edges.filter((e) => e.includes(p)), grid?.windows[p]?.outside, ' n is ', n, 'pseen ', pSeen.has(n), g.edges.filter((e) => e.includes(n)), grid?.windows[n]?.outside)
//                 if (pSeen.has(p) && g.edges.filter((e) => e.includes(p)).length === 1) subTotal += grid.windows[p].outside
//                 if (pSeen.has(n) && g.edges.filter((e) => e.includes(n)).length === 1) subTotal += grid.windows[n].outside
//             } else {
//                 subTotal += d
//             }
//         })
//         console.log('subtotal is ', subTotal)
//         total += subTotal
//     } else {
//         let join = edgesCopy.filter(([p, n, d]) => (!g.windows.has(p) && g.windows.has(n) && grid.windows[p].toFrame) || (!g.windows.has(n) && g.windows.has(p) && grid.windows[n].toFrame))

//         console.log('post first loop no outside', id, g, 'join is ', join.slice(0, 5))

//         if (join.length) {
//             let subTotal = join[0][2]
//             g.edges.forEach(([p, n, d]) => subTotal += d)
//             console.log('subtotal is ', subTotal)
//             total += subTotal

//         } else {
//             console.log('some stupid edge case')
//         }
//     }



// })

// console.log('total is ', total)


// // //console.log(grid.windows.R)
// // const prims = (val, neighbours, seen) => {
// //     seen.add(val)
// //     //let seen = new Set([val])
// //     let pQueue = new Map(Array(maxConnections).fill().map((x, i) => [i + 1, []]))
// //     let tree = {}
// //     neighbours.forEach((n) => pQueue.get(n[2]).push(n))
// //     //console.log('val is ', val)

// //     while (seen.size < wLen) {
// //         let pqNext = pQueue.entries().find(([k, v]) => v.length)
// //         if (!pqNext) break;
// //         let [len, queue] = pqNext
// //         //let [len, queue] = pQueue.entries().find(([k, v]) => v.length)
// //         //console.log('len,queue', len, queue)
// //         while (queue.length) {
// //             let [prev, next, dist] = queue.shift()
// //             if (seen.has(next)) continue;
// //             if (!tree[prev]) tree[prev] = {}
// //             tree[prev][next] = dist
// //             seen.add(next)
// //             grid.windows[next].inside.forEach((n) => pQueue.get(n[2]).push(n))
// //         }
// //         //console.log('end ', 'tree ', tree, ' pQueue is ', pQueue)
// //     }

// //     return [tree, Object.values(tree).flatMap((x) => Object.values(x)).reduce((a, c) => a + c, 0)]
// // }

// // let primsQueue = Object.values(grid.windows).filter((w) => w.toFrame && w.inside.every(([p, n, d]) => d >= w.outside))

// // let pSeen = new Set(primsQueue.map((w) => w.val))
// // console.log(pSeen)

// // let minDist = {}



// // Object.values(grid.windows).filter((w) => w.toFrame).forEach((w) => {
// //     let m = prims(w.val, w.inside, new Set(pSeen))
// //     console.log(w.val, m[0])
// //     Object.entries(m[0]).forEach(([prev, obj]) => Object.entries(obj).forEach(([next, dist]) => {
// //         if (!minDist[next] || dist < Math.max(...minDist[next].map((g) => g[3]))) {
// //             minDist[next] = [[w.val, prev, next, dist]]
// //         } else if (dist === Math.max(...minDist[next].map((g) => g[3]))) {
// //             minDist[next].push([w.val, prev, next, dist])
// //         }
// //     }))


// //     // .flatMap(([k,v]) => Object.entries(v)).forEach(([k, v]) => {
// //     //     if (!minDist[k] || minDist[k] > v) {
// //     //         minDist[k] = v
// //     //     }
// //     // })
// // })

// // console.log(minDist)

// // // L 4
// // // Q 1
// // // S 6
// // // R 6
// // //

// // // Object.entries(grid.windows).forEach(([k, w]) => {
// // //     if (w.toFrame) {
// // //         console.log(w.val, prims(w.val, w.inside, new Set(pSeen)))
// // //     }
// // // })


// // // let ones = Object.values(grid.windows).flatMap((w) => {
// // //     //console.log('w is ', w, w.inside.has(1), w?.inside?.get(1), w?.inside?.get(1)?.size)

// // //     return w.inside.has(1) && w?.inside?.get(1)?.size ? [new Set([w.val]).union(w.inside.get(1))] : []
// // // })

// // // console.log(ones.flatMap((x, i, a) => a.some((y, yi) => x.symmetricDifference(y).size === 1) ? [[x, a.find((y, yi) => x.symmetricDifference(y).size === 1)]] : []))

// // // let toFrame = Object.values(grid.windows).flatMap((w)=>{
// // //     if(!toFrame) return []
// // //     return w.outside < 
// // // })


// // // console.log(Object.values(grid.windows).flatMap((w) => {
// // //     return w.inside.entries().flatMap(([k, v]) => v.length === 1 ? [[w.val, k]] : []).toArray()
// // // }))

// // //console.log(grid.windows.values().toArray())

// // //let seen = new Set()

// // // console.log(grid.windows.entries().reduce((a, [val, points]) => {
// // //     let outside = 0
// // //     let inside = 0
// // //     points.forEach((point) => {
// // //         if (point.isEdge) {
// // //             outside += (4 - point.neighbours.length)
// // //             inside += point.neighbours.filter(([nk, nv]) => nv !== val).length
// // //         }




// // //         //return acc + outside + inside
// // //     })

// // //     console.log('val is ', val, outside, ' outside ', inside, ' inside ')

// // //     seen.add(val)
// // //     return a + outside + inside
// // // }, 0))





// // // let inside = Map.groupBy(grid.windows.values().filter((points) => points.every((p) => p.neighbours.length === 4)), (a) => a[0].val)

// // // console.log(inside)