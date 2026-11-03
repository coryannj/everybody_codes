const fs = require('fs')
const year = '2026'
const eventName = 'lord_of_the_wings'
const quest = 7
const filePath = `../../inputs/everybody_codes/${year}/${eventName}/quest${quest}_`

const [input1, input2, input3] = [1, 2, 3].map((partNo) => fs.readFileSync(`${filePath}${partNo}.txt`, {encoding: 'utf8', flag: 'a+'}))

console.log(input1, input2, input3)
//lines = input1.split(/[\r\n]+/).map((x) => x.split(/[:,]/g))
