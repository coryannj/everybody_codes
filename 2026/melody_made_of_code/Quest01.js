const fs = require('fs');
const input1 = fs.readFileSync('../../inputs/everybody_codes/2026/melody_made_of_code/quest1_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../../inputs/everybody_codes/2026/melody_made_of_code/quest1_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../../inputs/everybody_codes/2026/melody_made_of_code/quest1_3.txt',{ encoding: 'utf8', flag: 'r' });

const solve = (input,partNo) => {
    let lines = input.split(/[\r\n]/).map((x)=>x.split(/[:\s]/g)).map((x)=> x.map((y,yi)=> yi===0 ? +y : parseInt(y.split('').map((v)=>v === v.toLowerCase() ? 0 : 1).join(''),2)))

    if(partNo === 1) return lines.filter(([id,r,g,b])=> g>r && g>b).reduce((a,c)=> a+c[0],0)
    
    if(partNo === 2) return lines.sort(([id1,r1,g1,b1,s1],[id2,r2,g2,b2,s2])=> s1 === s2 ? (r1+g1+b1) - (r2+g2+b2) : s2-s1)[0][0]
    
    let result = {'red-matte':[], 'red-shiny':[], 'green-matte':[], 'green-shiny':[], 'blue-matte':[], 'blue-shiny':[]}

    lines.forEach(([id,r,g,b,s])=> {
        
        if (s !== 31 && s !== 32) {
            let dominant, scale = s<=30 ? 'matte' : 'shiny'

            if(r>g && r>b){
                dominant = 'red'
            } else if (g>r && g>b){
                dominant = 'green'
            } else if (b>r && b>g){
                dominant = 'blue'
            } 

            if(!!dominant) result[`${dominant}-${scale}`].push(id)
        } 
    })

    return Object.values(result).sort((a,b)=>b.length - a.length)[0].reduce((a,c)=>a+c)

}

console.log(solve(input1,1))
console.log(solve(input2,2))
console.log(solve(input3,3))