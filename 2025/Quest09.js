const fs = require('fs');
const input1 = fs.readFileSync('../inputs/everybody_codes/2025/quest9_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../inputs/everybody_codes/2025/quest9_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../inputs/everybody_codes/2025/quest9_3.txt',{ encoding: 'utf8', flag: 'r' });

const similarity = (input,partNo) => {
    let lines = input.split(/[\r\n]/).map((x)=>x.split(':').map((y,yi)=>yi===0?parseInt(y):y.split('')))

    let result = []
    let families = []

    for(const [li,[id,scale]] of lines.entries()){
        let others = lines.filter((x,ix)=>ix!==li).map(([xId,xscale],ix)=>[xId,xscale.map((y,yi)=>y===scale[yi]?1:0)])
        
        let matching=others.filter(([xId,xscale],i,a)=>{
            return a.some(([rId,rscale],rx)=> rx !== i && xscale.every((xv,xi)=>xv===1 || rscale[xi]===1))
        }).map(([xId,xscale])=>[xId,xscale.reduce((a,c)=>a+c)])

        if(matching.length>0){
            result.push(matching[0][1]*matching[1][1])

            if(partNo){                
                families.push(new Set([id,matching[0][0],matching[1][0]]))
            }
        }
    }
    
    if (!partNo) return result.reduce((a,c)=>a+c);

    // Part 3
    while(families.some((x,i,a)=>a.some((y,yi)=>yi!==i &&!x.isDisjointFrom(y)))){
    
        let newFamilies = []
    
        families.forEach((x,i,a)=>{
                let famIndex = newFamilies.findIndex((f)=>!x.isDisjointFrom(f))
        
                if(famIndex!==-1){
                    newFamilies[famIndex]=newFamilies[famIndex].union(x)
                } else {
                    newFamilies.push(x)
                }
        })
    
        families = newFamilies
    }

    return Math.max(...families.map((x)=>[...x.values()].reduce((a,c)=>a+c)))
}

console.log(similarity(input1))
console.log(similarity(input2))
console.log(similarity(input3,3))