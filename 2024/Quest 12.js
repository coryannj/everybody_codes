const { dir, group } = require('console');
const fs = require('fs');
const input1 = fs.readFileSync('../inputs/everybody_codes/2024/quest12_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../inputs/everybody_codes/2024/quest12_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../inputs/everybody_codes/2024/quest12_3.txt',{ encoding: 'utf8', flag: 'r' });

// Part 1 and 2
const hitAllTargets = (input) => {
    let grid = input.split(/[\r\n]+/).map((x)=>x.split('').slice(1)).reverse().slice(1);
    let [cat,tar,hr] = ['ABC','T','H'];
    let catapults = [],targets = [], hardRocks = [], ranking=0;

    for(const [y,row] of grid.entries()){
        for(const [x,col] of row.entries()){
            if(cat.includes(col)) catapults.push([x,y]);
    
            if(tar.includes(col)) targets.push([x,y]);
    
            if(hr.includes(col)) hardRocks.push([x,y]);
        }
    }

    const destroy = ([cx,cy],[tx,ty]) => {
        let 
            xDiff = tx-cx,
            yDiff = ty-cy
    
        if(xDiff===yDiff && xDiff>0) return yDiff // Can be hit on upwards trajectory
        
        if(yDiff>0 && xDiff>0 && xDiff>cx+yDiff && xDiff<=2*yDiff) return yDiff // Can be hit on horizontal trajectory
        
        // Can be hit on downwards trajectory   
        let direction = new Map([
            [-1,[-1,1]], // move up left
            [0,[0,0]],
            [1,[1,-1]] // move down right
        ])
    
        let newTarget = [tx,ty].map((x,i)=> x+ (Math.abs(yDiff)*direction.get(Math.sign(yDiff))[i])) // Calculate when trajectory through target would be at same height as catapult
    
        return newTarget[0]%3===0 ? newTarget[0]/3 : 0 // x diff is 3x shooting power
    }

    for (const [cInd,c] of catapults.entries()){
        for(const t of targets){
            ranking+=((cInd+1)*destroy(c,t));
        }

        for(const rock of hardRocks){
            ranking+=((cInd+1)*destroy(c,rock)*2)
        }
    }

    return ranking
}

console.log(hitAllTargets(input1)) // Part 1 answer
console.log(hitAllTargets(input2)) // Part 2 answer

// Part 3
let 
    meteors = input3.split(/[\r\n]+/).map((x)=>x.split(' ').map(Number)),
    catapults = [[0,0],[0,1],[0,2]],
    p3result=0

const destroyp3 = ([cx,cy],[tx,ty]) => {
    let 
        yDiff = ty-cy,
        xDiff = tx-yDiff // x distance of meteor from catapult when y at catapult height
   
    if(xDiff<0) return [-1,-1] // Early exit - hits y axis higher than catapult, no hit possible
    
    if(xDiff===0) return [Math.floor(yDiff/2),cy+Math.floor(yDiff/2)] // Hit on upwards trajectory

    let sPower1 = Math.floor((yDiff-xDiff)/2); // Shooting power if hit on horizontal
    
    if(xDiff<=sPower1) return [Math.floor((yDiff-xDiff)/2),cy+Math.floor((yDiff-xDiff)/2)] // Hit on horizontal trajectory
    
    let sPower2 = Math.floor(yDiff/3); // Shooting power if hit on downwards
    let [ncx,ncy] = [cx+(2*sPower2),cy+sPower2] // Catapult at last horizontal point
    let [ntx,nty] = [tx-(yDiff-sPower2),ty-(yDiff-sPower2)] // Find where meteor is when catapult starts falling - both have to start falling at same y co-ordinate to hit

    if((ntx-ncx)%2===0 && (ntx-ncx)/2 <= ncy) return [sPower2,ncy-((ntx-ncx)/2)] // Hit on downwards trajectory
    
    return [-1,-1]
        
}

for(const m of meteors){
    let thisResult = catapults.map((x,i)=>[i+1].concat(destroyp3(x,m))).filter((x)=>x[1]!==-1).map((x)=>[x[0]*x[1],x[2]]).sort((a,b)=>{
        if(a[1]===b[1]){
            if(a[0]>b[0]) return 1
            if(a[0]<b[0]) return -1
            return 0
        } else {
            return b[1]-a[1]
        }
    });
    
    p3result+=thisResult[0][0]
}

console.log(p3result) // Part 3 answer