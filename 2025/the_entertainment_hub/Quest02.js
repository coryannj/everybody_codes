const fs = require('fs');
const input1 = fs.readFileSync('../../inputs/everybody_codes/2025/the_entertainment_hub/quest2_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../../inputs/everybody_codes/2025/the_entertainment_hub/quest2_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../../inputs/everybody_codes/2025/the_entertainment_hub/quest2_3.txt',{ encoding: 'utf8', flag: 'r' });

const bolts = ['R','G','B']

const p1 = (input) => {
    let balloons = input.split('')
    let count = 0
    
    while(balloons.length>0){
        let bolt = bolts[count % 3]
        count++
        
        while(balloons[0]===bolt) balloons.shift()
        
        balloons.shift()
    } 

    return count
}

console.log('Part 1 ',p1(input1))

// Part 2 and 3
// Caveat - balloons.length has to be even

const solve2 = (input,repeats) => {
    let
        balloons = input.split(''),
        balloonLen = balloons.length,
        halfLen = (repeats/2)*balloonLen,
        count = 0,
        secondHalfInd = repeats%2 === 0 ? 0 : balloonLen/2,
        firstHalf = [],
        firstVals = firstHalf.values(),
        currVal = balloons[count%balloonLen]

    do{
        let val = currVal.value ?? currVal
        if(bolts[count % 3] !== val){
            firstHalf.push(balloons[secondHalfInd%balloonLen])
            count++
            if(count>=halfLen) firstVals.next()
        } 
        count++
        secondHalfInd++
        currVal = count<halfLen ? balloons[count%balloonLen] : firstVals.next()
    } while (!currVal.done)

    return count
}

console.log('Part 2 ',solve2(input2,100))
console.log('Part 3 ',solve2(input3,100000)) // ~200ms