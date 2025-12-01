const fs = require('fs');
const { runInNewContext } = require('vm');
const input1 = fs.readFileSync('../inputs/everybody_codes/2025/quest20_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../inputs/everybody_codes/2025/quest20_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../inputs/everybody_codes/2025/quest20_3.txt',{ encoding: 'utf8', flag: 'r' });

const parse = (input) => {
    let lines = input.split(/[\r\n]/)
    let rowLen = lines.length
    let collen = lines[0].length
    let adj = {}

    for(i=0;i<rowLen;i++){
        for(j=0;j<collen;j++){
            let v = lines[i][j];
            if(v!=='.' && v!=='#'){
                let d = i%2 === j%2 ? 'D' : 'U'
                let key = `${i}-${j}-${v}-${d}`
                let n = new Set()

                // Left/right neighbours
                if(j-1>=0 && !'.#'.includes(lines[i][j-1])){
                    d ==='D' ? n.add(`${i}-${j-1}-${lines[i][j-1]}-U`) : n.add(`${i}-${j-1}-${lines[i][j-1]}-D`)
                } 
                if(j+1<collen && !'.#'.includes(lines[i][j+1])){
                    d ==='D' ? n.add(`${i}-${j+1}-${lines[i][j+1]}-U`) : n.add(`${i}-${j+1}-${lines[i][j+1]}-D`)
                }
                
                // Up/down neighbours
                if(d==='U' && i+1<rowLen && !'.#'.includes(lines[i+1][j])) n.add(`${i+1}-${j}-${lines[i+1][j]}-D`);

                if(d==='D' && i-1>=0 && !'.#'.includes(lines[i-1][j])) n.add(`${i-1}-${j}-${lines[i-1][j]}-U`);
                
                if(n.size>0) adj[key]=n ;
            }
        }
    }

    return adj
}

let p1map = parse(input1)

console.log('Part 1 answer is ',Object.keys(p1map).flatMap((x)=>x.slice(-1)==='U' ? [p1map[x].size] : []).reduce((a,c)=>a+c))


// Part 2
let
    p2map = parse(input2),
    p2startKey = Object.keys(p2map).find((x)=>x.split('-')[2]==='S'),
    p2endKey = Object.keys(p2map).find((x)=>x.split('-')[2]==='E'),
    p2queue = new Set([p2startKey]),
    p2jumps = 0,
    p2seen = new Set(p2queue)





do{
    p2seen = p2seen.union(p2queue);
    p2queue = p2queue.values().map((x)=>p2map[x]).reduce((a,c)=>a.union(c.difference(p2seen)),new Set());
    p2jumps++;
} while (!p2queue.has(p2endKey))

console.log('Part 2 answer is ',p2jumps)

// Part 3

let l = input3.split(/[\r\n]/).map((x)=>x.split('').filter((y)=>y!=='.'))

let len = l.length
let lastInd = len-1

l.forEach((x,xi)=>{
    x.forEach((y,yi)=>{
        
    })
})

let tMap = {}
console.log(l.flatMap((x,xi)=>x.map((y,yi)=>[Math.floor(yi/2),xi,yi%2,y])))

// L triangles
// bottom - U [x,y-1,1], R [x,y,1] L [x-1,y,1]
// left cnr U [x,y,1] R [x-1,y,1] L [x,y-1,1]
// right cnr U [x-1,y,1] R [x,y-1,1] L [x,y,1] 

// R triangles
// bottom - D [x,y+1,0], R [x+1,y,0] L [x,y,0]
// left cnr D [x,y,0], R [x,y+1,0], L [x+1,y,0]
// right cnr D [x+1,y,0] R [x,y,0], L [x,y+1,0]


// let
//     p3map = parse(input3),
//     p3startKey = Object.keys(p3map).find((x)=>x.split('-')[2]==='S'),
//     p3endKey = Object.keys(p3map).find((x)=>x.split('-')[2]==='E'),
//     p3queue = new Set([p3startKey]),
//     p3steps = 0,
//     seen = new Set(p3queue)

//     console.log(p3startKey,p3endKey)
//     console.log(p3map)