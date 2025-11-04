const { dir, group } = require('console');
const fs = require('fs');
const input1 = fs.readFileSync('../quest16_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../quest16_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../quest16_3.txt',{ encoding: 'utf8', flag: 'r' });

// Part 1

const parseReels = (input) => {
    let lines = input.split(/\n\n/)
    let pull = lines[0].split(',').map(Number)
    let reels = lines[1].split(/[\r\n]+/).map((x)=>x.match(/([\S]{3}(?:[\s]|$)|[\s]{3}(?:[\s]|$))/gm)).map((x)=>x.map((y)=>y.trim()))
    let reelCount = reels[0].length
    
    let reelsMap = Array(reelCount).fill('.').map((x,ix)=>reels.map((y)=>y[ix])).map((x)=>{
        return x.filter((y)=>y.length>0)
    })

    return [pull,reelsMap]
}

let [pull1,reels1] = parseReels(input1)

console.log(reels1.map((x,ix)=>x[(100*pull1[ix])%x.length]).join(' '))

// Part 2

let [pull2,reels2] = parseReels(input2)
let seen = {}
let pullNo = 1
let reelInd = reels2.map((x,ix)=> (pullNo*pull2[ix])%x.length)

while(!seen[reelInd.join(' ')]){
   seen[reelInd.join(' ')] = true
   pullNo++
   reelInd = reels2.map((x,ix)=> (pullNo*pull2[ix])%x.length)
}

pullNo--
let cycleObj = {}

for(i=1;i<=pullNo;i++){
    let results = reels2.map((x,ix)=>x[(i*pull2[ix])%x.length])
    let removeMuzzles = results.map((x)=>`${x[0]}${x[2]}`)
    let result = removeMuzzles.join('').split('').reduce((obj, symbol) => {
        const count = obj[symbol] || 0
        return { ...obj, [symbol]: count + 1 }
      }, {})
    
    let eyes = Object.entries(result).filter(([key,val])=>val>=3)
    let pullCount = 0

    if(eyes.length>0){
        eyes.forEach(([k,v])=>pullCount+=1+(v-3));
        cycleObj[i] = pullCount
    } else {
        cycleObj[i] = 0
    }
}

let cycleCoins = Object.values(cycleObj).reduce((acc,curr)=>acc+curr);
let pullCounter = 202420242024;
let cycles = Math.floor(pullCounter/pullNo);
let remainder = pullCounter%pullNo;
let remainderCount = Object.values(cycleObj).slice(0,remainder).reduce((acc,curr)=>acc+curr);

console.log((cycles*cycleCoins)+remainderCount)

// Part 3
let [pull3,reels3] = parseReels(input3)
reels3 = reels3.map((x)=>x.map((y)=>`${y[0]}${y[2]}`))
let reelCount3 = reels3[0].length
let reels3Len= reels3.map((x)=>x.length)
console.log(reels3,reelCount3,reels3Len)
let allIndexes = reels3Len.map((x)=>Array(x).fill('.').map((y,yx)=>yx))
console.log(allIndexes)
//let leftPull = [-1,0,1]

// Generate cartesian product of given iterables:
function* cartesian(head, ...tail) {
    const remainder = tail.length > 0 ? cartesian(...tail) : [[]];
    for (let r of remainder) for (let h of head) yield [h, ...r];
  }
  
  // Example:
  //console.log(...cartesian(...allIndexes));

let q = cartesian(...allIndexes)
let qItem = q.next()
console.log(qItem)

