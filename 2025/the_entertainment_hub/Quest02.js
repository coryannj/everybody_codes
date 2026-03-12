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
// Caveats - repeats must be even, halves must be equal size after first for loop

const solve = (input,repeats) => {
    let
        balloons = input.split(''),
        balloonLen = balloons.length,
        bolts = ['R','G','B'],
        halfLen = (repeats/2)*balloonLen,
        count = halfLen,
        firstHalf = [],
        secondInd = 0
    
    for(i=0;i<halfLen;i++){
        if(bolts[i % 3] !== balloons[i%balloonLen]){
            firstHalf.push(balloons[secondInd%balloonLen])
            i++
        } 
        secondInd++
    }

    let firstVals = firstHalf.values()
    let currVal = firstVals.next()

    do{
        if(bolts[count % 3] !== currVal.value){
            firstHalf.push(balloons[secondInd%balloonLen])
            firstVals.next()
            count++
        } 
        count++
        secondInd++
        currVal = firstVals.next()
    } while (!currVal.done)

    return count
}

console.log('Part 2 ',solve(input2,100))
console.log('Part 3 ',solve(input3,100000))