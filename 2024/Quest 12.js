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

console.log(hitAllTargets(input1))
console.log(hitAllTargets(input2))

// Part 3
const destroyp3 = ([cx,cy],[tx,ty]) => {
    let 
        xDiff = tx-cx,
        yDiff = ty-cy

    if(xDiff===yDiff && xDiff>0) return Math.floor(yDiff) // Can be hit on upwards trajectory
    
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