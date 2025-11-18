const fs = require('fs');
const input1 = fs.readFileSync('../inputs/everybody_codes/2025/quest11_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../inputs/everybody_codes/2025/quest11_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../inputs/everybody_codes/2025/quest11_3.txt',{ encoding: 'utf8', flag: 'r' });

const exchanges = (input,partNo) => {
    let ducks = input.split(/[\r\n]/).map(Number)
    
    //First phase
    let counter=0
    while(ducks.some((x,i,a)=>i<a.length-1 && x>a[i+1])){
        for(i=0;i<ducks.length-1;i++){
            if(ducks[i]>ducks[i+1]){
                ducks[i]--
                ducks[i+1]++
            }
        }
        counter++
    }

    // Second phase
    while(ducks.some((x,i,a)=>i<a.length-1 && x<a[i+1])){
        for(i=0;i<ducks.length-1;i++){
            if(ducks[i]<ducks[i+1]){
                ducks[i]++
                ducks[i+1]--
            }
        }

        counter++

        if(partNo===1 && counter===10){
            console.log('Part 1 answer is ',ducks.map((x,i)=>x*(i+1)).reduce((a,c)=>a+c))
        }
    }
    
    return counter
}

console.log(exchanges(input1,1)) // Part 1 
let t1=performance.now()
console.log(exchanges(input2)) // Part 2
let t2 = performance.now()
console.log(t2-t1)
//Part 3
let p3 = input3.split(/[\r\n]/).map(Number)

const round2Fast = (round1Arr) => {
    let avg = round1Arr.reduce((a,c)=>a+c)/round1Arr.length
    
    return round1Arr.map((x)=>Math.abs(x-avg)).reduce((a,c)=>a+c)/2
}

console.log(round2Fast(p3)) // Part 3 answer

// **** Trying to work out non-brute force for Part 1 ****

// Gives the values for the round 1 output array - still trying to work out how to get number of rounds
const first = (input) => {
    let ducks = input.split(/[\r\n]/).map(Number)

    let processed = []

    while(ducks.length>0){
        let thisObj = {
            vals:[ducks.shift()],
            len:1,
        }
        thisObj.avg = thisObj.vals[0]
        thisObj.total = thisObj.vals[0]

        while(thisObj.avg>ducks[0]){
            let next = ducks.shift()
            thisObj.vals.push(next)
            thisObj.total+=next
            thisObj.len++
            thisObj.avg = thisObj.total/thisObj.len
        }

        while(processed.length>0 && processed.at(-1).avg>thisObj.avg){
            let lastObj = processed.pop()
            thisObj.vals = [...lastObj.vals,...thisObj.vals]
            thisObj.total+=lastObj.total
            thisObj.len+=lastObj.len
            thisObj.avg = thisObj.total/thisObj.len
        }
        
        let remainder = thisObj.total%thisObj.len
        let round2arr = Array(thisObj.len).fill(Math.floor(thisObj.avg)).map((x,i,a)=>i>=a.length-remainder?x+1:x)
        thisObj.round2 = round2arr

        processed.push(thisObj)
    }

    return processed
}

let t3 = performance.now()
//let round1 = first(input2).map((x)=>x.round2).flat()
console.log(round2Fast(first(input2).map((x)=>x.round2).flat()))
let t4 = performance.now()
console.log(t4-t3)


// Nonsense below here




let lines = input2.split(/[\r\n]/).map(Number)
let lines2 = input2.split(/[\r\n]/).map(Number)
console.log(lines2)
console.log(lines2.slice(0,-1).map((x,i)=>Math.abs(x-lines2[i+1])))
console.log(Math.max(...lines2.map((x)=>Math.abs(x-420928))))
console.log(Math.max(...lines2),Math.min(...lines2))
//572887
//2450900

let chunks = []

while(lines2.length>0){
    let newChunk = [lines2.shift()]
    while(lines2[0]<newChunk.at(-1)){
        newChunk.push(lines2.shift())
    }
    chunks.push(newChunk)

}
console.log(chunks)

while(chunks.some((x,i,a)=>i<a.length-1 && a[i+1].length>1 && a[i+1][0]-x.at(-1)<a[i+1][0]-a[i+1].at(-1))){
    let indexes = chunks.flatMap((x,i,a)=>{
        if(i<a.length-1 &&a[i+1].length>1 && a[i+1][0]-x.at(-1)<a[i+1][0]-a[i+1].at(-1)){
            return [[i,a[i+1][0]-x.at(-1),x,a[i+1]]]
        } else {
            return []
        }
    }).sort((a,b)=>a[1]-b[1])

    console.log(indexes)
    let sc = chunks[indexes[0][0]]
    let nc = chunks[indexes[0][0]+1]
    let fequalise = sc[0]-sc.at(-1)
    let equalise = Math.abs(sc.at(-1)-nc[0])
    //ncount+=Math.abs(fequalise-equalise)
        //nc[0]-=equalise

    nc = nc.map((x,i)=>i===0?x-equalise:x+equalise)
    sc.push(...nc)

    chunks=chunks.map((x)=>{
        if(x.length===1){
            return x
        } else {
            return x.map((y,yi)=>yi===0?y-equalise:y+equalise)
        }
    }).toSpliced(indexes[0][0],2,sc)
    console.log('chunks is now ',chunks)
}




    let newChunks = []
    let ncount = 0
    let sc = chunks.shift()
