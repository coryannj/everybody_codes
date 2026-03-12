const fs = require('fs');
const input1 = fs.readFileSync('../../inputs/everybody_codes/2025/the_entertainment_hub/quest1_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../../inputs/everybody_codes/2025/the_entertainment_hub/quest1_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../../inputs/everybody_codes/2025/the_entertainment_hub/quest1_3.txt',{ encoding: 'utf8', flag: 'r' });

function* cartesianIterator(head, ...tail) {
  const remainder = tail.length ? cartesianIterator(...tail) : [[]];
  for (let r of remainder){
    for (let h of head){
        let result = [h, ...r]
        let set = new Set (result)

        if(result.length === set.size){
            yield result
        }
    } 
  } 
}

const solve = (input,partNo) => {
    let
        [grid,tokens] = input.split(/[\r\n]{2}/).map((x)=>x.split(/[\r\n]/).map((y)=>y.split(''))),
        rowLen = grid.length,
        colLen = grid[0].length,
        slotsLen = Math.ceil(colLen/2),
        tokenLen = tokens.length,
        allTotals = Array(tokenLen).fill('').map((x,xi)=>[])

    tokens.forEach((x,xi)=>{
        let slotsArr = partNo === 1 ? [xi+1] : Array(slotsLen).fill('').map((v,vi)=>vi+1)
    
        slotsArr.forEach((tossSlot)=>{
            let
                startCol = (tossSlot-1)*2,
                currPos = [0,startCol],
                moveInd = 0

            do{
                    let [r,c] = currPos
                    let val = grid[r][c]

                if(val === '*'){
                    //take move L or R
                    let nextMove = x[moveInd]

                    if(nextMove === 'L'){
                        if(c === 0){
                            currPos = [r,c+1]
                        } else {
                            currPos = [r,c-1]
                        }
                    } else {
                        if(c === colLen-1){
                            currPos = [r,c-1]
                        } else {
                            currPos = [r,c+1]
                        }
                    }

                    moveInd++
                } else {
                    //move down
                    currPos = [r+1,c]
                }

            } while (currPos[0]<rowLen)
            

            let finalSlot = (currPos[1]/2)+1
            let coinsWon = (finalSlot*2)-tossSlot
            
            allTotals[xi].push(coinsWon)
        })


    })

    if(partNo === 1) return allTotals.flat().filter((x)=>x>0).reduce((a,c)=>a+c)

    if(partNo === 2) return allTotals.map((x)=>Math.max(...x)).reduce((a,c)=>a+c)

    // Part 3
    let
        max = 0,
        min = 999999999,
        validInds = allTotals.map((x)=>x.flatMap((y,yi)=>y>=0 ? [yi]:[]))

    cartesianIterator(...validInds).forEach((x)=>{
        let thisSum = x.map((y,yi)=>allTotals[yi][y]).reduce((a,c)=>a+c)

        if(thisSum>max){
            max = thisSum
        }

        if(thisSum<min){
            min = thisSum
        }
    })

    return `${min} ${max}`
}

console.log(solve(input1,1))
console.log(solve(input2,2))
console.log(solve(input3,3))