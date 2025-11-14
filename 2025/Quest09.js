const fs = require('fs');
const input1 = fs.readFileSync('../inputs/everybody_codes/2025/quest9_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../inputs/everybody_codes/2025/quest9_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../inputs/everybody_codes/2025/quest9_3.txt',{ encoding: 'utf8', flag: 'r' });

const similarity = (input) => {
    let lines = input.split(/[\r\n]/).map((x)=>x.split(':').map((y,yi)=>yi===0?parseInt(y):y.split('')))

    let result = []

    for(const [li,[id,scale]] of lines.entries()){
        let others = lines.filter((x,ix)=>ix!==li).map(([xId,xscale],ix)=>[xId,xscale.map((y,yi)=>y===scale[yi]?1:0)])
        
        let matching=others.filter(([xId,xscale],i,a)=>{
            return a.some(([rId,rscale],rx)=> rx !== i && xscale.every((xv,xi)=>xv===1 || rscale[xi]===1))
        }).map(([xId,xscale])=>[xId,xscale.reduce((a,c)=>a+c)])

        if(matching.length>0){
            result.push([id,...matching])
        }
    }

    return result
}

console.log(similarity(input1)[0].filter((x,i)=>i>0).map((x)=>x[1]).reduce((a,c)=>a*c)) // Part 1

console.log(similarity(input2).map(([c,p1,p2])=>p1[1]*p2[1]).reduce((a,c)=>a+c)) // Part 2

// Part 3
let p3result = similarity(input3).map(([child,p1,p2])=>new Set([child,p1[0],p2[0]])) // create sets of ids

while(p3result.some((x,i,a)=>a.some((y,yi)=>yi!==i &&!x.isDisjointFrom(y)))){
    
    let families = []

    p3result.forEach((x,i,a)=>{
        if(families.length===0){
            families.push(x)
        } else {
            let famIndex = families.findIndex((fv)=>!x.isDisjointFrom(fv))
    
            if(famIndex!==-1){
                families[famIndex]=families[famIndex].union(x)
            } else {
                families.push(x)
            }
        }
    })

    p3result = families
}

console.log(Math.max(...p3result.map((x)=>[...x.values()].reduce((a,c)=>a+c)))) // Part 3 answer