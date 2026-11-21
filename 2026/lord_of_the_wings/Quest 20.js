const { off } = require('cluster')
const fs = require('fs')
const [eventName, year, quest] = ['lord_of_the_wings', 2026, 20]
const filePath = `../../inputs/everybody_codes/${year}/${eventName}/quest${quest}`
const [input1, input2, input3] = [1, 2, 3].map((partNo) => fs.readFileSync(`${filePath}_${partNo}.txt`, { encoding: 'utf8', flag: 'a+' }))

const segments = { 0: 6, 1: 2, 2: 5, 3: 5, 4: 4, 5: 5, 6: 6, 7: 3, 8: 7, 9: 6, '+': 2, '-': 1, '=': 2, A: 6, ' ': 0 }

const remove = {
    '+': ['-'],
    '6': ['5'],
    '7': ['1'],
    '8': ['6', '9', '0', 'A'],
    '9': ['3', '5']
}

const add = {
    '-': ['+'],
    '0': ['8'],
    '1': ['7'],
    '3': ['9'],
    '5': ['6', '9'],
    '6': ['8'],
    'A': ['8'],
    '9': ['8'],
}

const change = {
    '2': ['3'],
    '5': ['3'],
    '3': ['2', '5'],
    '0': ['9', 'A', '6'],
    '9': ['0', '6', 'A'],
    'A': ['0', '6', '9'],
    '6': ['9', 'A', '0']
}

const toBase11 = (str) => str.toString().replaceAll(/\w+/g, m => parseInt(m, 11))

const isEqual = (str, partNo) => partNo === 1 ? eval(str) : eval(toBase11(str))

const getSegments = (str) => !!str ? str.split('').reduce((a, c) => a + segments[c], 0) - 4 : 0

function* makeEqual(str) {
    for (const [index, s] of Array.prototype.entries.call(str)) {
        if (!change[s] && !remove[s]) continue;
        if (change[s]) {
            for (const sub of change[s]) {
                yield str.slice(0, index) + sub + str.slice(index + 1)
            }
        }
        if (remove[s]) {
            for (const r of remove[s]) {
                for (const [rIndex, rVal] of Array.prototype.entries.call(str)) {
                    if (rIndex === index || !add[rVal]) continue;

                    for (const addVal of add[rVal]) {
                        if (rIndex < index) {
                            yield str.slice(0, rIndex) + addVal + str.slice(rIndex + 1, index) + r + str.slice(index + 1)
                        } else {
                            yield str.slice(0, index) + r + str.slice(index + 1, rIndex) + addVal + str.slice(rIndex + 1)
                        }
                    }
                }
            }
        }
    }
}

const solve = (input, partNo) => {
    let segments = input.replaceAll('=', '===').split(/[\r\n]+/).flatMap((x) => isEqual(x, partNo) || (partNo === 3 && makeEqual(x).some((y) => isEqual(y, partNo))) ? [getSegments(x)] : []).reduce((a, c) => a + c, 0)

    return partNo === 1 ? segments : (segments).toString(11)
}

console.log(solve(input1, 1))
console.log(solve(input2, 2))
console.log(solve(input3, 3))