const fs = require('fs');
const input1 = fs.readFileSync('../inputs/everybody_codes/2025/quest8_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../inputs/everybody_codes/2025/quest8_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../inputs/everybody_codes/2025/quest8_3.txt',{ encoding: 'utf8', flag: 'r' });

// Part 1
let p1Max=32
let p1oppDist=p1Max/2
let p1threads = input1.split(',').map(Number);

console.log(p1threads.filter((x,i,a) => i<a.length-1 && Math.abs(x-a[i+1])===p1oppDist).length) // Part 1 answer

// Part 2 & 3
let 
    p2threads = input2.split(',').map(Number),
    p3threads = input3.split(',').map(Number),
    max=256,
    oppDist = max/2,
    circle = Array(max).fill(0).map((x,i)=>1+i)

let betweenList = {}

const findknots = (t,arr) => {
    let [p1,p2] = t
    let bKey = t.join('-')
    let between

    if(!betweenList[bKey]) betweenList[bKey] = circle.slice(p1-1,p2)
    
    between = betweenList[bKey];

    return arr.filter(([x1,x2])=>
        [x1,x2].every((y)=> y !== p1 && y !== p2) && 
        ((between.includes(x1) && !between.includes(x2))
        ||(!between.includes(x1) && between.includes(x2)))).length
}

// Part 2
let 
    p2pairs = p2threads.slice(0,-1).map((x,i)=>x<p2threads[i+1]? [x,p2threads[i+1]]:[p2threads[i+1],x]),
    p2knots = 0,
    p2seen = [p2pairs.shift()]

for (const p of p2pairs){
    p2knots+=findknots(p,p2seen);
    p2seen.push(p);
}

console.log(p2knots) // Part 2 answer

// Part 3
let
    p3pairs=p3threads.slice(0,-1).map((x,i)=>x<p3threads[i+1]? [x,p3threads[i+1]]:[p3threads[i+1],x]),
    p3cuts=0

for(i=1;i<max;i++){
    for(j=i+1;j<=max;j++){
        if(i===j||Math.abs(i-j)===1) continue;

        let p = [p1,p2] = i<j ? [i,j] : [j,i];
        
        let opp = p2-p1===oppDist ? 1:0

        let thisCuts = findknots(p,p3pairs)+opp;
    
        if(thisCuts>p3cuts) p3cuts=thisCuts;
    }

}

console.log(p3cuts) // Part 3 answer