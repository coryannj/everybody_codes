const { off } = require('cluster')
const fs = require('fs')
const [eventName, year, quest] = ['lord_of_the_wings', 2026, 19]
const filePath = `../../inputs/everybody_codes/${year}/${eventName}/quest${quest}`
const [input1, input2, input3] = [1, 2, 3].map((partNo) => fs.readFileSync(`${filePath}_${partNo}.txt`, { encoding: 'utf8', flag: 'a+' }))

const mix = { CC: 'C', CM: 'B', CY: 'G', CK: 'K', MC: 'B', MM: 'M', MY: 'R', MK: 'K', YC: 'G', YM: 'R', YY: 'Y', YK: 'K', KC: 'K', KM: 'K', KY: 'K', KK: 'K' }

const counts = (arr) => {
    let thisCounts = arr.reduce((a, c) => { return a[c] ? a[c]++ : a[c] = 1, a }, {})
    return Object.entries(thisCounts).sort((a, b) => b[1] - a[1])
}

const parse = (input, partNo) => {
    return partNo < 3 ? input.split(/[\r\n]{2}/).map((x) => x.split(/[\r\n]+/).map((y) => y.split(''))) : input.split(/[\r\n]+/).map((x) => x.split(''))
}

const solveP1 = (input) => {
    let [g1, g2] = parse(input, 1)
    return counts(g1.flatMap((row, rowInd) => row.flatMap((val, colInd) => [mix[`${val}${g2[rowInd][colInd]}`]]))).slice(0, 3).reduce((a, c) => a * c[1], 1)
}

// Only works if K is highest val in initial count, and possibly omitting other weird edge cases... can't be bothered generalising! XD
const solveP2 = (input) => {
    let [g1, g2] = parse(input, 2), p2Counts = counts(g1.flatMap((row, rowInd) => row.flatMap((val, colInd) => val === 'K' ? [val] : [`${g2[rowInd][colInd]}_${val}`]))).reverse()

    let [_, kVal] = p2Counts.pop()

    let subCounts = p2Counts.reduce((a, c) => { return a[c[0][0]] ? a[c[0][0]] += c[1] : a[c[0][0]] = c[1], a }, {}) // Counts per number

    let minVal = Math.min(...Object.values(subCounts)), minNums = Object.keys(subCounts).filter((k) => subCounts[k] === minVal)

    if (minNums.length === 1) p2Counts = p2Counts.filter(([k, v]) => k[0] !== minNums[0])

    let aggCounts = Object.entries(p2Counts.reduce((sMap, [k, v]) => {
        if (!sMap[k[0]].length || v > sMap[k[0]].at(-1)[0]) {
            sMap[k[0]].push([v, [k.at(-1)]])
        } else {
            sMap[k[0]].at(-1)[1].push(k.at(-1))
        }
        return sMap
    }, { 1: [], 2: [], 3: [], 4: [] })).flatMap(([k, v]) => v.map((x) => [k].concat(x))).sort((a, b) => a[1] - b[1])

    let subSeen = new Set(), subMap = {} // Make the substitution map

    while (subSeen.size < 6) {
        let [id, count, colours] = aggCounts.find(([id2, count2, colours2], i, a) => !subSeen.has(id2) && colours2.filter((c) => !subSeen.has(c)).length === 1)
        colour = colours.filter((v) => !subSeen.has(v))[0]
        subSeen.add(id)
        subSeen.add(colour)
        subMap[id] = colour
    }

    let minNum = minNums.length === 1 ? minNums[0] : ['1', '2', '3', '4'].find((k) => !subMap[k])

    if (minNums.length > 1) p2Counts = p2Counts.filter(([k, v]) => k[0] !== minNum)

    return Object.values(p2Counts.map(([k, v]) => [mix[`${subMap[k[0]]}${k.at(-1)}`], v]).reduce((a, [k, v]) => { return a[k] ? a[k] += v : a[k] = v, a }, {})).sort((a, b) => b - a).slice(0, 2).concat(kVal + minVal).reduce((a, c) => a * c, 1)
}

const solveP3 = (input) => {
    let g1 = parse(input, 3), highest, p3Counts = counts(g1.flat()).sort((a, b) => b[1] - a[1])

    if (p3Counts.at(-1)[0] === 'K' && p3Counts.at(-2)[1] > p3Counts.at(-1)[1]) { // K is min
        let subTotal = p3Counts.slice(0, -1).reduce((a, c) => a + c[1], 0)
        let div = Math.floor(subTotal / 3)
        let rem = subTotal % 3
        highest = Array(3).fill(div).map((x, i) => x + (i < rem))
    } else { // K is not min, need to distribute some val
        let [_, kVal] = p3Counts.find(([k, v]) => k === 'K')
        let [[k1, a], [k2, b], [k3, c]] = p3Counts.filter(([k, v]) => k !== 'K')

        if (b < a) {
            if (c <= a - b) {
                b += c
            } else {
                b = a
                let diff = Math.floor(c / 2)
                let rem = c % 2
                a += (diff + rem)
                b += diff
            }
        } else {
            let diff = Math.floor(c / 2)
            let rem = c % 2
            a += (diff + rem)
            b += diff
        }

        highest = [a, b, kVal]
    }
    return highest.reduce((a, c) => a * c, 1)
}

console.log(solveP1(input1))
console.log(solveP2(input2))
console.log(solveP3(input3))

