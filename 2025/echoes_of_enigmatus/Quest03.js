const fs = require('fs');
const input1 = fs.readFileSync('../../inputs/everybody_codes/2025/echoes_of_enigmatus/quest3_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../../inputs/everybody_codes/2025/echoes_of_enigmatus/quest3_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../../inputs/everybody_codes/2025/echoes_of_enigmatus/quest3_3.txt',{ encoding: 'utf8', flag: 'r' });

let paths = []

for(i=1;i<=100;i++){
    let [x,y] = [1,i]
    let path = []

    do{
        path.push([x,y])
        x+=1
        y-=1
    } while (y>0)

    paths.push(path)
}

// Part 1
let lines = input1.split(/[\r\n]/).map((x)=>x.match(/\d+/g).map(Number))
let result = 0

lines.forEach(([x,y])=>{
    let path = paths.find((p)=>p.some(([px,py])=>px===x && py === y))
    let pathLen = path.length
    let startInd = path.findIndex(([px,py])=>px===x && py === y)
    let [endX,endY] = path[(startInd+100)%pathLen]

    result+=(endX+(100*endY))
})

console.log(result)

// Part 2 and 3

const solve = (input) => {
    let lines = input.split(/[\r\n]/).map((x)=>x.match(/\d+/g).map(Number)).map(([x,y])=>{
        let path = paths.find((p)=>p.some(([px,py])=>px===x && py === y))
        let pathLen = path.length
        let startInd = path.findIndex(([px,py])=>px===x && py === y)
        return [startInd,pathLen]
    })

    // Chinese remainder theorem
    let lcm = lines.map(([i,l])=>l).reduce((a,c)=>a*c,1)

    let crt = lines.map(([i,l])=>[l-i-1,l]).map(([remainder,mod])=>{
        let Ni = lcm/mod;
        let inv = Ni%mod;

        if(inv !== 1){
            let x = 1
            while((inv*x)%mod !== 1){
                x+=1
            }
            inv = x
        }

        return remainder*Ni*inv
    })

    let sum = crt.reduce((acc,curr)=>acc+curr)

    return sum%lcm
}

console.log(solve(input2))
console.log(solve(input3))