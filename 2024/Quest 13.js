const { dir, group } = require('console');
const fs = require('fs');
const input1 = fs.readFileSync('../quest13_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../quest13_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../quest13_3.txt',{ encoding: 'utf8', flag: 'r' });

function platforms(input,partNo){
    const lines = input.replaceAll(' ','#').split(/[\r\n]+/).map((x)=>x.split('').map((y)=>!'#SE'.includes(y)?parseInt(y):y))

    let start = partNo<3 ? 'S' : 'E';
    let end = partNo<3 ? 'E' : 'S';

    let sRow = lines.findIndex((x)=>x.includes(start));
    let sCol = lines[sRow].indexOf(start);

    let queue = Array(1000).fill('.').map((x)=>[]);
    queue[0].push([0,`${sRow}-${sCol}`]);
    lines[sRow][sCol] = 0;
    let min;
    let minObj = {};
    
    while(!min){
        let next = queue[queue.findIndex((x)=>x.length>0)].shift();
        let [r,c] = next.at(-1).split('-').map(Number);
    
        [[r,c+1],[r,c-1],[r+1,c],[r-1,c]].filter(([nr,nc])=> 
            0 <= nr && nr < lines.length 
            && 0 <= nc && nc<lines[0].length 
            && lines[nr][nc] !== '#'
            && !next.includes([nr,nc].join('-'))
        ).forEach(([nr,nc])=>{
            let nxt = [nr,nc].join('-');
            let nxtVal = lines[nr][nc] !== end ? lines[nr][nc] : 0;
            let diff = Math.abs(lines[r][c]-nxtVal);
            let newNext = next.slice();
            
            newNext[0]+=(Math.min(diff,10-diff)+1)
            
            if(minObj[nxt]===undefined||newNext[0]<minObj[nxt]){
                minObj[nxt]=newNext[0]
                if(lines[nr][nc] !== end){
                    newNext.push(nxt)
                    queue[newNext[0]].push(newNext)
                } else {
                    min = newNext[0]
                }
            }
        })   
    }

    return min
}

console.log(platforms(input1,1))
console.log(platforms(input2,2))
console.log(platforms(input3,3))