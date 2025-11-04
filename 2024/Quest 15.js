const { dir, group } = require('console');
const fs = require('fs');
const input1 = fs.readFileSync('../quest15_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../quest15_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../quest15_3.txt',{ encoding: 'utf8', flag: 'r' });

// Part 1

let lines1 = input1.split(/[\r\n]+/).map((x)=>x.split(''))

let startRow = 0
let startCol = lines1[0].indexOf('.')
let queue = [[startRow,startCol]]
let distance = 0
let seen = [`${startRow}|${startCol}`]

while(!queue.some(([qr,qc])=>lines1[qr][qc]==='H')){
    let nextQueue = []
    queue.forEach(([r,c])=>{

        [[r+1,c],[r-1,c],[r,c+1],[r,c-1]].filter(([nr,nc])=>0 <= nr && nr < lines1.length && 0 <= nc && nc <= lines1[0].length && lines1[nr][nc] !== '#' && !seen.includes(`${nr}|${nc}`)).forEach((x)=>{
            nextQueue.push(x)
            seen.push(x.join('|'))
        })

    })

    queue = nextQueue
    distance++
    
}

console.log(distance*2)

// Part 2
let lines2 = input2.split(/[\r\n]+/).map((x)=>x.split(''))

let startRow2 = 0
let startCol2 = lines1[0].indexOf('.')
 let herbs = lines2.flatMap((x,ix)=>x.flatMap((y,yx)=>!'#.'.includes(y) ? [y,[ix,yx]]:[]))


let queue2 = [[startRow,startCol]]
let distance2 = 0
let seen2 = [`${startRow}|${startCol}`]

while(!queue.some(([qr,qc])=>lines1[qr][qc]==='H')){
    let nextQueue = []
    queue.forEach(([r,c])=>{

        [[r+1,c],[r-1,c],[r,c+1],[r,c-1]].filter(([nr,nc])=>0 <= nr && nr < lines1.length && 0 <= nc && nc <= lines1[0].length && lines1[nr][nc] !== '#' && !seen.includes(`${nr}|${nc}`)).forEach((x)=>{
            nextQueue.push(x)
            seen.push(x.join('|'))
        })

    })

    queue = nextQueue
    distance++
    
}



// let gates = lines1.flatMap((x,ix)=>x.join('').includes('########') ? x.flatMap((y,yx)=>y==='.' ?[[ix,yx]]:[]):[])
// console.log([...new Set(gates.map((x)=>x[0]))])