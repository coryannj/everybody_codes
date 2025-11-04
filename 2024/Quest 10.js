const { dir, group } = require('console');
const fs = require('fs');
const input1 = fs.readFileSync('../quest10_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../quest10_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../quest10_3.txt',{ encoding: 'utf8', flag: 'r' });
const power = '.ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const grids1 = input1.split(/[\r\n]+/).map((x)=>x.split(''));
const grids2 = input2.split(/[\n]{2,}/).map((x)=>x.split(/[\r\n]+/).map((x)=>x.split(' '))).flatMap((row,rowidx,grid)=>row[0].map((y,yx,yarr)=>row.map((z)=>z[yx]))).map((x)=>x.map((y)=>y.split('')));
let grids3 = input3.split(/[\r\n]+/).map((x)=>x.split(''));

function getRunic(grid,partNo,r,c,checkArr){
    let startRC = 2, endRC = 6 
    let result = partNo < 3 || checkArr.length === 0 ? '' : checkArr[0]
    let toSolve = partNo < 3 || checkArr.length === 0 ? [] : checkArr[1]
    
    if(result === ''){
        for(i = startRC; i < endRC; i++){
            for(j = startRC; j < endRC; j++){
                let newVal = grid[i].filter((x)=> !'.?'.includes(x) && grid.map((y)=>y[j]).includes(x))[0]
                    
                if(newVal !== undefined){
                    result+=newVal;
                    if(partNo === 3){
                        grid[i][j] = newVal;
                        grids3[r+i][c+j] = newVal;
                    }
                } else {
                    result+='.';
                    toSolve.push([i,j,result.length-1]);
                }            
            }
        }

        if(partNo > 1) result = result.split('');
    }

    if(partNo < 3){
        return partNo === 1 ? result : result.map((x,ix)=>(ix+1)*power.indexOf(x)).reduce((acc,curr)=>acc+curr)
    } else {
        if(result.includes('.')){ // Check if we can solve question marks from this or prev loops

            toSolve.forEach(([tr,tc,trix],ix)=>{
                let cRow = grid[tr], cCol = grid.map((z)=>z[tc]), cqInd = cRow.indexOf('?'), rqInd = cCol.indexOf('?'), newVal
                
                if(cqInd === -1 && rqInd === -1){
                    newVal = cRow.filter((x)=> !'.?'.includes(x) && cCol.includes(x))[0] // Now no question marks
                } else {
                    let canSolve = cRow.filter((y,yx,yarr)=> !'.?'.includes(y) && yarr.indexOf(y)===yarr.lastIndexOf(y)).concat(cCol.filter((v,vx,varr)=>!'.?'.includes(v) && varr.indexOf(v)===varr.lastIndexOf(v)));
                    newVal = canSolve.length === 1 ? canSolve[0] : undefined;
                }
                
                if(newVal !== undefined){
                    grid[tr][tc] = newVal;
                    grids3[r+tr][c+tc] = newVal;
                    result[trix] = newVal;

                    if(cqInd !== -1){
                        grid[tr][cqInd] = newVal;
                        grids3[r+tr][c+cqInd] = newVal;
                    }
                    
                    if (rqInd !== -1) {
                        grid[rqInd][tc] = newVal;
                        grids3[r+rqInd][c+tc] = newVal;
                    }
                }
            })
            
            toSolve = toSolve.filter(([tr,tc,trix],ix)=>grid[tr][tc] === '.');
        }

        return [result,toSolve]
    }
}

// Part 1
console.log(getRunic(grids1,1))

// Part 2
let grids2Len = grids2.length, result2 = 0

for(l = 0; l < grids2Len; l++){
    result2+=getRunic(grids2[l],2)
}
console.log(result2)

// Part 3
let result3 = 0, gridcache = {}, coOrds = [], coLen;

for(m=0;m<grids3.length-7;m+=6){
    for(n=0;n<grids3[0].length-7;n+=6){
        coOrds.push([m,n,[]]);
    }
}

do {
    coLen = coOrds.length
    let nextCoords = []

    while(coOrds.length>0){
        let [r,c,toCheck] = coOrds.shift();
        let grid = grids3.slice(r,r+8).map((x)=>x.slice(c,c+8));

        if(toCheck.length === 0 || !gridcache[grid.join('')]){
            gridcache[grid.join('')] = true;
            let [result,toSolve] = getRunic(grid,3,r,c,toCheck);

            if(!result.includes('.')){
                result3 += result.map((x,ix)=>(ix+1)*power.indexOf(x)).reduce((acc,curr)=>acc+curr) 
            } else {
                nextCoords.push([r,c,[result,toSolve]])
            }
        } else {
            nextCoords.push([r,c,toCheck]) // Grid hasn't changed so skip till next loop
        }
    }
    coOrds = nextCoords

} while (coLen !== coOrds.length) // Stop when number solved/unsolved is same as last loop

console.log(result3)