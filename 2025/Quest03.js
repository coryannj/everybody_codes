const fs = require('fs');
const input1 = fs.readFileSync('../inputs/everybody_codes/2025/quest3_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../inputs/everybody_codes/2025/quest3_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../inputs/everybody_codes/2025/quest3_3.txt',{ encoding: 'utf8', flag: 'r' });

console.log([...new Set(input1.split(',').map(Number))].reduce((a,c)=>a+c,0)) // Part 1

console.log([...new Set(input2.split(',').map(Number))].sort((a,b) => b-a).slice(-20).reduce((a,c)=>a+c,0)) // Part 2

console.log(Math.max(...Object.values(input3.split(',').map(Number).reduce((a, c) => {return a[c] ? ++a[c] : a[c] = 1, a}, {})))) // Part 3 - shameful rewrite after using for loop originally lolsob