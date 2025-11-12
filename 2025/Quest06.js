const fs = require('fs');
const input1 = fs.readFileSync('../inputs/everybody_codes/2025/quest6_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../inputs/everybody_codes/2025/quest6_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../inputs/everybody_codes/2025/quest6_3.txt',{ encoding: 'utf8', flag: 'r' });

let list = input1.split('')
let list2 = input2.split('')

// Part 1 and 2
console.log(list.filter((x)=>x==='a'||x==='A').map((x,i,a)=>x===x.toLowerCase()?a.filter((y,yi)=>yi<i && y===x.toUpperCase()).length:x).filter((x)=>typeof(x)==='number').reduce((a,c)=>a+c)) // Part 1

console.log(list2.map((x,i,a)=>x===x.toLowerCase()?a.filter((y,yi)=>yi<i && y===x.toUpperCase()).length:x).filter((x)=>typeof(x)==='number').reduce((a,c)=>a+c)) // Part 2

// Gross Part 3 implementation I did my first time
let list3 = input3.split('')


let test = [...list3,...list3.slice(0,1000)].map((x,i,a)=> x===x.toLowerCase()?a.map((z,zi)=>[z,zi]).filter((y,yi)=>yi>=i-1000 && yi<=i+1000 && y[0]===x.toUpperCase()):x)

let f1000 = 0
let l1000 = 0

test.forEach((x,i)=>{
    if(typeof(x)==='object'){
        let ff = x.filter((y)=>y[1]<=9999)
        let ll = x.filter((z)=>z[1]>9999)
        f1000+=ff.length
        l1000+=ll.length
        // if(i>=9000){
        //     console.log()
        //     console.log("======= NEW LINE ========")
        //     console.log(i)
        //     console.log(f1000, "ff length ",ff.length )
        //     console.log(l1000, "ll length ", ll.length)
        //     console.log(f1000+l1000)
        // }

    }
})

console.log(f1000,l1000)


console.log('first 1000 counts',list3.slice(0,1000).reduce((a, c) => {return a[c] ? ++a[c] : a[c] = 1, a}, {}))
console.log('last 1000 counts',list3.slice(-1000).reduce((a, c) => {return a[c] ? ++a[c] : a[c] = 1, a}, {}))

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
console.log(result,result2,result3)
console.log(result+(998*result2)+result3)

// Slightly better Part 3 implementation

// Not generalised - only works because p3 input is more than the distance limit
let len = list3.length
let limit = 1000
let repeats = 1000
let deltaInd = len-limit //9000


// When index between 0-999 we're going to separately track the mentors in prev segment vs this segment
// When index between 1000-8999 all mentors are in current segment
// When index between 9000-9999 we're going to separately track the mentors in next segment vs this segment
// Answer will be (this segment + next segment) + (998* (prev segment + this segment + next segment)) + (prev segment + this segment) = (1000 * this segment) + (999 * prev segment) + (999 * next segment)

let 
    endCount = {"A":0,"B":0,"C":0,"a":0,"b":0,"c":0}, 
    endArr=[],
    startCount = {"A":0,"B":0,"C":0,"a":0,"b":0,"c":0},
    startArr=[],
    prevSeg=[...list3.slice(-1000)],
    thisSeg=[...list3],
    nextSeg=[...list3.slice(0,1000)]



    //segments = [...list3.slice(-1000),...list3,...list3.slice(0,1000)]

//38953
//43814



let startDelta = 0
let endDelta = 0

for(i=0;i<limit;i++){

    let s = list3[i]
    startCount[s]++

    let e = list3[len-limit+i]
    endCount[e]++

    if(s===s.toLowerCase()) endDelta+=endCount[s.toUpperCase()];
    if(e===e.toLowerCase()) startDelta+=startCount[e.toUpperCase()]

    //console.log('pVal is ',pVal," result is ",resultp3)
    //console.log(prevCount,prevArr)
    //console.log(nextCount,nextArr)
    if(i<20){
        console.log(i,s,e,startDelta,endDelta)
        //console.log(s,e,endDelta,endCount)
        console.log(e,s,startDelta,startCount)
        // console.log(startCount)
        // console.log(endCount)
    }
    
}
console.log(startDelta,endDelta)
console.log(startCount,endCount)

let middleCount = 0
//let mPrev = {"A":0,"B":0,"C":0,"a":0,"b":0,"c":0}
let mPrev = endCount
let mNext = startCount

let s3 = 0
let m3 = 0
let e3 = 0

for(j=0;j<len;j++){
    let val = list3[j]
    mNext[val] > 0 ? mNext[val]-- : ""
    
    //if(j<deltaInd) mNext[list3[j+limit]]++
    mNext[list3[(j+limit)%len]]++
    //mNext?.[list3?.[j+limit]]++

    if(val===val.toLowerCase()){
        middleCount+=(mNext[val.toUpperCase()]+mPrev[val.toUpperCase()])
        if(j<1000){
            s3+=(mNext[val.toUpperCase()]+mPrev[val.toUpperCase()])
        }else if(j>=1000 && j<=8999){
            m3+=(mNext[val.toUpperCase()]+mPrev[val.toUpperCase()])
        } else {
            e3+=(mNext[val.toUpperCase()]+mPrev[val.toUpperCase()])
        }
    } 
    
    // if(j>9950){
    //     console.log(j, val, middleCount)
    //     console.log(mPrev,mNext)
    //     console.log(j-limit,j+limit)
    // }


    mPrev[val]++
    //if(j>=limit){
        let prevInd= j-limit

        mPrev[list3.at(prevInd)]>0 ? mPrev[list3.at(prevInd)]-- : ""
    //} 

    

    // if(j>9950){
    //     console.log(j,middleCount)
    //     console.log(mPrev,mNext)
    //     console.log(j-limit,j+limit)
    // }

}
console.log("answer",middleCount,((middleCount-startDelta-endDelta)*1000)+(startDelta*999)+(endDelta*999))
console.log(s3, m3, e3)

// 1665657209
//1621902 1665740 1626787
//38953 43814
console.log((1665740-1621902),(1665740-1626787))




console.log(1665657209-1665657233)
console.log((1000*1665740)-38953-43814)
console.log(1665740-1621902)
console.log(1665740-1626787)
console.log([38953,43814].map((x)=>x*999))
console.log(1621902-38953)
console.log(1621902-43814)
console.log(1626787-43814) //
console.log(1665740-38953-43814) //
console.log(1665740-38953)
console.log(1665740-43814)
console.log(1665657209-38914047-43770186)
console.log(Math.round(1582972976/1000))

console.log((1582973*1000)+(999*38953)+(999*43814))

console.log(1665740-38953-43814)
console.log(38914047/999)
console.log(43770186/999)

let a = BigInt(1582973)

console.log(1582973*1000,a*BigInt(1000),1665740*998)
console.log(1665657209-(1665740*998))
console.log(1665740-38953,1665740-43814,1665740-38953-43814)
console.log(1665657209-1662408520)