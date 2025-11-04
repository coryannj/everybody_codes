const fs = require('fs');
const input1 = fs.readFileSync('../inputs/everybody_codes/2025/quest1_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../inputs/everybody_codes/2025/quest1_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../inputs/everybody_codes/2025/quest1_3.txt',{ encoding: 'utf8', flag: 'r' });

const getName = (input,partNo) => {
    let [names, instructions] = input.split(/[\r\n]+/).map((x,ind) =>{
        if (ind===0){
            return x.split(',');
        } else {
            return x.replaceAll('R','+').replaceAll('L','-').split(',').map(Number);
        }  
    });

    let len = names.length

    const getIndex = (a,c) => {
        let sum = a + c;

        if(partNo === 1){
            if (sum < 0) return 0; 
            if (sum > len-1) return len-1;
        }

        return sum % len 
    }
    
    if(partNo < 3){
        return names.at(instructions.reduce(getIndex,0))
    } else {
        while(instructions.length > 0){
            let nextIndex = getIndex(0,instructions.shift());
            names = names.with(nextIndex,names[0]).with(0,names.at(nextIndex));
        }

        return names[0];
    }

}

console.log(getName(input1,1)) // Part 1 answer
console.log(getName(input2,2)) // Part 2 answer
console.log(getName(input3,3)) // Part 3 answer