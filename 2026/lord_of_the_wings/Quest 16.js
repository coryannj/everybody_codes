const { off } = require('cluster')
const fs = require('fs')
const [eventName, year, quest] = ['lord_of_the_wings', 2026, 16]
const filePath = `../../inputs/everybody_codes/${year}/${eventName}/quest${quest}`
const [input1, input2, input3] = [1, 2, 3].map((partNo) => fs.readFileSync(`${filePath}_${partNo}.txt`, { encoding: 'utf8', flag: 'a+' }))

function solve(input, partNo) {
    let rep = partNo === 1 ? 1 : partNo === 2 ? 10 : 100
    let tablets = input.repeat(rep)
    let tFlips = 0
    let flips = 0
    let loops = partNo === 1 ? 2 : 3

    for (i = 0; i < loops; i++) {
        let val = tablets[0]
        let ind = 0

        while (tablets[ind + 1] === val) {
            ind++
        }

        let tLen = tablets.length - (ind + 1)

        let matchRegex = new RegExp(`([${val}]+)`, 'g')

        let splitRegex = new RegExp(`[${val}]+`, 'g')
        let t1 = performance.now()
        let matchArr = tablets.slice(ind + 1).matchAll(matchRegex).map((x) => x[0].length).toArray()
        let t2 = performance.now()
        let splitArr = tablets.slice(ind + 1).split(splitRegex)
        let t3 = performance.now()
        let splitLengths = splitArr.map((x) => x.length)
        let t4 = performance.now()
        let matchLen = matchArr.length
        let splitLen = splitLengths.length
        flips += matchLen
        console.log('matchregex', t2 - t1, 'splitregex', t3 - t2, ' split len', t4 - t3)
        // Get the flip lengths
        let leftMatchInd = 0
        let rightMatchInd = matchLen - 1
        let leftSplitInd = 0
        let rightSplitInd = splitLen - 1

        while (rightSplitInd > leftSplitInd) {
            tLen -= splitLengths[rightSplitInd]
            tFlips += tLen
            tLen -= matchArr[rightMatchInd]
            rightSplitInd--
            rightMatchInd--

            tLen -= splitLengths[leftSplitInd]
            tFlips += tLen
            tLen -= matchArr[leftMatchInd]

            leftMatchInd++
            leftSplitInd++
        }
        let t5 = performance.now()

        // Do the flips
        let midInd = Math.floor(splitLen / 2)
        let valArr = splitLen % 2 ? [splitArr[midInd]] : []
        let lValInd = midInd - 1
        let rValInd = splitLen % 2 ? midInd + 1 : midInd

        while (lValInd >= 0) {
            valArr.push(...splitArr[lValInd].split('').reverse())
            valArr.push(splitArr[rValInd])
            rValInd++
            lValInd--
        }
        let t6 = performance.now()
        console.log('flip lengths', t5 - t4)
        console.log('flip vals', t6 - t5)
        tablets = valArr.join('')
    }

    return partNo === 1 ? flips : tFlips
}

//console.log(solve(input1, 1))
//console.log(solve(input2, 2))
console.log(solve(input3, 3))

