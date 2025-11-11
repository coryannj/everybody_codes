const { dir, group } = require('console');
const fs = require('fs');
const input1 = fs.readFileSync('../inputs/everybody_codes/2024/quest15_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../inputs/everybody_codes/2024/quest15_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../inputs/everybody_codes/2024/quest15_3.txt',{ encoding: 'utf8', flag: 'r' });

// Part 1

const parseGrid = (g) => {
    let grid = g.replaceAll('~',"#").split(/[\r\n]+/).map((x)=>x.split(''))

    let output = {
        "gridArr": grid,
        "rowLen": grid.length,
        "colLen": grid[0].length,
        "rowFactor": Math.pow(10,Math.ceil(Math.log10(grid[0].length))),
        "colFactor": 1 
    }

    let gridMap = new Map()

    for (const [rowInd,row] of grid.entries()){
        for (const [colInd,val] of row.entries()){
            //if(val !== "#"){
                gridMap.set((rowInd*output.rowFactor)+(colInd*output.colFactor),val)
            //}
            
        }
    }

    output['gridMap'] = gridMap

    return output
}

let grid = parseGrid(input3)

//console.log(grid)

let segmentRows = grid.gridArr.map((x,i)=>[i,x]).filter(([ind,x])=>x.filter((y)=>y!=='#').length <10).map((x)=>x[0]).slice(0,-1)

console.log(segmentRows)
//console.log(segmentRows.map((x)=>x/grid.rowFactor))



//let [startInd,startVal] = grid.gridMap.entries().find(([i,v])=> v === "S")
//let [endInd,endVal] = grid.gridMap.entries().find(([i,v])=> v === "E")
let visited = []

const findDeadEnds = (ind) => grid.gridMap.get(ind) === '#'
const onPath = ([ind,dir]) => !visited.includes(ind) && grid.gridMap.get(ind) !== '#'

const nextStep = (mapInd,filterFn) => {
    let next = [
        [-grid.rowFactor,"N"],
        [grid.rowFactor,"S"],
        [grid.colFactor,"E"],
        [-grid.colFactor,"W"]
    ].map(([ind,dir])=>[mapInd+ind,dir]).filter(([ind,dir])=>!!grid.gridMap.get(ind))

    if(filterFn !== undefined) next = next.filter((x)=>filterFn(x));
    
    return next
}

let deadends = [...grid.gridMap.entries()].filter(([i,v])=> v === '.' && !segmentRows.includes(Math.floor(i/grid.rowFactor))).filter((x)=>nextStep(x[0],onPath).length<2)

while(deadends.length>0){
    console.log(deadends.length)
    for(const[i,v] of deadends){
        grid.gridMap.set(i,"#")
        grid.gridArr[Math.floor(i/grid.rowFactor)][i%grid.rowFactor]="#"
    }

    deadends = [...grid.gridMap.entries()].filter(([i,v])=> v === '.' && !segmentRows.includes(Math.floor(i/grid.rowFactor))).filter((x)=>nextStep(x[0],onPath).length<2)
}

grid.gridArr.forEach((x)=>console.log(x.join('')))
let segments = segmentRows.map((x,i,a)=>i<a.length-1?[x,a[i+1]]:[x,x])
console.log(segments)

// Remove all nodes which are '#'

//For each segment
// - does segment have herbs
//      - Yes - BFS from all herbs to start/exit (or just start if start === exit)
//      - No - BFS from all start to all exit and retain shortest combos

// BFS from start and exit only
// If more than 2 types of herbs BFS between all types in segment

// Track not just visited, but dist + node
// if path includes some other herbs - remove from queue and slice existing path
 

let lines1 = input1.split(/[\r\n]+/).map((x)=>x.split(''))

let startRow = 0
let startCol = lines1[0].indexOf('.')
let queue = [[startRow,startCol]]
let distance = 0
let seen = [`${startRow}|${startCol}`]

while(!queue.some(([qr,qc])=>lines1[qr][qc]==='H')){
    let nextQueue = []
    queue.forEach(([r,c])=>{

        [[r+1,c],[r-1,c],[r,c+1],[r,c-1]].filter(([nr,nc])=>0 <= nr && nr < lines1.length && 0 <= nc && nc <= lines1[0].length && lines1[nr][nc] !== '#' && !seen.includes(`${nr}|${nc}`)).forEach((x)=>{
            nextQueue.push(x)
            seen.push(x.join('|'))
        })

    })

    queue = nextQueue
    distance++
    
}

console.log(distance*2)

// Part 2
let lines2 = input2.split(/[\r\n]+/).map((x)=>x.split(''))

let startRow2 = 0
let startCol2 = lines1[0].indexOf('.')
let herbs = lines2.flatMap((x,ix)=>x.flatMap((y,yx)=>!'#.'.includes(y) ? [y,[ix,yx]]:[]))


let queue2 = [[startRow,startCol]]
let distance2 = 0
let seen2 = [`${startRow}|${startCol}`]

while(!queue.some(([qr,qc])=>lines1[qr][qc]==='H')){
    let nextQueue = []
    queue.forEach(([r,c])=>{

        [[r+1,c],[r-1,c],[r,c+1],[r,c-1]].filter(([nr,nc])=>0 <= nr && nr < lines1.length && 0 <= nc && nc <= lines1[0].length && lines1[nr][nc] !== '#' && !seen.includes(`${nr}|${nc}`)).forEach((x)=>{
            nextQueue.push(x)
            seen.push(x.join('|'))
        })

    })

    queue = nextQueue
    distance++
    
}



// let gates = lines1.flatMap((x,ix)=>x.join('').includes('########') ? x.flatMap((y,yx)=>y==='.' ?[[ix,yx]]:[]):[])
// console.log([...new Set(gates.map((x)=>x[0]))])