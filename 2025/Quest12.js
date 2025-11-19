const fs = require('fs');
const input1 = fs.readFileSync('../inputs/everybody_codes/2025/quest12_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../inputs/everybody_codes/2025/quest12_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../inputs/everybody_codes/2025/quest12_3.txt',{ encoding: 'utf8', flag: 'r' });

const explode = (input,partNo) => {
    let grid = input.split(/[\r\n]/).map((x)=>x.split('').map((y)=>parseInt(y)))

    let start = [0,0]
    let end = [grid.length-1,grid[0].length-1]
    let maxObj = {}
    let dqueue

    if(partNo===1){
        dqueue = [start]
    } else if (partNo===2){
        dqueue = [start,end]
    } else {
        dqueue = grid.map((r,ri)=>r.map((c,ci)=>[ri,ci])).flat().filter(([nr,nc])=>grid[nr][nc]>2)
    }

    while(dqueue.length>0){
        let first = dqueue.shift()
        let queue = [first]
        let seen = new Set(queue.map((x)=>x.join('-')))

        const next = ([r,c]) => [[r+1,c],[r-1,c],[r,c+1],[r,c-1]].filter(([nr,nc])=>!seen.has([nr,nc].join('-')) && grid?.[nr]?.[nc] !== undefined && grid[r][c]>=grid[nr][nc])

        while(queue.length>0){
            let t = queue.shift()
            let nextArr = next(t)

            nextArr.forEach((x)=>{
                seen.add(x.join('-'))
                queue.push(x)
            })
        }
        maxObj[first.join('-')] = seen
    }

    return maxObj
}

console.log(Object.values(explode(input1,1))[0].size) // Part 1
console.log(Object.values(explode(input2,2)).reduce((a,c)=>a.union(c)).size) // Part 2

// Part 3
let maxObj = explode(input3,3)
let maxObjSize = Math.max(...Object.values(maxObj).map((x)=>x.size))
let maxKey = Object.keys(maxObj).find((x)=>maxObj[x].size===maxObjSize)

let [nextMaxKey,nextMaxSet] = Object.entries(maxObj).filter((x)=>x[0]!==maxKey).map(([k,set])=>[k,set.union(maxObj[maxKey])]).sort((a,b)=>b[1].size-a[1].size)[0]

nextMaxSet = nextMaxSet.union(maxObj[maxKey])

let [nextNextMaxKey,nextNextMaxSet] = Object.entries(maxObj).filter((x)=>x[0]!==maxKey && x[0]!==nextMaxKey).map(([k,set])=>[k,nextMaxSet.union(set)]).sort((a,b)=>b[1].size-a[1].size)[0]

console.log(nextMaxSet.union(nextNextMaxSet).size) // Part 3