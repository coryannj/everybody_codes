const fs = require('fs');
const input1 = fs.readFileSync('../inputs/everybody_codes/2025/quest7_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../inputs/everybody_codes/2025/quest7_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../inputs/everybody_codes/2025/quest7_3.txt',{ encoding: 'utf8', flag: 'r' });

const isValid = (input,partNo) => {
    let [names,rules] = input.split(/[\r\n]{2,}/)

    names = names.split(',');
    rules = Object.fromEntries(rules.split(/[\r\n]+/).map((x)=>x.split(/[\W\s]+/)).map((x)=>[x[0],x.slice(1)]));
    
    let validNames = [], validIndices=0

    for(const [nInd,n] of names.entries()){
        let 
            nameLen = n.length-1, 
            nValid = true;

        for(i=0;i<nameLen;i++){
            if(!rules[n[i]] || !rules?.[n[i]].includes(n[i+1])){
                nValid=false;
                break;
            }
        }

        if(nValid){
            validNames.push(n);
            validIndices+=nInd+1;
        }
    }
    
    if(!partNo) return {"count":validNames.length, "names":validNames, "indices":validIndices}

    let p3validNames = new Set();

    validNames.forEach((v)=>{
        let list = [v];

        while(list.length>0){
            let newList = [];

            list.forEach((l)=>{
                let rule = rules[l.slice(-1)];

                if(rule) {
                    rule.forEach((x)=>{

                        let newName = l+x;

                        if(l.length<10) newList.push(newName);

                        if(l.length>=6) p3validNames.add(newName);
                        
                    })
                }
            })
            list = newList;
        }
    })

    return p3validNames.size;
}

console.log(isValid(input1).names[0]) // Part 1
console.log(isValid(input2).indices) // Part 2
console.log(isValid(input3,3)) // Part 3