const { dir, group } = require('console');
const fs = require('fs');
const input1 = fs.readFileSync('../inputs/everybody_codes/2024/quest16_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../inputs/everybody_codes/2024/quest16_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../inputs/everybody_codes/2024/quest16_3.txt',{ encoding: 'utf8', flag: 'r' });

const parse = (input,partNo) =>{
    let [turns,reels] = input.split(/\n\n/)
    turns = turns.split(',').map(Number)

    reels = reels.split(/[\r\n]/).map((x)=>`${x} `.match(/[\s\S]{4}/g))

    reels = reels[0].map((x,xi)=>reels.flatMap((y)=>y[xi] !== undefined && y[xi][0] !== ' ' ? [y[xi].trim()] : []))

    if(partNo>1) reels = reels.map((x)=>x.map((y)=>`${y[0]}${y[2]}`)) // Remove muzzles for p2/p3

    return [turns.map((x,xi)=>[x,reels[xi].length]),reels]
}

const roll = (inds,turns) => inds.map((x,xi)=>(x+turns[xi][0])%turns[xi][1])

const getScore = (inds,reels) => {
    let str = reels.map((x,xi)=>x[inds[xi]]).join('')

    let counts = {}
    
    for(const s of str){
        counts[s] = (counts[s] ?? 0)+1
    }
    
    return Object.values(counts).filter((x)=>x>=3).reduce((a,c)=> a+(c-2),0)
}

// Part 1
let [t1,r1] = parse(input1,1)
console.log('Part 1 ',r1.map((x,xi)=>x[(100*t1[xi][0])%t1[xi][1]]).join(''))

// Part 2

let [t2,r2] = parse(input2,2)
let cycleInds = t2.map((x)=>0)
let cycleCoins = []

do{
    cycleInds = roll(cycleInds,t2)
    cycleCoins.push(getScore(cycleInds,r2))
} while (cycleInds.some((x)=>x > 0))

let cycleLen = cycleCoins.length
let cycleTotal = cycleCoins.reduce((a,c)=>a+c)
let noCycles = Math.floor(202420242024/cycleLen)
let baseTotal = noCycles*cycleTotal
let remainder = cycleCoins.slice(0,(202420242024%cycleLen)).reduce((a,c)=>a+c,0)

console.log('Part 2', baseTotal+remainder)

// Part 3
let
    [t3,r3] = parse(input3,3),
    p3count = 256,
    reelLen = t3.length,
    startInds = t3.map((x)=>0),
    opts = [-1,0,1].map((x)=>t3.map((y)=>y[1]+x)),
    startKey = startInds.join('_'),
    seen = new Set([startKey]),
    allCombos = [startInds],
    queue = [startInds],
    rounds = 0,
    p3Scores = {}

const p3GetScore = (inds) => {
    let key = inds.join('_')
    if(p3Scores[key] !== undefined){
        return p3Scores[key]
    } else {
        let result = getScore(inds,r3)
        p3Scores[key] = result
        return result
    }
}

p3GetScore(startInds)

const p3Roll = (inds) => opts.map((x,xi)=> roll(x.map((y,yi)=>y+inds[yi]),t3))

const getMaxMin = (inds,type) => {
    let scores = p3Roll(inds).map((x)=> p3GetScore(x))
    return type === 'min' ? Math.min(...scores) : Math.max(...scores)
}

// Not bonkers recursive solution
let memo = {}

const findMaxMin = (inds,type,pulls) => {
    let key = `${inds.join('_')}_${type}_${pulls}`

    if(memo[key]) return memo[key];

    if(pulls === 1){
        let lastMaxMin = getMaxMin(inds,type)
        memo[key] = lastMaxMin
        return lastMaxMin
    } 

    let nextRoll = p3Roll(inds).map((x)=> p3GetScore(x) + findMaxMin(x,type,pulls-1))

    let thisMinMax = type === 'min' ? Math.min(...nextRoll) : Math.max(...nextRoll)

    memo[key] = thisMinMax

    return thisMinMax
}

console.log('Part 3 ',[findMaxMin(startInds,'max',256),findMaxMin(startInds,'min',256)].join(' '))

// Slightly bonkers solution

// Get list of seen reels
// There's 94 million possible combinations, but only ~27000 seen when doing 256 rounds
while(rounds<p3count && queue.length>0){
    let newQueue = []
    queue.forEach((inds)=>{
        p3Roll(inds).forEach((x)=>{
            let k = x.join('_')

            if(!seen.has(k)){
                seen.add(k)
                newQueue.push(x)
                allCombos.push(x)
                //p3Scores[k] = p3GetScore(x) // if not running after recursion solution
            }
        })
    })
    rounds++
    queue = newQueue
    //console.log(rounds,queue.length)
}

// Work backwards - start with min/max for 1 roll, then use that to build all outcomes for 2 rolls etc for all combos
const p3MaxMin = (inds) => p3Roll(inds).map((x)=> p3Scores[x.join('_')] ?? p3GetScore(inds)).sort((a,b)=>b-a).filter((x,xi)=>xi!==1)

let allMaxMin = Object.fromEntries(allCombos.map((x)=>[`${x.join('_')}_1`,p3MaxMin(x)]))

for(i=2;i<=p3count;i++){
    let newObj = {}

    Object.keys(allMaxMin).map((x)=>x.split('_').slice(0,reelLen).map(Number)).forEach((inds)=>{
        let thisRoll = p3Roll(inds)
        let thisScores = thisRoll.map((x)=>p3Scores[x.join('_')])
        let nextRoll = thisRoll.map((x,xi)=> allMaxMin[`${x.join('_')}_${i-1}`])

        if(!thisScores.some((x)=>x === undefined) && !nextRoll.flat().some((x)=>isNaN(x))){

            let combined = nextRoll.map((x,xi)=>x.map((y)=>y+thisScores[xi]))
                
            newObj[`${inds.join('_')}_${i}`] = combined.reduce((a,c)=>[Math.max(a[0],c[0]),Math.min(a[1],c[1])],[0,9999999])            
        }
    })
    
    allMaxMin = newObj
}

console.log('Part 3 ',allMaxMin[`${startKey}_${p3count}`].join(' '))