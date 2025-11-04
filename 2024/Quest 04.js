const fs = require('fs');
const input1 = fs.readFileSync('../quest4_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../quest4_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../quest4_3.txt',{ encoding: 'utf8', flag: 'r' });

// Part 1
let lines = input1.split(/[\r\n]+/).map(Number).sort((a,b)=>a-b)
let min = lines[0]

console.log(lines.slice(1).map((x)=>x-min).reduce((acc,curr)=>acc+curr,0))

// Part 2
let lines2 = input2.split(/[\r\n]+/).map(Number).sort((a,b)=>a-b)
let min2 = lines2[0]

console.log(lines2.slice(1).map((x)=>x-min2).reduce((acc,curr)=>acc+curr,0))

// Part 3
let lines3 = input3.split(/[\r\n]+/).map(Number).sort((a,b)=>a-b)
let currMin = 999999999999

lines3.forEach((x,ix,arr)=>{
    let testMin = arr.filter((y,yx)=>yx !== ix).map((z)=>Math.abs(z-x)).reduce((acc,curr)=>acc+curr,0)

    if(testMin<currMin){
        currMin = testMin
    }
})

console.log(currMin)