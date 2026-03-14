const { dir, group } = require('console');
const fs = require('fs');
const input1 = fs.readFileSync('../inputs/everybody_codes/2024/quest18_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../inputs/everybody_codes/2024/quest18_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../inputs/everybody_codes/2024/quest18_3.txt',{ encoding: 'utf8', flag: 'r' });

const solve = (input,partNo) => {
    let lines = input.split(/\n/).map((x)=>x.split(''))
    let rowLen = lines.length
    let colLen = lines[0].length

    let gridObj = Object.fromEntries(lines.flatMap((x,xi)=>x.map((y,yi)=>[`${xi}_${yi}`,y])).filter(([k,v])=>v !== '#'))

    const nextArr = ([r,c]) => [[r+1,c],[r-1,c],[r,c+1],[r,c-1]].filter((n)=>gridObj[n.join('_')] !== undefined).map((x)=>x.join('_'))

    if(partNo === 3){
        let deadends = Object.keys(gridObj).filter((x)=>gridObj[x]==='.').filter((x)=>{
            let [nr,nc] = x.split('_').slice(0,2).map(Number)
            let neighbours = nextArr([nr,nc])

            return neighbours.length === 1 && gridObj[neighbours[0]] === '.' 
        })

        do{
            deadends.forEach((x)=>{delete gridObj[x]})

            deadends = Object.keys(gridObj).filter((x)=>gridObj[x]==='.').filter((x)=>{
            let [nr,nc] = x.split('_').slice(0,2).map(Number)
            let neighbours = nextArr([nr,nc])

            return neighbours.length === 1 && gridObj[neighbours[0]] === '.' 
        })

        } while(deadends.length>0)
    }

    let adjObj = Object.fromEntries(Object.keys(gridObj).map((x)=>{
        let [r,c] = x.split('_').slice(0,2).map(Number)
        return [`${r}_${c}`,nextArr([r,c])]
    }))

    let palms = Object.keys(gridObj).filter((x)=>gridObj[x] === 'P')
    let palmsCount = palms.length

    const waterPalms = (queue,partNo) => {
        let seen = new Set(queue)
        let palmsSeen = new Set()
        let time = 0
        let times = []

        while(palmsSeen.size<palmsCount){
            let newQueue = []
            time++
            queue.forEach((x)=>{
                let nextSteps = adjObj[x].filter((y)=>!seen.has(y))

                nextSteps.forEach((y)=>{
                    seen.add(y)
                    newQueue.push(y)
                    if(palms.includes(y)){
                        palmsSeen.add(y)
                        times.push(time)
                    } 
                })
            })

            queue = newQueue
        }

        return partNo<3 ? time : times.reduce((a,c)=>a+c)
    }

    if(partNo === 1) return waterPalms([`${lines.findIndex((x)=>x[0] === '.')}_0`],1)
    
    if(partNo === 2) return waterPalms([`${lines.findIndex((x)=>x[0] === '.')}_0`,`${lines.findIndex((x)=>x.at(-1) === '.')}_${colLen-1}`],2)


    let p3Queue = Object.keys(gridObj).filter((k)=>gridObj[k] === '.')
    let currMin = 999999999

    p3Queue.forEach((x,xi)=>{
        let thisTime = waterPalms([x],3)

        if(thisTime<currMin) currMin = thisTime
    })

    return currMin
}

console.log(solve(input1,1))
console.log(solve(input2,2))
console.log(solve(input3,3)) // ~44s but whatever
