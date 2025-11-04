const fs = require('fs');
const input1 = fs.readFileSync('../quest5_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../quest5_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../quest5_3.txt',{ encoding: 'utf8', flag: 'r' });

function moveInd(person,colLen){
    let remainder = person%(colLen*2)

    if(remainder<=colLen){
        return Math.abs(remainder-1)
    } else {
        return remainder-((remainder-colLen-1)*2)-1
    }
}

function round(colArr,colNumber){
    let numOfCols = colArr.length
    let person = colArr[colNumber%numOfCols].shift()
    let nextCol = (colNumber+1)%numOfCols
    let nextInd = moveInd(person,colArr[nextCol].length)
    colArr[nextCol].splice(nextInd,0,person)

    return colArr
}

// Part 1
let lines = input1.split(/[\r\n]+/).map((x)=>x.split(' ').map(Number))
let cols = lines[0].map((x,ix)=>lines.map((x)=>x[ix]))
let rounds = 10

for(i=0;i<rounds;i++){
    cols = round(cols,i)
}

console.log(cols.map((x)=>x[0]).join(''))

// Part 2

let lines2 = input2.split(/[\r\n]+/).map((x)=>x.split(' ').map(Number))
let cols2 = lines2[0].map((x,ix)=>lines2.map((x)=>x[ix]))
let numberCount = {}
let counter2 = 0

while(true){
    cols2 = round(cols2,counter2);
    let number = cols2.map((x)=>x[0]).join('');
    numberCount[number] = ++numberCount[number] || 1;
    
    counter2++
    
    if (numberCount[number]===2024) {
        break;
    }
}

console.log(parseInt(Object.keys(numberCount).find((x)=>numberCount[x]===2024)*counter2))


// Part 3
let lines3 = input3.split(/[\r\n]+/).map((x)=>x.split(' ').map(Number))
let cols3 = lines3[0].map((x,ix)=>lines3.map((x)=>x[ix]))
let maxShout = 0
let counter3 = 0
let cache = {}

while(!cache[cols3.map((x)=>x.join('-')).join('|')]){
    cache[cols3.map((x)=>x.join('-')).join('|')]= true
    
    cols3 = round(cols3,counter3);
    let number = cols3.map((x)=>x[0]).join('');

    counter3++

    if(parseInt(number)>maxShout){
        maxShout = parseInt(number)   
    }   
}

console.log(maxShout)