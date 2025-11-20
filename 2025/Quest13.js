const fs = require('fs');
const input1 = fs.readFileSync('../inputs/everybody_codes/2025/quest13_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../inputs/everybody_codes/2025/quest13_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../inputs/everybody_codes/2025/quest13_3.txt',{ encoding: 'utf8', flag: 'r' });

const turnDial = (input,turns,partNo) => {
    let 
        lines = partNo === 1 ? input.split(/[\r\n]/).map(Number) : input.split(/[\r\n]/).map((x)=>x.split('-').map(Number)),
        linesLen = lines.length,
        dial = partNo === 1 ? [1] : [[1,1,0]],
        dialLen = linesLen+1,
        lastAntiClockWiseInd = linesLen%2 === 0 ? linesLen-1 : linesLen-2

    for(i=0;i<linesLen;i+=2){
        if(partNo === 1){
            dial.push(lines[i]);
        } else {
            let [x1,x2] = lines[i];
            dial.push([x1,x2,x2-x1+1+dial.at(-1)[2]]); // [start, end, cumulative sum]
        }
    }

    for(i=lastAntiClockWiseInd;i>0;i-=2){
        if(partNo===1){
            dial.push(lines[i]);
        } else {
            let [x1,x2] = lines[i];
            dial.push([x2,x1,x2-x1+1+dial.at(-1)[2]]);
        }
    }

    if(partNo>1) dialLen = dial.at(-1)[2]+1;

    let actualTurns = turns%dialLen; 

    if(actualTurns === 0) return 1; 
    if(partNo===1) return dial[actualTurns]; // Part 1 answer
     
    // Part 2 and 3
    let 
        resultInd = dial.findIndex(([x1,x2,x3])=>x3>=actualTurns),
        [r1,r2,r3] = dial[resultInd],
        prevInd = resultInd-1,
        remainingTurns = actualTurns-dial[prevInd][2]-1

    return r1 < r2 ? r1+remainingTurns : r1-remainingTurns // Part 2/3 answer
}

console.log('Part 1 answer is ',turnDial(input1,2025,1))
console.log('Part 2 answer is ',turnDial(input2,20252025,2))
console.log('Part 3 answer is ',turnDial(input3,202520252025,3))