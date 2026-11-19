const { off } = require('cluster')
const fs = require('fs')
const [eventName, year, quest] = ['lord_of_the_wings', 2026, 18]
const filePath = `../../inputs/everybody_codes/${year}/${eventName}/quest${quest}`
const [input1, input2, input3] = [1, 2, 3].map((partNo) => fs.readFileSync(`${filePath}_${partNo}.txt`, { encoding: 'utf8', flag: 'a+' }))

const solve = (input, partNo) => {
    let lines = input.split(/[\r\n]+/).map((x) => x.match(/\d+/g).map(Number))

    if (partNo === 1) lines = lines.map((x) => x.concat(1))

    let stacks = lines.flatMap(([x, y, w], i, a) => a[i + 1] && a[i + 1][0] > (x + w) ? [[x, y, w], [x + w, 0, a[i + 1][0] - (x + w)]] : [[x, y, w]])

    let len = stacks.length, rMax = 0, rMaxima = Array(len).fill(0).map((x) => x)

    for (j = len - 1; j >= 0; j--) {
        if (stacks[j][1] > rMax) {
            rMax = stacks[j][1]
        }
        rMaxima[j] = rMax
    }

    let lMax = 0, total = 0

    stacks.forEach(([x, y, w], i) => {
        if (y > lMax) {
            lMax = y
        } else if (y < lMax && y < rMaxima[i]) {
            total += (w * (Math.min(lMax, rMaxima[i]) - y))
        }
        total += (w * y)
    })

    return total
}

console.log(solve(input1, 1))
console.log(solve(input2, 2))
console.log(solve(input3, 3))