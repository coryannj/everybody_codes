const fs = require('fs');
const input1 = fs.readFileSync('../../inputs/everybody_codes/2026/the_digital_atelier/quest1_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../../inputs/everybody_codes/2026/the_digital_atelier/quest1_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../../inputs/everybody_codes/2026/the_digital_atelier/quest1_3.txt',{ encoding: 'utf8', flag: 'r' });

const noOverlap = ([x1,y1],[x2,y2]) => x1 < x2 && y1 > y2 || x2 < x1 && y2 > y1 || x2 > y1 || y2 < x1

const goBackwards = (curr,jump,seen,jumps,partNo) => {
    return curr-jump > 0 && !seen.has(curr-jump) && (partNo < 3 || jumps.length === 0 || jumps.every((j)=> noOverlap(j,[curr-jump,curr]))) ? [true,curr-jump] : [false,-1]
}

const goForwards = (curr,jump,seen,jumps,partNo) => {
    if(partNo === 1 || (partNo === 2 && !seen.has(curr+jump)) || (partNo === 3 && jumps.length === 0)) return [true,curr+jump]

    if(partNo === 2){
        while(seen.has(curr+jump)){
            jump++
        }
        return [true,curr+jump]
    } else {
        if(!jumps.some((j)=>j.includes(curr))){
            let max = jumps.findLast(([a,b])=> a < curr && b > curr)?.[1] || Infinity

            while(seen.has(curr+jump) || jumps.some(([a,b])=>!noOverlap([a,b],[curr,curr+jump]))){
                jump++
                if(curr+jump >= max) break;
            }

            if(curr+jump<max) return [true,curr+jump]
        }
        
        return [false,-1]
    }
}

const solve = (input,partNo) => {
    let lines = input.split(/[\r\n]/).map((x)=>x.split(/[,]/g).map(Number))
    let total = 0
    for (const line of lines){
        let curr = 0
        let count = 0
        let allJumps = [[],[]]
        let seen = new Set([curr])

        for (const jump of line){
            let canGoBack,canGoForward,newCurr

            [canGoBack,newCurr] = goBackwards(curr,jump,seen,allJumps[count%2],partNo)

            if(!canGoBack){
                [canGoForward,newCurr] = goForwards(curr,jump,seen,allJumps[count%2],partNo)
            }

            if(canGoBack || canGoForward){
                allJumps[count%2].push([curr,newCurr].sort((a,b)=>a-b))
                allJumps[count%2].sort(([x1,y1],[x2,y2])=>x1-x2)
                seen.add(newCurr)
                curr = newCurr
                count++
            }
        }
        //console.log(curr)
        total+=curr
    }
    
    return total

}

console.log(solve(input1,1))
console.log(solve(input2,2))
console.log(solve(input3,3))