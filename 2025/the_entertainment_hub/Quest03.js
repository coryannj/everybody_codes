const fs = require('fs');
const input1 = fs.readFileSync('../../inputs/everybody_codes/2025/the_entertainment_hub/quest3_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../../inputs/everybody_codes/2025/the_entertainment_hub/quest3_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../../inputs/everybody_codes/2025/the_entertainment_hub/quest3_3.txt',{ encoding: 'utf8', flag: 'r' });

const parse = (input) => input.split(/[\r\n]/).map((x,xi)=>{
    let nums = x.split(' ').slice(1).map((y)=>y.match(/[-\d]+/g).map(Number))

    return [nums[0],nums[1][0],0,nums[1][0]]
})

const roll = (rollNo,[faces,seed,lastFaceInd,pulse]) => {
    let
        spin = rollNo * pulse,
        newFaceInd = (lastFaceInd+spin)%faces.length,
        result = faces[newFaceInd],
        newPulse = ((pulse+spin)%seed)+1+rollNo+seed
    
    return [result,newFaceInd,newPulse]
}

// Part 1
let lines = parse(input1)

let rolls = 10000,total = 0

for(i=1;i<=rolls;i++){
    lines = lines.map((x,xi)=>{
        let result = roll(i,x)
        total+=result[0]
        return x.slice(0,2).concat(result.slice(1))
    })

    if(total>=10000) break;
}
console.log(i)

// Part 2

let [lines2,raceTrack] = input2.split(/[\r\n]{2}/)

lines2 = parse(lines2)

let
    placement = Array(lines2.length).fill(0).map((x)=>raceTrack.split('').map(Number)),
    p2Roll = 1,
    order = []

while(placement.some((x)=>x.length>0)){
    lines2 = lines2.map((x,xi)=>{
        if(placement[xi].length>0){
            let result = roll(p2Roll,x)

            if(placement[xi][0] === result[0]){
                if(placement[xi].length === 1){
                    order.push(xi+1)
                }
                placement[xi].shift()
            }

            return x.slice(0,2).concat(result.slice(1))
        } else {
            return x
        }
    })

    p2Roll++
}

console.log(order.join(','))

// Part 3

let [lines3,grid] = input3.split(/[\r\n]{2}/)
lines3 = parse(lines3)
grid = Object.fromEntries(grid.split(/[\r\n]/).map((x,xi)=>x.split('').map((y,yi)=>[`${xi}_${yi}_${y}`,[xi,yi]])).flat())

let gridByNums = Object.fromEntries(Array(9).fill(0).map((x,xi)=>[xi+1,[]]))

Object.keys(grid).forEach((x)=>gridByNums[x.slice(-1)].push(x))

let allPossible = new Set()
const nextArr = [[-1,0],[1,0],[0,-1],[0,1]]

lines3.forEach((x)=>{
    let
        initResult = roll(1,x),
        lastResult = initResult[0],
        rollNo = 2,
        queue = new Set(gridByNums[initResult[0]])
    
    x = x.slice(0,2).concat(initResult.slice(1))
    allPossible = allPossible.union(queue)

    do {
        let result = roll(rollNo,x)
        let newQueue = result[0] === lastResult ? new Set(queue) : new Set() // Check if result same as last value

        rollNo++
        x = x.slice(0,2).concat(result.slice(1))
        lastResult = result[0]

        queue.values().forEach((key)=>{
            let [r,c] = grid[key]

            nextArr.forEach(([nr,nc])=>{
                let newKey = `${nr+r}_${nc+c}_${lastResult}`
                if(grid[newKey]){
                    newQueue.add(newKey)
                    allPossible.add(newKey)
                }
            })
        })

        queue = newQueue

    } while (queue.size>0)

})

console.log(allPossible.size)