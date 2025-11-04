const { dir, group } = require('console');
const { on } = require('events');
const fs = require('fs');
const input1 = fs.readFileSync('../quest17_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../quest17_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../quest17_3.txt',{ encoding: 'utf8', flag: 'r' });

// Part 1
const manhattan = ([r1,c1],[r2,c2])=> Math.abs(r2-r1)+Math.abs(c2-c1)

const tree = (distObj,startNode) => {
    let start = startNode === undefined ? Object.keys(distObj)[0] : startNode
    let visited = [start]
    let mst = []
    let queue = Array(200).fill('.').map((x)=>[])

    Object.entries(distObj[start]).forEach(([k,v])=>{
        queue[v].push([start,k,v])
    })

    while(queue.findIndex((x)=>x.some((y)=>!visited.includes(y[1])))!==-1){
        let next = queue[queue.findIndex((x)=>x.some((y)=>!visited.includes(y[1])))].shift()

        if(visited.includes(next[1])){
            continue;
        } else {
            visited.push(next[1])
            mst.push(next)
            Object.entries(distObj[next[1]]).forEach(([k,v])=>{
                if(!visited.includes(k))queue[v].push([next[1],k,v])
            })
    
            
        }
    }

    return mst.length===0 ? [0,[]] : [mst.map((x)=>x[2]).reduce((acc,curr)=>acc+curr)+visited.length,visited]
}

function prims(input,partNo){
    let lines = input.split(/[\r\n]+/).map((x)=>x.split('')).flatMap((x,ix)=>x.flatMap((y,yx)=>y==='*'?[[ix,yx]]:[]))

    let distances = {}

    lines.forEach(([r,c],ix,arr)=>{
        let rest
        if(partNo<3){
            rest = arr.filter((y,yx)=>yx!==ix).map(([yr,yc])=>[`${yr}-${yc}`,manhattan([r,c],[yr,yc])]).sort((a,b)=>a[1]-b[1])
        } else {
            rest = arr.filter(([yr,yc],yx)=>yx!==ix && manhattan([r,c],[yr,yc])<6).map(([yr,yc])=>[`${yr}-${yc}`,manhattan([r,c],[yr,yc])]).sort((a,b)=>a[1]-b[1])
        }

        distances[`${r}-${c}`] = Object.fromEntries(rest)
    })

    if(partNo<3){
        return tree(distances)[0]
    } else {
        let visited = []
        let next = Object.entries(distances).filter(([k,v])=>!visited.includes(k)).sort((a,b)=>Object.keys(b[1]).filter((x)=>!visited.includes(x)).length-Object.keys(a[1]).filter((v)=>!visited.includes(v)).length)
 
        let galaxies = []

        for(i=0;i<3;i++){
            let [size,lastvisited] = tree(distances,next[0][0]);
            visited.push(...lastvisited);
            galaxies.push(size);

            next = Object.entries(distances).filter(([k,v])=>!visited.includes(k)).sort((a,b)=>Object.keys(b[1]).filter((x)=>!visited.includes(x)).length-Object.keys(a[1]).filter((v)=>!visited.includes(v)).length)
        }

        return galaxies.reduce((acc,curr)=>acc*curr,1)
    }

}

console.log(prims(input1,1))
console.log(prims(input2,2))
console.log(prims(input3,3))



