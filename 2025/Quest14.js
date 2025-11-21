const fs = require('fs');
const input1 = fs.readFileSync('../inputs/everybody_codes/2025/quest14_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../inputs/everybody_codes/2025/quest14_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../inputs/everybody_codes/2025/quest14_3.txt',{ encoding: 'utf8', flag: 'r' });

const getActive = (input,rounds,partNo,pInput) => {
    let
        grid = {},
        diagonals = {},
        lines = input.split(/[\r\n,]/).map((x)=>x.split('')),
        rowLen=lines.length,
        colLen=lines[0].length,
        counter = 1,
        activeCount = 0

    for(i=0; i<rowLen; i++){
        for(j=0; j<colLen; j++){
            let key = `${i}-${j}`;

            grid[key] = lines[i][j] === '#' ? true : false;

            diagonals[key] = [[i-1,j-1],[i+1,j+1],[i-1,j+1],[i+1,j-1]].filter(([nr,nc])=>lines?.[nr]?.[nc] !== undefined).map((x)=>x.join('-'));
        }
    }

    const isActive = (gridKey,gridVal) => {
        let neighbours = diagonals[gridKey].reduce((a,c)=> grid[c] ? ++a : a, 0)
        return (gridVal) ? neighbours%2===1 : neighbours%2===0;
    }

    if(partNo < 3){
        while(rounds > 0){
            let newGrid = Object.fromEntries(Object.entries(grid).map(([k,v])=>[k,isActive(k,v)]));

            activeCount+=Object.values(newGrid).reduce((a,c)=> c ? ++a : a, 0);
            grid = newGrid;
            rounds--;
        }

        return activeCount;
    }

    let
        pattern = Object.fromEntries(pInput.split(/[\r\n]/).map((x)=>x.split('')).flatMap((r,ri)=>r.map((c,ci)=>[`${ri+13}-${ci+13}`, c === "#" ? true : false]))),
        cycle = new Set(),
        cycleCounters = [],
        cycleActives = [],
        cycleRepeatFirstCounter,
        cycleRepeatFirstActives

    while(true){
        let newGrid = Object.fromEntries(Object.entries(grid).map(([k,v])=>[k,isActive(k,v)]));

        if(Object.entries(pattern).every(([k,v])=> v === newGrid[k])){
            let actives = Object.values(newGrid).reduce((a,c)=> c ? ++a : a, 0);

            if(!cycle.has(JSON.stringify(newGrid))){
                cycleCounters.push(counter);
                cycleActives.push(actives);
            } else {
                cycleRepeatFirstCounter = counter;
                cycleRepeatFirstActives = actives;
                break; // Found cycle
            }
            
            if(cycle.size === 0){
                cycle.add(JSON.stringify(newGrid));
            }
        }

        grid = newGrid;
        counter++;
    }
        
    let 
        offset = cycleCounters[0],
        cycleLen = cycleRepeatFirstCounter - offset,
        remainder = (rounds-offset)%cycleLen,
        remIndex = cycleCounters.findLastIndex((x)=>x<=remainder),
        cycleValue = cycleActives.reduce((a,c)=>a+c)

        activeCount+=(Math.floor((rounds-offset)/cycleLen)*cycleValue);

    if(remIndex !== -1){
        activeCount+=cycleActives.slice(0,remIndex+1).reduce((a,c)=>a+c,0);
    }
        
    return activeCount
}

console.log('Part 1 answer is ', getActive(input1, 10, 1)) 
console.log('Part 2 answer is ', getActive(input2, 2025, 2))
console.log('Part 3 answer is ', getActive(`${'.'.repeat(34)},`.repeat(33)+`${'.'.repeat(34)}`, 1000000000, 3, input3))