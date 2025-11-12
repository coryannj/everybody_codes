const fs = require('fs');
const input1 = fs.readFileSync('../inputs/everybody_codes/2025/quest6_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../inputs/everybody_codes/2025/quest6_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../inputs/everybody_codes/2025/quest6_3.txt',{ encoding: 'utf8', flag: 'r' });

let list = input1.split('')
let list2 = input2.split('')

// Part 1 and 2
console.log(list.filter((x)=>x==='a'||x==='A').map((x,i,a)=>x===x.toLowerCase()?a.filter((y,yi)=>yi<i && y===x.toUpperCase()).length:x).filter((x)=>typeof(x)==='number').reduce((a,c)=>a+c)) // Part 1

console.log(list2.map((x,i,a)=>x===x.toLowerCase()?a.filter((y,yi)=>yi<i && y===x.toUpperCase()).length:x).filter((x)=>typeof(x)==='number').reduce((a,c)=>a+c)) // Part 2

// Revised Part 3 implementation - note not generalised - only works because p3 input is more than the distance limit
let t1=performance.now()

let
    list3 = input3.split(''),
    len = list3.length,
    limit = 1000,
    repeats = 1000,
    deltaInd = len-limit //9000

// When index between 0-999 we're going to separately track the mentors in end of prev segment (fDelta)
// When index between 9000-9999 we're going to separately track the mentors in next segment (lDelta)
// First segment will be segmentCount + lDelta
// Last segment will be fDelta + segmentCount
// 998 segments in the middle will be fDelta + segmentCount + lDelta
// Answer will be (999*fDelta) + (1000*segmentCount) + (999*lDelta)

// Calculate deltas
let 
    lastSeg=[...list3.slice(-limit)],
    firstSeg=[...list3.slice(0,limit)],
    lCounts = {"A":0,"B":0,"C":0,"a":0,"b":0,"c":0},
    lDelta = 0,
    fCounts = {"A":0,"B":0,"C":0,"a":0,"b":0,"c":0},
    fDelta = 0

for(i=0;i<limit;i++){
    let l=lastSeg[i] 
    let lPair=firstSeg[i]
    lCounts[lPair]++
    if(l===l.toLowerCase()) lDelta+=lCounts[l.toUpperCase()]

    let f=firstSeg.at(-1-i) 
    let fPair=lastSeg.at(-1-i)
    fCounts[fPair]++
    if(f===f.toLowerCase()) fDelta+=fCounts[f.toUpperCase()]
}

// Calculate the segmentCount
let 
    segmentCount = 0,
    mPrev = {"A":0,"B":0,"C":0,"a":0,"b":0,"c":0},
    mNext = lCounts

for(j=0;j<len;j++){
    let val = list3[j]
    mNext[val] > 0 ? mNext[val]-- : ""
    
    if(j<deltaInd) mNext[list3[j+limit]]++

    if(val===val.toLowerCase()){
        segmentCount+=(mNext[val.toUpperCase()]+mPrev[val.toUpperCase()])
    } 
    
    mPrev[val]++

    if(j>=limit){
        let prevInd= j-limit;
        mPrev[list3.at(prevInd)]>0 ? mPrev[list3.at(prevInd)]-- : ""
    } 

}
let t2=performance.now()
console.log((segmentCount*repeats)+((repeats-1)*lDelta)+((repeats-1)*fDelta)) // Part 3 answer
console.log(t2-t1,"ms") // ~3.27ms

// Gross Part 3 implementation I did my first time
let t3=performance.now()
let start = [...list3,...list3.slice(0,1000)]
let middle = [...list3.slice(-1000),...list3,...list3.slice(0,1000)]
let end = [...list3.slice(-1000),...list3]

let s = [0,9999]
let m = [1000,10999]
let e = [1000,10999]

let result=0, result2=0, result3=0

for(const [i,x]of start.entries()){
    if(i>s[1])break;

    if(x===x.toLowerCase()){
        let mentors = start.filter((y,yi)=>y===x.toUpperCase() && yi>=i-1000 && yi<=i+1000).length
        result+=mentors
    }
}

for(const [i,x]of middle.entries()){
    if(i>m[1])break;
    if(i>=m[0] && x===x.toLowerCase()){
        let mentors = middle.filter((y,yi)=>y===x.toUpperCase() && yi>=i-1000 && yi<=i+1000).length
        result2+=mentors
    }
}

for(const [i,x]of end.entries()){
    if(i>=e[0] && x===x.toLowerCase()){
        let mentors = end.filter((y,yi)=>y===x.toUpperCase() && yi>=i-1000 && yi<=i+1000).length
        result3+=mentors
    }
}

let answer = result+(998*result2)+result3
let t4=performance.now()

console.log(result,result2,result3)
console.log(answer) // Part 3 answer
console.log(t4-t3,"ms") // 3573ms