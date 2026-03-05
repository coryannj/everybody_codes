const fs = require('fs');
const input1 = fs.readFileSync('../../inputs/everybody_codes/2026/melody_made_of_code/quest2_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../../inputs/everybody_codes/2026/melody_made_of_code/quest2_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../../inputs/everybody_codes/2026/melody_made_of_code/quest2_3.txt',{ encoding: 'utf8', flag: 'r' });

const solve = (input,partNo) => {
    let
        lines = input.split(/[\r\n]/).map((x)=>x.split('')),
        startRow = lines.findIndex((x)=>x.includes('@')),
        startCol = lines[startRow].indexOf('@'),
        bones = lines.flatMap((x,i)=>x.flatMap((y,yi)=> y === '#' ? [[i,yi]]: [])),
        moves = partNo<3 ? [[-1,0],[0,1],[1,0],[0,-1]]:[[-1,0],[-1,0],[-1,0],[0,1],[0,1],[0,1],[1,0],[1,0],[1,0],[0,-1],[0,-1],[0,-1]],
        moveLen = moves.length,
        currPos = [startRow,startCol],
        steps = 0,
        moveCount = 0,
        gridObj = Object.fromEntries(bones.map((x)=>[x.join('_'),'#'])),
        nextPos

        gridObj[`${startRow}_${startCol}`]='@'

        if(partNo === 1){
            let boneKey = bones[0].join('_')

            do{
                do {
                    nextPos = moves[moveCount%moveLen].map((x,i)=>x+currPos[i])
                    moveCount++
                } while (gridObj[nextPos.join('_')] === '@')
                
                steps++
                gridObj[nextPos.join('_')] = '@'
                currPos = nextPos

            } while (gridObj[boneKey]==='#')

        } else {
            let points = Object.keys(gridObj).map((x)=>x.split('_').map(Number))

            let [minRow,maxRow,minCol,maxCol] = [Math.min(...points.map((x)=>x[0])),Math.max(...points.map((x)=>x[0])),Math.min(...points.map((x)=>x[1])),Math.max(...points.map((x)=>x[1]))]

            const unsurrounded = ([sr,sc]) => [[-1,0],[0,1],[1,0],[0,-1]].some(([r,c])=> gridObj[`${r+sr}_${c+sc}`] === undefined)

            const floodfill = (queue) => {
                let openKeys = new Set()
                let enclosedKeys = new Set()

                while(queue.length>0){
                    let subQueue = [queue.shift()]
                    let thisSeen = new Set()
                    thisSeen.add(subQueue[0].join('_'))
                    let enclosed = true

                    while(subQueue.length>0){
                        let [nr,nc] = subQueue.shift()
                        
                        let nextArr = [[-1,0],[0,1],[1,0],[0,-1]].map(([r,c])=>[r+nr,c+nc]).filter(([r,c])=> gridObj[`${r}_${c}`]===undefined && !thisSeen.has(`${r}_${c}`))

                        nextArr.forEach(([r,c])=>{
                            thisSeen.add(`${r}_${c}`)

                            if(r<=minRow || r>=maxRow || c<=minCol || c>=maxCol){ 
                                enclosed=false
                            } else {
                                subQueue.push([r,c])
                            }
                        })
                    }

                    if(enclosed){
                        enclosedKeys = enclosedKeys.union(thisSeen)
                    } else {
                        openKeys = openKeys.union(thisSeen)
                    }

                    queue = queue.filter((x)=>!openKeys.has(x.join('_')) && !enclosedKeys.has(x.join('_')))

                }

                if(enclosedKeys.size>0){
                    enclosedKeys.keys().forEach((x)=>gridObj[x]='@')
                }
            }

            // Part 3 - mark already enclosed areas
            if(partNo === 3){
                let check = lines.flatMap((x,i)=>x.flatMap((y,yi)=> y === '.' ? [[i,yi]]: [])).filter(([r,c])=>r>minRow && r<maxRow && c>minCol && c<maxCol)
                floodfill(check)
            }

            do{
                do {
                    nextPos = moves[moveCount%moveLen].map((x,i)=>x+currPos[i])
                    moveCount++
                } while (gridObj[nextPos.join('_')] !== undefined)
                
                steps++
                gridObj[nextPos.join('_')] = '@'
                currPos = nextPos
                
                if(nextPos[0]<minRow) minRow=nextPos[0]
                if(nextPos[0]>maxRow) maxRow=nextPos[0]
                if(nextPos[1]<minCol) minCol=nextPos[1]
                if(nextPos[1]>maxCol) maxCol=nextPos[1]

                let nextCheck = [[-1,0],[0,1],[1,0],[0,-1]].map(([r,c])=>[r+nextPos[0],c+nextPos[1]]).filter((x)=>gridObj[x.join('_')]===undefined)

                if(nextCheck.length>1) floodfill(nextCheck)

                bones = bones.filter((x)=> unsurrounded(x))

            } while (bones.length>0)
        }

        return steps
}

console.log(solve(input1,1))
console.log(solve(input2,2))
console.log(solve(input3,3))