let machine = {}
let counter = 0
do{
    counter++
    let reel = qItem.value



    machine[reel.join('-')] = {
        'leftpull':reel.map((x,ix)=> x===0 ? reels3Len[ix]-1 : x-1).join('-'),
        'leftpush':reel.map((x,ix)=>x+1===reels3Len[ix] ? 0 : x+1).join('-'),
        'rightpull':reel.map((x,ix)=>(x+pull3[ix])%reels3Len[ix]).join('-'),
        'beforeright':reels3.map((x,ix)=>x[reel[ix]]).join(''),

    }
    //console.log(machine[reel.join('-')])
    machine[reel.join('-')]['afterright']=reels3.map((x,ix)=>x[ machine[reel.join('-')]['rightpull'].split('-')[ix]]).join('')


    machine[reel.join('-')]['aftercounts']=machine[reel.join('-')]['afterright'].split('').reduce((obj, symbol) => {
        const count = obj[symbol] || 0
        return { ...obj, [symbol]: count + 1 }
      }, {})



      let coinTotal = 0
        
      let counts = Object.values(machine[reel.join('-')]['aftercounts']).filter((x)=>x>=3)
  
      if(counts.length > 0){
          counts.forEach((v)=>coinTotal+=1+(v-3))
      }      
      machine[reel.join('-')]['afterscore'] = coinTotal


    qItem = q.next()

    if(counter%1000000===0){
        console.log('counter is ',counter)
    }

}while(qItem.done !== true)


console.log(machine)



















let queue = [Array(reelCount3).fill('.').map((x)=>0)].flatMap((x,ix)=>[-1,0,1].map((y,yx)=>x.map((z,zx)=>{    
    if(z+y<0){
        return reels3Len[zx]-1
    }else if(z+y===reels3Len[zx]){
        return 0
    } else {
        return z+y
    }
})))

console.log(queue)

// queue = queue.flatMap((x,ix)=>leftPull.map((y,yx)=>x.map((z,zx)=>{    
//     if(z+y<0){
//         return reels3Len[zx]-1
//     }else if(z+y===reels3Len[zx]){
//         return 0
//     } else {
//         return z+y
//     }
// })))

const leftPull = (queueArr) => {
    let first = queueArr[0].map((x,ix)=>x===0 ? reels3Len[ix]-1 : x-1)
    let last = queueArr.at(-1).map((x,ix)=>x+1===reels3Len[ix] ? 0 : x+1)
    
    queueArr.unshift(first)
    queueArr.push(last)
    return queueArr

    // return queueArr.flatMap((x,ix)=>[-1,0,1].map((y,yx)=>x.map((z,zx)=>{    
    //     if(z+y<0){
    //         return reels3Len[zx]-1
    //     }else if(z+y===reels3Len[zx]){
    //         return 0
    //     } else {
    //         return z+y
    //     }
    // })))
}

let countObj = {}
let pullCount3 = 11
let counter3 = 0
let p3min = 0
let p3max = 0

const getCoins = (indexes,pulls,reels,reelLen) => {
    
    let newIndexes = indexes.map((x,ix)=>(x+pulls[ix])%reelLen[ix])
    console.log('indexes,pulls,reelLen,newIndexes ',indexes,pulls,reelLen,newIndexes)
    
    if(countObj[newIndexes.join('-')] !== undefined){
        return [newIndexes,countObj[newIndexes.join('-')]]
    } else {
        
        let spin = reels.map((x,ix)=>x[newIndexes[ix]]).join('').split('').reduce((obj, symbol) => {
            const count = obj[symbol] || 0
            return { ...obj, [symbol]: count + 1 }
          }, {})
        console.log('getcoins', indexes,newIndexes,pulls,spin)
    
        let coinTotal = 0
        
        let counts = Object.values(spin).filter((x)=>x>=3)
    
        if(counts.length > 0){
            counts.forEach((v)=>coinTotal+=1+(v-3))
        }
    
        countObj[newIndexes.join('-')] = coinTotal
        return [newIndexes,coinTotal]
    }
    
    


}

while(counter3<pullCount3){
    //queue = leftPull(queue)
    console.log('NEW LINE queue leftPull is ',queue)
    let newQueue = queue.map((x)=>getCoins(x,pull3,reels3,reels3Len))
    let [cmin,cmax] = newQueue.map((x)=>x[1]).sort((a,b)=>a-b).filter((x,ix,arr)=>ix === 0 || ix===arr.length-1)
    console.log('newqueue output',newQueue)
    p3min+=cmin
    p3max+=cmax
    console.log(counter3,'coins is', [cmin,cmax], 'p3 min max is ',[p3min,p3max])
    
    //queue = newQueue.map((x)=>x[0])
    queue = leftPull(newQueue.map((x)=>x[0]))
    console.log('newQueue is ',queue)

    counter3++
}

