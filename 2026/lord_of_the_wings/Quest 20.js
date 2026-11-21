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

const isEqual = (str, partNo) => {
    let [e1, e2] = partNo === 1 ? str.split(' = ') : str.split(' = ').map((x) => toBase11(x))

    return eval(e1) === eval(e2)
}

const getSegments = (str) => !!str ? str.split('').reduce((a, c) => a + segments[c], 0) : 0

function* makeEqual(str) {
    let splitArr = str.split('')

    for (const [index, s] of splitArr.entries()) {
        if (!change[s] && !remove[s]) continue;
        if (change[s]) {
            for (const sub of change[s]) {
                yield splitArr.with(index, sub).join('')
            }
        }
        if (remove[s]) {
            for (const r of remove[s]) {
                let removed = splitArr.with(index, r)
                for (const [rIndex, rVal] of removed.entries()) {
                    if (rIndex === index || !add[rVal]) continue;

                    for (const addVal of add[rVal]) {
                        yield removed.with(rIndex, addVal).join('')
                    }
                }
            }
        }
    }
}

const solve = (input, partNo) => {
    let segments = input.split(/[\r\n]+/).flatMap((x) => isEqual(x, partNo) || (partNo === 3 && makeEqual(x).some((y) => isEqual(y, partNo))) ? [getSegments(x)] : []).reduce((a, c) => a + c, 0)

    return partNo === 1 ? segments : (segments).toString(11)
}

console.log(solve(input1, 1))
console.log(solve(input2, 2))
console.log(solve(input3, 3))