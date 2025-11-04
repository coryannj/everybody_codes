const fs = require('fs');
const input = fs.readFileSync('../quest1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../quest1_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../quest1_3.txt',{ encoding: 'utf8', flag: 'r' });

// Part 1
let lines = input.replaceAll('A','0').replaceAll('B','1').replaceAll('C','3').split('').map(Number).reduce((acc,curr)=>acc+curr,0)

console.log(lines)

// Part 2
let lines2 = input2.replaceAll('A','0').replaceAll('B','1').replaceAll('C','3').replaceAll('D','5').split('').map((x)=>x!=='x'? parseInt(x):x)

let p2Potions = 0

while(lines2.length>0){
    let [p1,p2] = [lines2.shift(),lines2.shift()]

    if(p1 !== 'x' && p2 !== 'x'){
        p2Potions+=(p1+p2+2)
    } else {
        if(p1 !=='x'){
            p2Potions+=p1
        }
        if(p2 !=='x'){
            p2Potions+=p2
        }
    }
}
console.log(p2Potions)

// Part 3
let lines3 = input3.replaceAll('A','0').replaceAll('B','1').replaceAll('C','3').replaceAll('D','5').split('').map((x)=>x!=='x'? parseInt(x):x)

let p3Potions = 0

while(lines3.length>0){
    let pArr = [p1,p2,p3] = [lines3.shift(),lines3.shift(),lines3.shift()]

    if(p1 !== 'x' && p2 !== 'x' && p3 !== 'x'){
        p3Potions+=(p1+p2+p3+6)
    } else {
        let xCount =  0
        pArr.forEach((x)=>{
            if(x !== 'x'){
                p3Potions+=x
            } else {
                xCount++
            }
        })

        if(xCount === 1){
            p3Potions+=2
        }
    }
}
console.log(p3Potions)