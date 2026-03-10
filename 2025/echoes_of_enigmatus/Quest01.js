const fs = require('fs');
const input1 = fs.readFileSync('../../inputs/everybody_codes/2025/echoes_of_enigmatus/quest1_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../../inputs/everybody_codes/2025/echoes_of_enigmatus/quest1_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../../inputs/everybody_codes/2025/echoes_of_enigmatus/quest1_3.txt',{ encoding: 'utf8', flag: 'r' });

const eni = (n,e,m,partNo) => {
    let round = 0
    let remainders = []
    let score = 1

    if(partNo === 1){
        while(round < e){
            round++
            score = (score * n) % m
            remainders.unshift(score)    
        }
        
        return +remainders.join('')
    }

    let fast = 0, slow = 0

    do {
        round++
        score = (score * n) % m
        remainders.unshift(score) 

        round++
        score = (score * n) % m
        remainders.unshift(score)
        
        fast-=2
        slow-=1
    } while (remainders.at(fast) !== remainders.at(slow))

    let cycleLen = Math.abs(fast-slow)
    slow = 0

    do {
        round++
        score = (score * n) % m
        remainders.unshift(score)
        fast-=1
        slow-=1 
    } while (remainders.at(fast) !== remainders.at(slow))

    let
        offset = Math.abs(slow+1),
        cycle = offset === 0 ? remainders.slice(-cycleLen) : remainders.slice(slow-cycleLen+1,slow+1),
        cSliceLen = (e-offset)%cycleLen,
        cSlice = cSliceLen === 0 ? [] : cycle.slice(-cSliceLen)

    if(partNo === 2){
        //if(cSlice.length<5) cSlice = cSlice.concat(cycle) // Works without this
        return +cSlice.slice(0,5).join('')
    }

    if(partNo === 3){
        let cMult = Math.floor((e-offset)/cycleLen)
        let cycleSum = cMult*(cycle.reduce((a,c)=>a+c))
        let offsetSum = offset === 0 ? 0 : remainders.slice(-offset).reduce((a,c)=>a+c,0)
        let cSliceSum = cSlice.length === 0 ? 0 : cSlice.reduce((a,c)=>a+c,0)

        return cycleSum + offsetSum + cSliceSum
    }        
}  

const solve = (input,partNo) => {
    let lines = input.split(/[\r\n]/).map((x)=>Object.fromEntries(x.split(' ').map((y)=>y.split('=').map((z,i)=>i===1 ? +z : z))))
    
    let max = 0

    lines.forEach((o)=>{
        let result = eni(o['A'],o['X'],o['M'],partNo) + eni(o['B'],o['Y'],o['M'],partNo) + eni(o['C'],o['Z'],o['M'],partNo)

        if(result>max) max = result
    })

    return max

}

console.log(solve(input1,1))
console.log(solve(input2,2))
console.log(solve(input3,3))