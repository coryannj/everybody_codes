const fs = require('fs');
const input1 = fs.readFileSync('../quest3.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../quest3_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../quest3_3.txt',{ encoding: 'utf8', flag: 'r' });

function adjacent ([r,c],part_No){
    return part_No<3 ? [[r-1,c],[r,c+1],[r+1,c],[r,c-1]] : [[r-1,c],[r,c+1],[r+1,c],[r,c-1],[r-1,c+1],[r+1,c+1],[r+1,c-1],[r-1,c-1]]
}

function digAll (input,part_No){
    let queue = input.replaceAll('#','1').split(/[\r\n]+/).map((x)=>x.split('')).flatMap((x,ix)=>x.flatMap((y,yx)=>y === '.' ? [] : [[ix,yx]])) // Array of [r,c] which have been dug
    let counter = queue.length

    while(queue.length>0){
        let newQueue = queue.filter((x)=>adjacent(x,part_No).every(([r,c])=> queue.some(([zr,zc])=> zr === r && zc === c)))
    
        if(newQueue.length>0){
            queue = newQueue
            counter+=newQueue.length
        } else {
            break;
        }
    }

    return counter
}

console.log(digAll(input1,1)) // Part 1
console.log(digAll(input2,2)) // Part 2
console.log(digAll(input3,3)) // Part 3