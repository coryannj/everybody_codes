const { dir, group } = require('console');
const fs = require('fs');
const input1 = fs.readFileSync('../quest12_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../quest12_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../quest12_3.txt',{ encoding: 'utf8', flag: 'r' });

function destroyBlocks(input){
    const lines = input.split(/[\r\n]+/).map((x)=>x.split('').slice(1)).reverse().slice(1)
    let segments = {}
    let targets = []
    let segNum = '_ABC'
    
    lines.forEach((x,ix)=>{
        x.forEach((y,yx)=>{
            if(y!=='.'){
                if(y!=='T' && y!=='H'){
                    segments[y] = {"number":segNum.indexOf(y),"coOrd":[yx,ix],"targets":[]}
                } else {
                    targets.push([yx,ix,y])
                }
            }
        })
    })

    targets.sort((a,b)=>{
        if(a[1]===b[1]){
            return a[0]-b[0]
        } else {
            return b[1]-a[1]
        }
    })
    
    let maxcol = Math.max(...targets.map((x)=>x[0]))
    
    const shoot = (segmentKey,[x,y],segNumber) => {
        let power = 1
        let px,py
        do{
            [px,py] = [(2*power)+x,power+y]
    
            targets.flatMap(([tx,ty,tz],tidx)=>Math.abs(tx-px)===Math.abs(ty-py)?[[tidx,tz]]:[]).forEach((t)=>{
                segments[segmentKey]['targets'].push(t.concat(segNumber,power))
            })
            power++
        }while(px<=maxcol)
    }
    
    

    Object.entries(segments).forEach(([sKey,sVal])=>{
        shoot(sKey,sVal.coOrd,sVal.number)
    })

    let minHits = Array(targets.length).fill('.').map((x)=>999999)
    Object.values(segments).flatMap((x)=>x.targets).forEach(([tidx,tval,sNum,sPower])=>{
        let tsum = tval === 'T' ? sNum*sPower : sNum*sPower*2
        
        
        if(minHits[tidx]>tsum){
            minHits[tidx] = tsum
        }
    })
    
    return minHits.reduce((acc,curr)=>acc+curr)
}
console.log(destroyBlocks(input1))
console.log(destroyBlocks(input2))

// Part 3
let segments = new Map([[1,[0,0]],[2,[0,1]],[3,[0,2]]])
console.log(segments)

let rock = [3522,2594]
//console.log(rock.map((x)=>x/2))
console.log(3522/2)
console.log((2594-2)/2)

console.log([3522-1296,2594-2-1296])
console.log([3522-1762-50,2594-1762-50])
console.log([ 1710, 857 ])

console.log(880+880,2+880)

while(rock[0]>=0 && rock[1]>=0){
    rock[0]--
    rock[1]--
    console.log([rock[0],rock[1]])
}

let a = [[0,0],[1,1],[2,2],[]]

let power = 1
while(true){
    let r = [0,2]
    
    r[0] = (2*power)+r[0]
    r[1] = power+r[1]
    console.log(power,r)
    power++
}