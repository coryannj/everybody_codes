const { dir, group } = require('console');
const fs = require('fs');
const input1 = fs.readFileSync('../quest14_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../quest14_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../quest14_3.txt',{ encoding: 'utf8', flag: 'r' });

// Part 1
let lines1 = input1.split(',').flatMap((x)=>{
    if('UD'.includes(x[0])){
        return x[0]==='U' ? [parseInt(x.slice(1))] : [parseInt(-1*x.slice(1))]
    } else {
        return []
    }
}).map((sum = 0, n => sum += n))

console.log(Math.max(...lines1))

// Part 2
function makeTree(input){
    let lines = input.split(/[\r\n]+/).map((x)=>x.split(','))

    let all = new Set()
    let allLeaves = []

    lines.forEach((line)=>{
        let coOrd = [0,0,0]
        //let leaves = []
        line.forEach((inst)=>{
            let [dir,steps] = [inst[0],parseInt(inst.slice(1))];            
            let [x,y,z] = coOrd;
    
            for(let i=1;i<=steps;i++){
                let dirObj = {
                    'U':[x,y+i,z],
                    'D':[x,y-i,z],
                    'L':[x-i,y,z],
                    'R':[x+i,y,z],
                    'F':[x,y,z+i],
                    'B':[x,y,z-i]
                }
                coOrd = dirObj[dir];
                all.add(coOrd.join('|'));
            }
        })
        allLeaves.push(coOrd.join('|'))

    })

    return [all.size,[...all],allLeaves]
}

console.log(makeTree(input2)[0])

// Part 3
let [p3Size,p3Segments,p3Leaves] = makeTree(input3);

let trunk = p3Segments.filter((x)=>{
    let tSplit = x.split('|')
    return tSplit[0]==='0' && tSplit[2]==='0'
})

let trunkLen = trunk.length
let murkObj = Object.fromEntries(trunk.map((x)=>[x,0]))

p3Leaves.forEach((leaf)=>{
    let trunkDistance = {}
    let leafSeen = [leaf];
    let toTrunk = [leaf];
    let distance = 0;
    while(Object.keys(trunkDistance).length<trunkLen){
        let nextToTrunk = []
            
        toTrunk.forEach((t)=>{
            if(murkObj[t]!==undefined && !trunkDistance[t]){
                trunkDistance[t] = true
                murkObj[t]+=distance
            }
            [t.split('|').map(Number)].flatMap(([x,y,z])=>{
              return [`${x-1}|${y}|${z}`,`${x+1}|${y}|${z}`,`${x}|${y-1}|${z}`,`${x}|${y+1}|${z}`,`${x}|${y}|${z-1}`,`${x}|${y}|${z+1}`]
            }).filter((c)=>!leafSeen.includes(c) && p3Segments.includes(c)).forEach((nt)=>{
                if(!nextToTrunk.includes(nt)){
                    nextToTrunk.push(nt);
                    leafSeen.push(nt);
                }
            }) 
        })

        toTrunk = nextToTrunk
        distance++
    }
})

console.log(Math.min(...Object.values(murkObj)))

