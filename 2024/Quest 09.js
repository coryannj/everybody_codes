const { dir } = require('console');
const fs = require('fs');
const input1 = fs.readFileSync('../quest9_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../quest9_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../quest9_3.txt',{ encoding: 'utf8', flag: 'r' });

function minStamps(stamps,max){
    let minStamps = Array(max+1).fill('.').map((x,ix)=>stamps[0]===1?ix:max+1);
    minStamps[0] = 0;
    let sLen = stamps.length;
    let sInd = stamps[0] === 1 ? 1 : 0;

    for(s = sInd ; s < sLen ; s++){
        for(b=stamps[s] ; b <= max ; b++){
            minStamps[b] = Math.min(minStamps[b],minStamps[b-stamps[s]]+1)
        }
    }

    return minStamps
}

function minBeetles(input,stamps,partNo){
    let bright = input.split(/[\r\n]+/).map(Number)
    let bLen = bright.length
    let max = partNo < 3 ? Math.max(...bright) : Math.ceil(Math.max(...bright)/2+50)
    let minS = minStamps(stamps,max)

    if(partNo < 3){
        return bright.map((x)=>minS[x]).reduce((acc,curr)=>acc+curr)
    } else {
        let beetles = 0
        for(i = 0; i < bLen ; i++){
            let brightness = bright[i]
            let minb = Math.ceil(brightness/2-50)
            let maxb = brightness-minb
            let currMin = 999999
            for(j=minb;j<=minb+50;j++){
                currMin = Math.min(currMin,minS[j]+minS[maxb])
                maxb--
            }
            beetles+=currMin
        }
        return beetles
    }

}

// Part 1
let stamps1 = [1, 3, 5, 10]
console.log(minBeetles(input1,stamps1,1))

// Part 2
let stamps2 = [1, 3, 5, 10, 15, 16, 20, 24, 25, 30]
console.log(minBeetles(input2,stamps2,2))

// Part 3
let stamps3 = [1, 3, 5, 10, 15, 16, 20, 24, 25, 30, 37, 38, 49, 50, 74, 75, 100, 101]
console.log(minBeetles(input3,stamps3,3))