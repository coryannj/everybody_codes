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
// Performance is better with an additional first loop that goes over balloons repeat/2 times before populating firstHalf, but then have to handle a bunch of edge cases

const solve = (input,repeats) => {
    let
        balloons = input.split(''),
        balloonLen = balloons.length,
        halfRepeats = Math.floor(repeats/2),
        count = 0,
        secondHalfInd = repeats%2 === 0 ? 0 : balloonLen/2,
        firstHalf = Array(halfRepeats).fill(balloons).flat()
    
    if(repeats%2!==0)firstHalf.push(balloons.slice(0,balloonLen/2))
    
    let firstVals = firstHalf.values()
    let currVal = firstVals.next()

    do{
        if(bolts[count % 3] !== currVal.value){
            firstHalf.push(balloons[secondHalfInd%balloonLen])
            firstVals.next()
            count++
        } 
        count++
        secondHalfInd++
        currVal = firstVals.next()
    } while (!currVal.done)

    return count
}

console.log('Part 2 ',solve(input2,100))
console.log('Part 3 ',solve(input3,100000))