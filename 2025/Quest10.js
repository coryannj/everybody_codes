const fs = require('fs');
const input1 = fs.readFileSync('../inputs/everybody_codes/2025/quest10_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../inputs/everybody_codes/2025/quest10_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../inputs/everybody_codes/2025/quest10_3.txt',{ encoding: 'utf8', flag: 'r' });

const parseGrid = (input) => {
    let lines = input.split(/[\r\n]/).map((x)=>x.split(''))
    let dr = lines.findIndex((x)=>x.includes('D'))
    let dc = lines[dr].indexOf('D')
    
    let resultObj = {
        grid: lines,
        rowLen: lines.length,
        colLen: lines[0].length,
        dragon: [dr,dc]
    }

    return resultObj
}

const moveDragon = ([r,c],gridArr) => [[-2,-1],[-2,1],[2,1],[2,-1],[1,-2],[-1,-2],[1,2],[-1,2]].flatMap(([nr,nc])=> gridArr?.[r+nr]?.[c+nc] ? [[r+nr,c+nc]] :[]);

// Part 1
const eatSheepP1 = (input,rounds) =>{
    let grid = parseGrid(input)
    let counter = 0
    let dSeen = {}
    dSeen[grid.dragon.join('-')]=1
    let dQueue = [grid.dragon.join('-')]

    while(counter<rounds){
        let nextQueue = []
        
        while(dQueue.length>0){
            let dmove = moveDragon(dQueue.shift().split('-').map(Number),grid.grid)
            
            dmove.forEach((x)=>{
                if(!nextQueue.includes(x.join('-'))) nextQueue.push(x.join('-'));
                
                dSeen[x.join('-')]=1;
            }) 
        }
        dQueue = nextQueue;
        counter++;
    }

    return Object.keys(dSeen).map((x)=>{let [r,c]=x.split('-').map(Number);return grid.grid[r][c]==='S'?1:0}).reduce((a,c)=>a+c)
}

console.log(eatSheepP1(input1,4)) // Part 1 answer

// Part 2
const eatSheepP2 = (input,rounds) => {
    let grid = parseGrid(input)
    let counter = 0
    let queue = [grid.dragon]
    let sheepGrid = grid.grid.map((x)=>x.map((y)=>y!=='S'?'.':y))
    let newLine = Array(grid.grid[0].length).fill('.')
    let sheep = 0

    while(counter<rounds){
        let nextQueue = []
        let inQueue = {}
    
        while(queue.length>0){
            let [r,c] = queue.shift()
        
            moveDragon([r,c],grid.grid).filter(([nr,nc])=>!inQueue[`${nr}-${nc}`]).forEach(([nr,nc])=>{
                let nKey = `${nr}-${nc}`;
                if(grid.grid[nr][nc]!=='#' && sheepGrid[nr][nc]==="S"){
                    sheep++;
                    sheepGrid[nr][nc]='.';
                }
                inQueue[nKey]=1;
                nextQueue.push([nr,nc]);
            })
        }

        sheepGrid.pop()
        sheepGrid.unshift(newLine)

        nextQueue.forEach(([nr,nc])=>{
            if(grid.grid[nr][nc]!=="#" && sheepGrid[nr][nc]==="S"){
                sheep++
                sheepGrid[nr][nc]='.'
            }
        })
    
        queue = nextQueue;
        counter++;;
    }

    return sheep
}

console.log(eatSheepP2(input2,20)) // Part 2 answer

//Part 3
let 
    p3 = parseGrid(input3),
    colmap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    pawns = [],
    pawnMoves = {} 

// Adjacency list for Pawns (sheep)
for(p=0;p<p3.colLen;p++){
    let col = p3.grid.map((lr)=>lr[p]);
    let lastSafe = col.findLastIndex((ls)=>ls !== "#");

    if(col[0]==='S'){
        pawns.push(`${colmap[p]}1${p3.grid[0][p]}`); // start position

        if(lastSafe>0){
            col.slice(0,lastSafe+1).forEach((x,i,a)=>{
                if(i<a.length-1){
                    let key = `${colmap[p]}${i+1}${p3.grid[i][p]}`;
                    pawnMoves[key] = `${colmap[p]}${i+2}${p3.grid[i+1][p]}`;
                }
            })
        }
    }
}

// Adjacency list for Knight (dragon)
let knightMoves = {} 

for(i=0;i<p3.rowLen;i++){
    for(j=0;j<p3.colLen;j++){
        knightMoves[`${colmap[j]}${i+1}${p3.grid[i][j]}`]=[];

        moveDragon([i,j],p3.grid).map(([r,c])=>`${colmap[c]}${r+1}${p3.grid[r][c]}`).forEach((n)=>{
            knightMoves[`${colmap[j]}${i+1}${p3.grid[i][j]}`].push(n);
        })
    }
}

// Get unique paths
let startArr = [pawns,`${colmap[p3.dragon[1]]}${p3.dragon[0]+1}D`,'D'];
let cache = new Map();

const eatSheep = ([pawns,knight,lastTurn]) =>{

    let cacheKey = [pawns.join('-'),knight,lastTurn].join('|');

    if(cache.has(cacheKey)) return cache.get(cacheKey);
    
    let ans = 0

    if(lastTurn === 'D'){
        if(pawns.every((pos)=>pawnMoves?.[pos] && pawnMoves[pos]===knight && knight.slice(-1) !== "#")) {
            ans+=eatSheep([pawns,knight,'S']) // Skip turn - no legal moves
        } else if(pawns.every((pos)=>pawnMoves[pos] === undefined || (pawnMoves[pos]===knight && knight.slice(-1) !== "#"))){
            ans=0 // Only legal move is to move sheep off board/or to run of hideouts
        } else {
            pawns.map((x)=>pawnMoves[x]).forEach((x,i)=>{
                if(x!== undefined){
                    if((x === knight && knight.slice(-1) === "#")||(x!== knight)){
                        ans+=eatSheep([pawns.map((y,yi)=>i===yi?x:y),knight,'S'])
                    }
                }
            })
        }
    } else if (lastTurn === 'S'){
        knightMoves[knight].forEach((x,i)=>{
            if(x.slice(-1) === "#" || (x.slice(-1) !== "#" && !pawns.includes(x))){
                ans+=eatSheep([pawns,x,'D']) // No sheep eaten
            } else {
                if(pawns.length === 1){
                    ans+=1 // Last sheep eaten
                } else {
                    ans+=eatSheep([pawns.toSpliced(pawns.indexOf(x),1),x,'D']) // Remove eaten sheep
                }
            }
        })
    }

    cache.set(cacheKey,ans);

    return ans
}

console.log(eatSheep(startArr)) // Part 3 answer