while(chunks.length>0){

    
    let nc = chunks.shift()
    //console.log(sc,nc)
    if(Math.abs(sc.at(-1)-nc[0])<nc[0]-nc.at(-1)){
        let fequalise = sc[0]-sc.at(-1)
        let equalise = Math.abs(sc.at(-1)-nc[0])
        ncount+=Math.abs(fequalise-equalise)
        //nc[0]-=equalise

        nc = nc.map((x,i)=>i===0?x-equalise:x+equalise)
        sc.push(...nc)
        //console.log('equalise ',equalise,sc)
    } else {
        newChunks.push(sc)
        sc=nc
      //  console.log('no equalise, sc is now ',sc)
    }
    console.log('ncount is now ',ncount)
}
console.log(ncount)
console.log(newChunks)

lines2 = input2.split(/[\r\n]/).map(Number)

//First phase
let counter=0
while(lines2.some((x,i,a)=>i<a.length-1 && x>a[i+1])){
    for(i=0;i<lines2.length-1;i++){
        if(lines2[i]>lines2[i+1]){
            lines2[i]--
            lines2[i+1]++
        }
    }
    //console.log(counter,lines)
    counter++
    if(counter%10000===0){
        console.log(counter,lines2)
    }
}
console.log('part1 counter is ',counter-1)
console.log(lines2)

let t = [
    6199, 306178, 306178, 330845, 330845, 330845,
  330845, 330846, 330846, 395145, 395146, 395146,
  420928, 420928, 420928, 420928, 420928, 420928,
  420928, 420928, 420928, 420928, 420928, 420928,
  420928, 420928, 420928, 420928, 420929, 420929,
  420929, 420929, 420929, 420929, 420929, 420929,
  420929, 420929, 420929, 420929, 420929, 420929,
  420929, 420929, 420929, 420929, 420929, 420929,
  420929, 420929, 420929, 420929, 420929, 420929,
  420929, 420929, 420929, 420929, 420929, 420929
]

//console.log(lines.map((x,i)=>Math.abs(x-t[i])).sort((a,b)=>b-a))

console.log((8344/2)+(618403/(6*2))+(392879/(3*2))+(572882/(48*2)))
//2450900
//16408220
console.log(8344+618403+392879+572886)
console.log(2450900-1019626)

//699303883
//764947149

console.log(764947149-699303883)




f.forEach((x)=>{
    console.log(x.vals.map((y)=>Math.floor(y-x.avg)).sort((a,b)=>b-a))
})






//2450900
//16408220
console.log(lines.map((x,i)=>Math.abs(x-t[i])).reduce((a,c)=>a+c))
console.log(lines.map((x,i)=>x>t[i]?x-t[i]:0).reduce((a,c)=>a+c))
console.log(16408220+8204110)


let lines3 = input3.split(/[\r\n]/).map(Number)
let cols = lines3.length
//console.log(lines)

let startIndex = lines.findIndex((x,i,a)=>x>a[i+1])
let lastHighest
let nextHighest = lines.findIndex((x,xi,a)=>xi>startIndex && x>lines[startIndex])
let counter2 = 0



console.log(startIndex,nextHighest)

while(startIndex>=0){
    //console.log('new line',startIndex,nextHighest)
    let thisBalance = (nextHighest>0) ? lines.slice(startIndex,nextHighest) : lines.slice(startIndex)
    let total = thisBalance.reduce((a,c)=>a+c)
    let balance = Math.floor(total/thisBalance.length)
    let remainder = total%thisBalance.length
//console.log("j is ",startIndex," last index is ",startIndex+thisBalance.length-1," thisBalance is ",thisBalance)
    for(j=startIndex;j<startIndex+thisBalance.length;j++){
        //if(j==startIndex){
            counter2+=(Math.abs(lines[j]-balance))
        //}
            
        
        lines[j]=balance
        if(j>=thisBalance.length-remainder){
            lines[j]++
        }
    }

    startIndex = nextHighest > 0 ? nextHighest : -1
    nextHighest = lines.findIndex((x,xi,a)=>xi>startIndex && x>lines[startIndex])
}
console.log('counter2 is ',counter2)
console.log('lines is ',lines)



//let counter = 0







