const { dir, group } = require('console');
const { on } = require('events');
const fs = require('fs');
const input1 = fs.readFileSync('../quest19_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../quest19_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../quest19_3.txt',{ encoding: 'utf8', flag: 'r' });

// Part 1
let lines1 = input1.split(/[\r\n]+/)
let key1 = lines1[0].split('')
let grid1 = lines1.slice(1).map((x)=>x.split(''))


function message(key,grid){
    let rowLen = grid.length-1
    let colLen = grid[0].length-1
    let keyLen = key.length
    let counter = 0
    
    for(i=1;i<rowLen;i++){
        for(j=1;j<colLen;j++){
            let nextKey = key[counter%keyLen]
            let [r,c] = [i,j]
    
            let surrounding = [[r-1,c-1],[r-1,c],[r-1,c+1],[r,c+1],[r+1,c+1],[r+1,c],[r+1,c-1],[r,c-1]]
    
            let vals = surrounding.map(([sr,sc])=>grid[sr][sc])
            if(nextKey === 'R'){
                let v = vals.pop()
                vals.unshift(v)
            } else {
                let v = vals.shift()
                vals.push(v)
            }
    
            surrounding.forEach(([sr,sc],sidx)=>{
                grid[sr][sc] = vals[sidx]
            })
            counter++
    
        }
    }

    return grid
}

console.log(message(key1,grid1).find((x)=>x[0] === '>' && x.at(-1)==='<').slice(1,-1).join(''))

// Part 2
let lines2 = input2.split(/[\r\n]+/)
let key2 = lines2[0].split('')
let grid2 = lines2.slice(1).map((x)=>x.split(''))
let rounds = 100

while(rounds>0){
    grid2 = message(key2,grid2)
    rounds--
}

let result2 = grid2.find((x)=>x.includes('>')&& x.includes('<'))

console.log(result2.slice(result2.indexOf('>')+1,result2.indexOf('<')).join(''))

// Part 3
let lines3 = input3.split(/[\r\n]+/);
let key3 = lines3[0].split('');
let grid3Vals = lines3.slice(1).map((x)=>x.split(''));
let grid3 = Array(grid3Vals.length).fill('.').map((x,ix)=>Array(grid3Vals[0].length).fill('.').map((y,yx)=>`${ix}-${yx}`));
let allElements = grid3.flat();
let allLen = allElements.length;
let loopFound = {};
let rounds3 = 1048576000;
let loopCount = 0
let homeObj = Object.fromEntries(grid3.flatMap((x)=>x.map((y)=>[y,{'val':grid3Vals[y.split('-')[0]][y.split('-')[1]],'keys':[y]}])));

const gridLookup = (gridKey) => {
    let [r,c] = gridKey.split('-').map(Number);
    return grid3[r][c]
}

while(loopCount<allLen){
    grid3 = message(key3,grid3);

    Object.keys(homeObj).filter((k)=>!loopFound[k]).forEach((k)=>{
        if(k === gridLookup(k)){
            loopFound[k] = true;
            loopCount++
        } else {
            homeObj[k]['keys'].push(gridLookup(k));
        }
    })
}

let newGrid = Array(grid3.length).fill('.').map((x,ix)=>Array(grid3[0].length).fill('.').map((y,yx)=>homeObj[homeObj[`${ix}-${yx}`]['keys'][rounds3%homeObj[`${ix}-${yx}`]['keys'].length]]['val']))

let result3 = newGrid.find((x)=>x.includes('>')&& x.includes('<'))
console.log(result3.slice(result3.indexOf('>')+1,result3.indexOf('<')).join(''))