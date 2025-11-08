const fs = require('fs');
const input1 = fs.readFileSync('../inputs/everybody_codes/2025/quest5_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../inputs/everybody_codes/2025/quest5_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../inputs/everybody_codes/2025/quest5_3.txt',{ encoding: 'utf8', flag: 'r' });

const allQualities = (input) => {
    let swords = input.split(/[\r\n]+/).map((x)=>x.split(':').map((y,i)=>i===0?parseInt(y):y.split(',').map(Number)))
    
    const quality = ([id,nums]) => {
        let sword = []
        for (const n of nums){
            let leftIndex = sword.findIndex(([l,c,r])=> n<c && l=== -1)
            let rightIndex = sword.findIndex(([l,c,r])=> n>c && r === -1)
            if(leftIndex !== -1){
                sword[leftIndex][0]=n
            } else if (rightIndex !== -1){
                sword[rightIndex][2]=n
            } else {
                sword.push([-1,n,-1])
            }
        }

        return {
            "id": id,
            "quality":parseInt(sword.map((x)=>x[1]).join('')),
            "fishbone":sword.map((x)=>parseInt(x.filter((y)=>y>=0).join('')))
        }
    }
    
    return swords.map(quality).sort((a,b)=>{
        if(a.quality===b.quality){
            let firstDiff = a.fishbone.findIndex((x,i)=> x !== b.fishbone[i])
            return firstDiff === -1 ? b.id-a.id: b.fishbone[firstDiff]-a.fishbone[firstDiff]
        } else {
            return b.quality-a.quality
        }
    })
}

console.log(allQualities(input1)[0].quality) // Part 1

console.log(allQualities(input2).map((x)=>x.quality).filter((x,i,a)=>i===0 || i===a.length-1).reduce((a,c)=>a-c)) // Part 2

console.log(allQualities(input3).map((x,i)=>x.id*(i+1)).reduce((a,c)=>a+c)) // Part 3