const fs = require('fs');
const input1 = fs.readFileSync('../inputs/everybody_codes/2025/quest5_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../inputs/everybody_codes/2025/quest5_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../inputs/everybody_codes/2025/quest5_3.txt',{ encoding: 'utf8', flag: 'r' });

//input.split(/[\r\n]+/)
const turns = (input,firstRotations) => {
    gears = input.split(/[\r\n]+/).map((x)=>x.split("|").map(Number))

    let baseTurns = gears.map((x,i,a) => i===0 ? 1 : a[i-1].at(-1)/x[0]);

    return baseTurns.reduce((a,c)=>a*c,firstRotations)
} 

console.log(Math.floor(turns(input1,2025))) // Part 1

console.log(Math.ceil(10000000000000/turns(input2,1))) // Part 2

console.log(Math.floor(turns(input3,100))) // Part 3