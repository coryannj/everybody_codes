const fs = require('fs');
const input1 = fs.readFileSync('../inputs/everybody_codes/2025/quest16_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../inputs/everybody_codes/2025/quest16_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../inputs/everybody_codes/2025/quest16_3.txt',{ encoding: 'utf8', flag: 'r' });

// Part 1
console.log('Part 1 answer is ',input1.split(/[\r\n,]/).map(Number).map((x)=>Math.floor(90/x)).reduce((a,c)=>a+c))

// Part 2
const getSpell = (input) => {
    let spell = []
    let wall = input.split(/[\r\n,]/).map(Number)
    let wallInd=1

    while(wall.length>0 && wall.some((x)=>x>0)){
        let next = wall.shift();
        
        if(next){
            spell.push(wallInd);
            wall = wall.values().map((x,ix)=> wallInd === 1 || (ix+1)%(wallInd) === 0 ? --x : x).toArray();
        }

        wallInd++;
    }

    return spell;
}

console.log('Part 2 answer is ',getSpell(input2).reduce((a,c)=>a*c,1))

// Part 3
let
    blocks = 202520252025000,
    p3Spells = getSpell(input3),
    binSearch = new Map(),
    factor10 = 1

binSearch.set(5,new Map([[false,3],[true,7]]));
binSearch.set(3,new Map([[false,1],[true,4]]));
binSearch.set(7,new Map([[false,6],[true,8]]));
binSearch.set(8,new Map([[true,9]]));
binSearch.set(1,new Map([[false,0],[true,2]]));

const getBlocks = (spells,len) => spells.values().map((x)=>Math.floor(len/x)).reduce((a,c)=>a+c)

const bSearch = (spells,currFactor,currTotal) => {
    let 
        val = 5,
        lastTrue,
        bLookup
    
    while(binSearch.has(val)){
        bLookup = binSearch?.get(val)?.get(getBlocks(spells,currTotal+(val*currFactor)) < blocks);
        
        if(bLookup === 0) return 0; 
        
        if(bLookup > val) lastTrue = val; 
        
        if(!binSearch.has(bLookup)) return getBlocks(spells,currTotal+(bLookup*currFactor)) < blocks ? bLookup * currFactor : lastTrue * currFactor

        val=bLookup;
    }
}

do{
    factor10*=10;   
} while(getBlocks(p3Spells,factor10*10)<blocks)

let
    checkLen = `${factor10}`.length,
    totalLen = 0

for(i=checkLen;i>0;i--){
    totalLen+=bSearch(p3Spells,factor10,totalLen);
    factor10/=10;
}

console.log('Part 3 answer is ',totalLen)