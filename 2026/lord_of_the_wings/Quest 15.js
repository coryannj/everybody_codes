const { off } = require('cluster')
const fs = require('fs')
const [eventName, year, quest] = ['lord_of_the_wings', 2026, 15]
const filePath = `../../inputs/everybody_codes/${year}/${eventName}/quest${quest}`
const [input1, input2, input3] = [1, 2, 3].map((partNo) => fs.readFileSync(`${filePath}_${partNo}.txt`, { encoding: 'utf8', flag: 'a+' }))

class Path {
    constructor(id, c1, c2, time, section, sCount) {
        this.id = id
        this.col1 = c1
        this.col2 = c2
        this.cols = [c1, c2]
        this.time = time
        this.section = section
        this.sulphur = sCount
        this.gatherRate = Math.floor(sCount / time * 100)
    }
}

const solve = (input, partNo) => {
    let lines = input1.split(/[\r\n]+/)

    let sectionCols = [...lines[1].matchAll(/([#]+)/g)].flatMap((x, i, a) => i === 0 ? [x.index + 1] : [x.index - 1, x.index + x[0].length]).reduce((a, c) => { return a.at(-1).length < 2 ? a[a.length - 1].push(c) : a.push([c]), a }, [[]])

    let endCol = sectionCols.pop()[0] - 1, midLine = lines.findIndex((r) => r.includes('S')), pId = 0, sulphurSections = []

    let sulphur = lines.flatMap((row, rowInd) => [...row.matchAll(/([@])/g)].map((y) => [rowInd, y.index, 'section', sectionCols.findIndex((sec) => sec[0] <= y.index && y.index <= sec[1]), y[0], y[0].length]))

    let paths = sectionCols.flatMap(([c1, c2], i, a) => {
        let topRow = 1, bottomRow = lines.length - 2, result = [], sLen = 0
        for (j = 0; j <= 2; j++) {
            //above midline
            let aSulphur = sulphur.filter(([r, c, _, s, v, v2]) => s === i && (r === topRow || (r < midLine && (c === c1 || c === c2))))
            if (aSulphur.length) {
                result.push(new Path(pId++, c1, c2, (midLine - topRow) * 2 + (c2 - c1), i, aSulphur.length))
                sLen += aSulphur.length
            }
            // below midline
            let bSulphur = sulphur.filter(([r, c, _, s, v, v2]) => s === i && (r === bottomRow || (r > midLine && (c === c1 || c === c2))))
            if (bSulphur.length) {
                result.push(new Path(pId++, c1, c2, (bottomRow - midLine) * 2 + (c2 - c1), i, bSulphur.length))
                sLen += bSulphur.length
            }
            topRow += 2
            bottomRow -= 2
            c1 += (2 + i)
            c2 -= (2 + i)
        }
        sulphurSections.push(sLen)
        return result
    })

    console.log(paths)
    console.log(sulphurSections)

    const collect = (total, p) => {
        let result = Array(total + 1).fill().map((x, i) => i === 0 ? [...p] : [])
        for (const [i, arr] of result) {
            if (!arr.length) continue
        }


    }


    // Array(3).fill(x).flatMap(([x1, x2], xi) => [[i, 1 + (2 * xi), x1 + (xi * (i + 2)), x2 - (xi * (i + 2))], [i, l.length - 2 - (2 * xi), x1 + (xi * (i + 2)), x2 - (xi * (i + 2))]]))

}
console.log(solve(input1, 1))

// [
//   [ 0, 1, 1, 11 ],  [ 0, 13, 1, 11 ],
//   [ 0, 3, 3, 9 ],   [ 0, 11, 3, 9 ],
//   [ 0, 5, 5, 7 ],   [ 0, 9, 5, 7 ],
//   [ 1, 1, 13, 28 ], [ 1, 13, 13, 28 ],
//   [ 1, 3, 16, 25 ], [ 1, 11, 16, 25 ],
//   [ 1, 5, 19, 22 ], [ 1, 9, 19, 22 ],
//   [ 2, 1, 30, 50 ], [ 2, 13, 30, 50 ],
//   [ 2, 3, 34, 46 ], [ 2, 11, 34, 46 ],
//   [ 2, 5, 38, 42 ], [ 2, 9, 38, 42 ]
// ]

const solve = (input, partNo) => {
    let lines = input1.split(/[\r\n]+/).map((x) => x.split(''))
    let sections = [...lines[1].join('').matchAll(/([#]+)/g)].map((x, i) => i === 0 ? 0 : x.index + x[0].length - 1).map((x, i, a) => [x, a[i + 1]]).slice(0, -1)
    console.log('sections is ', sections)
    //return []
    // Make points
    const getNeighbours = (r, c) => [[r - 1, c, 'U'], [r + 1, c, 'D'], [r, c - 1, 'L'], [r, c + 1, 'R']].flatMap(([nr, nc, nd]) => lines?.[nr]?.[nc] && lines?.[nr]?.[nc] !== '#' ? [nd] : []).join('')
    const cornerDirs = new Set(['UL', 'UR', 'DL', 'DR'])
    const isCorner = (neighbours) => cornerDirs.has(neighbours)

    let points = []

    lines.forEach((row, rowInd) => {
        row.forEach((val, colInd) => {
            if (val !== '#') {
                let key = `${rowInd}_${colInd}`
                let s = sections.flatMap(([s, e], i) => s <= colInd && colInd <= e ? [i] : [])
                let n = isCorner(getNeighbours(rowInd, colInd))
                points.push(new Point(key, rowInd, colInd, val, s, n))
            }
        })
    })
    console.log(points.filter((p) => p.isCorner))
    return []
    // Get sulphur locations
    let sulphurList = points.filter((p) => p.val === '@')
    let sulphurLen = sulphurList.length
    let sulphurSections = Array(sections.length).fill().map((x, i) => sulphurList.filter((s) => s.sections[0] === i).length).map((sum = 0, v => sum += v))
    console.log('sulphursections is ', sulphurSections)

    // Make paths
    let midline = points.find((p) => p.col === 0).row
    let pathId = 0
    let paths = Map.groupBy(points.filter((p) => p.isCorner), ({ row, sections }) => `${sections[0]}_${row}`).entries().flatMap(([key, [v1, v2]]) => {
        let col1 = v1.col, col2 = v2.col
        let [pSection, pRow] = key.split('_').map(Number)
        let pathSulphur = sulphurList.filter((s) => s.sections.includes(pSection) && ((s.row === pRow && col1 <= s.col && s.col <= col2) || ((s.col === col1 || s.col === col2) && Math.min(pRow, midline) < s.row && s.row < Math.max(pRow, midline))))

        if (!pathSulphur.length) return []

        let pathTime = (col2 - col1) + (Math.abs(pRow - midline) * 2)
        return [new Path(pathId++, col1, col2, pathTime, pSection, pathSulphur.length)]
    }).toArray()

    let startCol = 0, endCol = sections.at(-1)[1], totalTime = paths.reduce((a, c) => a + c.time, 0), maxGather = Math.max(...paths.map((p) => p.gatherRate))

    let baseMap = new Map(Array(maxGather + 1).fill().map((x, i) => [maxGather - i, []]))
    let baseSeen = Object.fromEntries(paths.map((p) => [p.id, 0]))

    //const getRate = ()

    const nextState = (target, repeatsAllowed, [t1, firstCol, lastCol, sulphur1, seen, id1, currRate], { id2, col1, col2, cols, time, section, sulphur2, rate }) => {
        if (!repeatsAllowed && seen.has(id)) return []
        //if (collected > target) return []
        //let newSeen = structuredClone(seen)
        //newSeen = { ...seen }
        let newSeen = new Set(seen)
        //newSeen[id]++
        newSeen.add(id)
        let newTotal = collected + sulphur
        if (lastCol < col1) {
            let newTime = t1 + time + Math.abs(col1 - lastCol)
            return [[newTime, firstCol, col2, newTotal, newSeen, Math.floor(newTotal / newTime * 1000)]]
        } else if (lastCol > col2) {
            let newTime = t1 + time + Math.abs(lastCol - col2)
            return [[newTime, firstCol, col1, newTotal, newSeen, Math.floor(newTotal / newTime * 1000)]]
        } else if (lastCol === col2) {
            let newTime = t1 + time + Math.abs(col2 - col1)
            return [[newTime, firstCol, col2, newTotal, newSeen, Math.floor(newTotal / newTime * 1000)]]
        } else if (lastCol === col1) {
            let newTime = t1 + time + Math.abs(col2 - col1)
            return [[newTime, firstCol, col1, newTotal, newSeen, Math.floor(newTotal / newTime * 1000)]]
        }
        let newTime1 = t1 + time + Math.abs(col1 - lastCol)
        let newTime2 = t1 + time + Math.abs(lastCol - col2)
        return [
            [newTime1, firstCol, col2, newTotal, newSeen, Math.floor(newTotal / newTime1 * 1000)],
            [newTime2, firstCol, col1, newTotal, newSeen, Math.floor(newTotal / newTime2 * 1000)]]
    }





    //console.log('startqueue,basemap', startQueue, baseMap)
    //[t1, firstCol, lastCol, collected, seen, currRate],
    const bfs = (queue, paths, target, exact = false) => {
        let rounds = 0
        let takeVal = 3
        let states = {}
        while (!queue.values().find((arr) => arr.length).some((state) => state[3] >= target)) {
            //console.log('               ')
            //console.log('test flatMap', new Map(queue).values().flatMap((arr) => arr.flatMap((state) => paths.flatMap((p) => nextState(state, p)))).toArray())
            rounds++
            let subRounds = 0
            //let localMaxRate = -1
            queue = queue.values().filter((arr) => arr.length).take(takeVal).flatMap((arr) => arr.flatMap((state) => paths.flatMap((p) => nextState(target, state, p)))).reduce((newQueue, newState) => {
                //console.log('newQueue is ', newQueue)
                //console.log('newState is ', newState)
                //let curr = newQueue.get(newState.at(-1))
                let stateKey = `${newState[2]}_${newState.at(-1)}`

                if ((!exact || exact && newState[3] <= target) && (!states[stateKey] || states[stateKey] < newState[3])) {
                    states[stateKey] = newState[3]
                    newQueue.get(newState.at(-1)).push(newState)
                    subRounds++
                }

                // if ((!exact || exact && newState[3] <= target) && (curr.length === 0 || !curr.some((ns) => ns[4].symmetricDifference(newState[4]).size === 0 && ns[0] <= newState[0]))) {
                //     newQueue.get(newState.at(-1)).push(newState)
                //     subRounds++
                //     if (takeVal < 3) localMaxRate = newState.at(-1)
                // }
                // if ((!exact || exact && newState[3] <= target) && (curr.length === 0 || !curr.some((ns) =>
                //     ns[3] >= newState[3] &&
                //     new Set(Object.keys(ns[4]).filter((k) => ns[4][k] > 0)).symmetricDifference(new Set(Object.keys(newState[4]).filter((k) => newState[4][k] > 0))).size === 0 && ns[0] <= newState[0]))) {
                //     newQueue.get(newState.at(-1)).push(newState)
                //     subRounds++
                // }

                return newQueue
            }, structuredClone(baseMap))
            //console.log('post loop queue is ', queue)
            if (rounds % 10 === 0) {
                console.log('rounds is ', rounds, ' last queue len is ', subRounds, 'queue size', queue.entries().flatMap(([k, v]) => v.length ? [[k, v.length]] : []).toArray())
                console.log('max is ', new Set(queue.values().filter((arr) => arr.length).flatMap((arr) => arr.map((state) => state[3]))))
                console.log(queue.values().find((arr) => arr.length).map((a) => a[4]).reduce((a, c) => {
                    return !a.length || c.difference(a.at(-1)).size > 0 ? a.concat(c) : a


                }, []))
            }
            if (subRounds > 500) takeVal = 1
            //if (queue.values().every((arr) => !arr.length)) break;
            //break;
        }
        return queue
    }

    let startQueue = structuredClone(baseMap)

    if (partNo === 1) {
        startQueue.get(0).push([0, 0, 0, 0, new Set(), 0])
        //startQueue.get(0).push([0, 0, 0, 0, structuredClone(baseSeen), 0])
        let collect = Map.groupBy(paths, ({ section }) => section).entries().reduce((queue, [sInd, paths]) => {
            let target = sulphurSections[sInd]
            return bfs(queue, paths, target, true)
        }, startQueue).values().filter((v) => v.length).toArray().flat().sort((a, b) => a[3] - b[3])[0]

        return collect[0] + (endCol - collect[2])
    }

    if (partNo === 2) {
        console.log(paths)
        let fastest = paths.toSorted((a, b) => b.gatherRate - a.gatherRate)[0]
        console.log('fastest is ', fastest)
        let offset = Math.max(...paths.map((p) => p.sulphur)) * 10
        let fullRounds = Math.floor((2026 - offset) / fastest.sulphur)
        let sCollected = fullRounds * fastest.sulphur
        let sRemain = 2026 - sCollected
        let sTime = fastest.col1 + (fullRounds * fastest.time) + ((fullRounds - 1) * (fastest.col2 - fastest.col1))
        console.log('fullRounds', fullRounds, 'offset', offset, 'collected', sCollected, ' stime', sTime, 'srem', sRemain)
        //startQueue.get(fastest.gatherRate).push([sTime, 0, fastest.col2, sCollected, new Set(), 0])
        //startQueue.get(0).push([0, fastest.col1, fastest.col1, 0, new Set(), 0])
        //startQueue.get(0).push([0, fastest.col2, fastest.col2, 0, new Set(), 0])
        startQueue.get(0).push([0, 0, 0, 0, new Set(), 0])
        //[t1, firstCol, lastCol, collected, seen, currRate],

        let collect = bfs(startQueue, paths, 2026, false).values().filter((v) => v.length).toArray().flat().filter((ns) => ns[3] >= sRemain).sort((a, b) => a[0] - b[0])

        //.filter((ns) => ns[3] >= 2026)
        console.log(collect.slice(0, 50))
        console.log('endcol is ', endCol)
        return collect[0][0] + (endCol - collect[0][2]) + sTime
    }


    //.slice(0, 10))
    //console.log('endCol is ', endCol)

    //console.log(paths)

    //console.log([0, 0, 0, 0, new Set(), 0], paths[0], nextState([0, 0, 0, 0, new Set(), 0], paths[0]))
    // let collect = Map.groupBy(paths, ({ section }) => section).entries().reduce((queue, [sInd, paths]) => {
    //     //let sulphurInSection = sulphurList.filter((s) => s.sections.includes(sInd))
    //     let target = sulphurSections[sInd]
    //     console.log('sectionInd is ', sInd, ' sulphur to collect ', target, 'queue is ', queue)
    //     return bfs(queue, paths, target, true)


    // }, startQueue)

    // let result = collect.values().filter((v) => v.length).toArray().flat().sort((a, b) => a[0] - b[0])
    // result.slice(0, 10).forEach((x) => console.log(x))
    // console.log('sulphurSections', sulphurSections, ' sulphurLen', sulphurLen, 'result len is ', result.length)
    // console.log('endCol is ', endCol)
    // console.log('paths len is ', paths.length, 'pId is ', pathId)
    //Map.groupBy(paths, ({ section }) => section).reduce


    //const bfs = ()

    // const collectSection = (queue, sInd) => {
    //     let 

    // }


    //let start = new State()
    //console.log(start)



}

// let t1 = performance.now()
solve(input1, 1)
// let t2 = performance.now()
// console.log(t2 - t1)

// console.log(solve(input1, 1))
console.log(solve(input2, 2))
//console.log(2022/24329*1000)
console.log(204 + 24197)
console.log(193 + (93 - 25))

//   [
//     5466,
//     0,
//     46,
//     2027,
//     {
//       '0': 0,
//       '1': 0,
//       '2': 2,
//       '3': 673,
//       '4': 0,
//       '5': 0,
//       '6': 0,
//       '7': 0
//     },
//     37
//   ],
//   [
//     4146,0,46,2027,
//     {
//       '0': 0,
//       '1': 0,
//       '2': 5,
//       '3': 669,
//       '4': 0,
//       '5': 0,
//       '6': 0,
//       '7': 0
//     },
//     48
//   ]

//   Path {
//     id: 2,
//     col1: 34,
//     col2: 46,
//     cols: [ 34, 46 ],
//     time: 20,
//     section: 2,
//     sulphur: 4,
//     gatherRate: 20
//   },
//   Path {
//     id: 3,
//     col1: 5,
//     col2: 7,
//     cols: [ 5, 7 ],
//     time: 6,
//     section: 0,
//     sulphur: 3,
//     gatherRate: 50
//   },
console.log(670 * 6 + 4 * 20)
console.log(670 * 6 + 669 * 2 + 4 * 20 + 3 * 12)
console.log(670 * 3 + 4 * 4)








// console.log(paths.length)
// console.log(paths)



//Part 1
let combos = sections.flatMap((x, i) => paths.some((p) => p.section === i) ? [paths.flatMap((p) => p.section === i ? [p.cols] : [])] : []).map((x) => permute(x).flatMap((p) => cartesian(...p.map((y) => [y, y.toReversed()]))).toArray())

const collect = (arr) => arr.reduce(([time, lastCol], [c1, c2]) => [time + Math.abs(c1 - lastCol), c2], arr.shift())

let p1Min = Infinity

for (const c of cartesian(...combos)) {
    let [t, lastCol] = collect(c.flat())

    if (t + Math.abs(lastCol - endCol) < p1Min) {
        console.log('new min', [t, lastCol], t + Math.abs(lastCol - endCol))
        p1Min = t + Math.abs(lastCol - endCol)
    }
}

console.log(totalPaths + p1Min)





let collectCount = 202620262026
paths.forEach((p) => {
    console.log('                   ')
    console.log('p is ', p)
    console.log('sLen', p.sulphur.length, 'sulfur/s', p.sulphur.length / (p.seconds + (p.cols[1] - p.cols[0])))
    let fullLoops = Math.floor(collectCount / p.sulphur.length)
    let fTime = p.cols[0] + (fullLoops * p.seconds) + ((fullLoops - 1) * (p.cols[1] - p.cols[0])) + (endCol - p.cols[1])
    console.log('fullLoops', fullLoops, 'fullLoopsTime', fTime)
})


// console.log(p, p.sulphur.length, p.sulphur.length / (p.seconds + (p.cols[1] - p.cols[0]))), 'fullLoops', Math.floor(collectCount / p.sulphur.length), ' fullLoops time', p.cols[0] + (Math.floor(collectCount / p.sulphur.length) * p.seconds) + ((Math.floor(collectCount / p.sulphur.length) * p.seconds) - 1) * (p.cols[1] - p.cols[0]))


let e = paths.toSorted((p1, p2) => {
    let s1 = p1.sulphur.length / (p1.seconds + (p1.cols[1] - p1.cols[0]))
    let s2 = p2.sulphur.length / (p2.seconds + (p2.cols[1] - p2.cols[0]))
    return s2 - s1
})[0]
console.log('most efficient path is ', e)
let toEnd = endCol - e.cols[1]
console.log('toEnd', toEnd, toEnd + e.seconds + e.cols[1] - e.cols[0])
let p2endCol = e.cols[1]
let sPerLoop = e.sulphur.length
let loopTime = e.seconds + (e.cols[1] - e.cols[0])

// let collectCount = 2026 

let fullLoops = Math.floor(collectCount / sPerLoop)
let rem = collectCount % sPerLoop
console.log('fullloops', fullLoops, 'rem is ', rem, 'sperloop', sPerLoop, 'time per loop is ', loopTime)

let remTime = Math.abs(e.cols[0] - p2endCol) + e.seconds + Math.abs(e.cols[1] - endCol)

// let remTime = rem > 0 ? Math.abs(e.cols[0] - p2endCol) + e.seconds + Math.abs(e.cols[1] - endCol) : 0

console.log(remTime)

paths.forEach((p, i) => {
    if (p.sulphur.length >= sPerLoop + rem) {
        let thisRemTime = Math.abs(p.cols[0] - p2endCol) + p.seconds + Math.abs(p.cols[1] - endCol)

        let loopsToRemove = Math.floor((p.sulphur.length - rem) / sPerLoop)
        console.log('                       ')
        console.log(i, 'can collect ', p.sulphur.length, ' and take ', Math.abs(p.cols[0] - p2endCol), ' + ', p.seconds, ' + ', Math.abs(p.cols[1] - endCol), ' = ', Math.abs(p.cols[0] - p2endCol) + p.seconds + Math.abs(p.cols[1] - endCol), ' eLoop time', loopTime * p.sulphur.length + toEnd)
        //console.log()
        //fullLoops--
        //rem += sPerLoop
        //remTime = thisRemTime
        console.log('can remove loop', thisRemTime, loopsToRemove, 'new rem is ', rem, p.sulphur, p.cols)

    }

    // else if (p.sulphur.length >= rem) {
    //     let thisRemTime = Math.abs(p.cols[0] - p2endCol) + p.seconds + Math.abs(p.cols[1] - endCol)
    //     console.log(i, 'can collect ', p.sulphur.length, ' and take ', Math.abs(p.cols[0] - p2endCol), ' + ', p.seconds, ' + ', Math.abs(p.cols[1] - endCol), ' = ', Math.abs(p.cols[0] - p2endCol) + p.seconds + Math.abs(p.cols[1] - endCol))
    //     if (thisRemTime < remTime) {

    //         remTime = thisRemTime
    //         console.log('new min', remTime)
    //     }
    // }


})

//fullLoops--
//fullLoops -= 1
let fullLoopsTime = e.cols[0] + (e.seconds * fullLoops) + ((e.cols[1] - e.cols[0]) * (fullLoops - 1))

console.log('fullloopstime', fullLoopsTime, fullLoopsTime + toEnd)
console.log('start to loop', e.cols[0], 'full loops', (e.seconds * fullLoops), 'back to start', ((e.cols[1] - e.cols[0]) * (fullLoops - 1)), ' toend', toEnd)
console.log(5395 + 53)
console.log(24341 + 80)
console.log(32379 + 90)
//24365

console.log(202620262026 / 3, 202620262026 % 3)
//223580978853
//223580978825
console.log(202620262026 / 58)
console.log(202620262026 % 58)
console.log(61 + (3493452793 * 64) + (93 - 81))

// p is  Path {
//   cols: [ 61, 81 ],
//   score: 1.5391393992075615e+113,
//   seconds: 32,
//   section: 2,
//   sulphur: [
//     '12_61', '12_81', '13_61',
//     '13_81', '14_61', '15_61',
//     '15_81', '16_61', '16_81',
//     '17_61', '17_62', '17_63',
//     '17_64', '17_65', '17_66',
//     '17_67', '17_68', '17_69',
//     '17_70', '17_71', '17_72',
//     '17_73', '17_74', '17_75',
//     '17_76', '17_77', '17_79',
//     '17_80', '17_81'
//   ]
// }

// p is  Path {
//   cols: [ 61, 81 ],
//   score: 5.5604896453859e+67,
//   seconds: 32,
//   section: 2,
//   sulphur: [
//     '5_61',  '5_63', '5_64', '5_65',
//     '5_66',  '5_68', '5_69', '5_70',
//     '5_71',  '5_72', '5_73', '5_74',
//     '5_75',  '5_76', '5_77', '5_78',
//     '5_79',  '5_80', '5_81', '6_61',
//     '6_81',  '7_61', '7_81', '8_61',
//     '8_81',  '9_61', '9_81', '10_61',
//     '10_81'
//   ]
// }