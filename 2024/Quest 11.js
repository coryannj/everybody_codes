const { dir, group } = require('console');
const fs = require('fs');
const input1 = fs.readFileSync('../quest11_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../quest11_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../quest11_3.txt',{ encoding: 'utf8', flag: 'r' });

function countTermites(input,days,first){
    let termites = Object.fromEntries(input.split(/[\r\n]+/).map((x)=>x.split(/[:,]/)).map((x)=>[x[0],x.slice(1)]))
    let termiteCount = {}
    termiteCount[first] = 1

    for(i=0;i<days;i++){
        let newObj = {}
    
        Object.keys(termiteCount).filter((x)=>termiteCount[x]>0).forEach((x)=>{
            termites[x].forEach((y)=>{
                if(newObj[y]===undefined)newObj[y]=0
                newObj[y]+=(termiteCount[x])
            })
        })
        termiteCount = newObj
    }

    return Object.values(termiteCount).reduce((acc,curr)=>acc+curr,0)
}

// Part 1
console.log(countTermites(input1,4,'A'))

// Part 2
console.log(countTermites(input2,10,'Z'))

// Part 3
let population = [...new Set(input3.split(/[\r\n]+/).map((x)=>x.split(/[:,]/)).flat())].map((x)=>countTermites(input3,20,x))
population.sort((a,b)=>a-b)
console.log(population.at(-1)-population[0])