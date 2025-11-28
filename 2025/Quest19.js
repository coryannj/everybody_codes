const fs = require('fs');
const input1 = fs.readFileSync('../inputs/everybody_codes/2025/quest19_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../inputs/everybody_codes/2025/quest19_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../inputs/everybody_codes/2025/quest19_3.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input1.split(/[\r\n]/).map((x)=>x.split(',').map(Number))

console.log(lines)

let points = []
let gaps = []

lines.forEach((v)=>{
    let [x,y,z] = v
    if(y>0){
        points.push([[x,y-1],[x,y+z]])
        gaps.push([[x,y],[x,y+z-1]])
    } else {
        points.push([[x,0],[x,z]])
        gaps.push([[x,0],[x,z-1]])
    }

    
})

console.log(points)
console.log(gaps)

let curr = [0,0]
let flaps = 0

points.forEach(([x,y])=>{
    let [lx,ly] = curr
    let next

    if(ly<y && ly+(x-lx)){
        console.log('moving up')
        next = [x,ly+(x-lx)]
        flaps+=(x-lx)
        console.log(flaps)
    } else if (ly>y && ly-(x-lx)>0){
        console.log('moving down')
        next = [x,ly-(x-lx)]
    } else {
        console.log('dont know')
    }


     
    console.log(curr,[x,y],next)

    curr=next
    
})
console.log(flaps)