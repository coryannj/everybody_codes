const fs = require('fs');
const input1 = fs.readFileSync('../inputs/everybody_codes/2025/quest10_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../inputs/everybody_codes/2025/quest10_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../inputs/everybody_codes/2025/quest10_3.txt',{ encoding: 'utf8', flag: 'r' });


let lines = input3.split(/[\r\n]/).map((x)=>x.split(''))

let sheepGrid = lines.map((x)=>x.map((y)=>y!=='S'?'.':y))

let newLine = Array(lines[0].length).fill('.')

let dr = lines.findIndex((x)=>x.includes('D'))
let dc = lines[dr].indexOf('D')
let rowLen = lines.length
let colLen = lines[0].length
console.log(dr,dc,rowLen,colLen)
let queue = [[dr,dc]]

let visited = {}
visited[`${dr}-${dc}`] = 1
let counter = 0
let sheep = 0
let moves = 20

let colmap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
// Part 3

// Pawns (sheep)
// End of moves is last '.' before run of '#' - don't need to track beyond that

//let pawns = lines.flatMap((r,ri)=>r.flatMap((c,ci)=>c==='S'?[[[ri,ci],1]]:[])) // Start locations of all pawns
let pawns = []

let pawnMoves = {} // Adjacency list for pawns
let pTotalMoves = 0

for(p=0;p<colLen;p++){
    let col = lines.map((lr)=>lr[p])
    let lastSafe = col.findLastIndex((ls)=>ls !== "#")

    if(col[0]==='S'){
        let pawnKey = `${colmap[p]}1`

        if(lastSafe >0){
            pawns.push([pawnKey,1])
            col.slice(0,lastSafe+1).forEach((x,i,a)=>{
                let key = `${colmap[p]}${i+1}`
        
                if(i<a.length-1){
                    let next = a[i+1]
        
                    if(i===lastSafe-1){
                        pawnMoves[key] = [`${colmap[p]}${i+2}`,2] // 2 = at end of path (always not safe)
                    } else if (next === "#"){
                        pawnMoves[key] = [`${colmap[p]}${i+2}`,0] // 0 = in hideout (safe)
                    } else {
                        pawnMoves[key] = [`${colmap[p]}${i+2}`,1] // 1 = on dot (not safe)
                    }
                }
            })
        } else {
            pawns.push([pawnKey,2])
        }
        
    }

}

console.log(pawns)
console.log(pawnMoves)

// pawns.forEach(([[r,c],isSafe])=>{
//     let col = lines.map((lr)=>lr[c])
//     let lastSafe = col.findLastIndex((ls)=>ls !== "#")

//     pTotalMoves+=col.slice(0,lastSafe+1).length


// })

// pawns = pawns.map(([[r,c],p2])=>[`${colmap[c]}${r+1}`,p2])

// console.log(pawnMoves)

// Knight (dragon)
let knight = [dr,dc]
let knightMoves = {} // Pre-compute all moves in adjacency list

for(i=0;i<rowLen;i++){
    for(j=0;j<colLen;j++){
        knightMoves[`${colmap[j]}${i+1}`]=[];

        const nextArr = [[-2,-1],[-2,1],[2,1],[2,-1],[1,-2],[-1,-2],[1,2],[-1,2]].flatMap(([nr,nc])=> lines?.[i+nr]?.[j+nc] ? [`${colmap[j+nc]}${i+1+nr}`] :[]);

        nextArr.forEach((n)=>{
            knightMoves[`${colmap[j]}${i+1}`].push(n);
        })
    }
}

console.log(knightMoves)


// Sequences
// Want to track
//  - Sheep eaten
//  - Index of sheep at end
//  - Current locations of all sheep
//  - All next possible sheep moves
//  - All moves in current path
//  - Last position of dragon
//  - Who took last turn

//let t = pawnMoves['A1']
//pawns = pawns.map((x,i)=>i===0?t:x)
//console.log(pawns)

//console.log(t)

let startObj = {
    "eaten":0,
    "atEnd": [],
    "pawns":structuredClone(pawns),
    "path": [],
    "knight": `${colmap[dc]}${dr+1}`,
    "lastTurn": 'D'
}

console.log(startObj)
let pTotal = pawns.length
let uniquePaths = 0
let allPaths = []

let pQueue = Array(rowLen*colLen*2).fill([]).map((x)=>[])
//console.log(pQueue)
pQueue[0] = [startObj]
let pcounter = 0
let t1 = performance.now()
while(pQueue.some((x)=>x.length>0)){
    let priorityIndex = pQueue.findLastIndex((x)=>x.length>0)

    //let sQueue = pQueue[priorityIndex]
    //pQueue[priorityIndex] = []

    //while(sQueue.length>0){
        let last = pQueue[priorityIndex].shift()
        
        //let lastCopy = structuredClone(last)
        //console.log('********* NEW LINE *********')
        //console.log('last is ',last)
        //let secondLast = subQueue.path.at(-2)[0]
        //let notEndMoves = (last.pMoves.reduce((a,c)=> c.length>1 ? a+c.length-1 : a ,0)*2);

        //if(last.lastTurn==='S') notEndMoves+=2 ;

        //if(pTotal-last.eaten>notEndMoves||atEnd.length>notEndMoves) continue;

        if(last.lastTurn === 'D'){
            last.pawns.forEach(([pos,isSafe],i,a)=>{
                if(isSafe<2){
                    let nextObj = structuredClone(last)
                    let nextMove = [nextPos,nextSafe] = pawnMoves[pos]
                    if(nextSafe === 0 || (nextSafe>0 && nextPos !== last.knight)){
                        if(nextSafe===2) nextObj.atEnd.push(i)
                        nextObj.pawns[i] = nextMove
                        nextObj.path.push(nextMove)
                        nextObj.lastTurn = 'S'
                       // console.log('pawn is ',i,' nextobj is ',nextObj)

                        // Add to queue checks
                        // nextObj.atEnd.length<=2
                        // 

                        if(nextObj.atEnd.length<=2){ // Knight can only make 2 moves max
                            pQueue[nextObj.path.length].push(nextObj)
                        }
                    }
                }
            })


            // last.pawns.forEach(([pos,isSafe],i,a)=>{
            //     console.log('***** PAWN TURN *****')
            //     console.log(i,[pos,isSafe])
            //     if(isSafe<2){
            //         let nextObj = structuredClone(last)
                
            //         let nextMove = [nextPos,nextSafe] = pawnMoves[pos]
    
            //         if(nextPos !== nextObj.knight || (nextPos === nextObj.knight && nextSafe === 0)){
            //             if(isSafe===2) nextObj.atEnd.push(i)
            //             nextObj.pawns[i] = nextMove
            //             nextObj.path.push(nextMove)
            //             nextObj.lastTurn = 'S'
            //             console.log('pawn is ',i,' nextobj is ',nextObj)
            //             pQueue[nextObj.eaten].push(nextObj)
            //         } 
            //     }
            // })
        } 

        if(last.lastTurn === 'S') {

            let nextMoves = knightMoves[last.knight]
           // console.log('***** KNIGHT TURN *****')

            knightMoves[last.knight].forEach((nextPos)=>{
                
                //console.log('nextPos ',nextPos)
                let nextObj = structuredClone(last)
                //let takeSecondTurn = true

                nextObj.lastTurn = 'D'

               
                nextObj.path.push(nextPos)
                nextObj.knight = nextPos

                nextObj.pawns = nextObj.pawns.map(([pos,isSafe],i)=>{
                    if(pos === nextPos && isSafe>0 && isSafe<3){
                        nextObj.eaten++
                        nextObj.atEnd = nextObj.atEnd.filter((x)=>x!==i)
                        return [pos,3]
                    } else {
                        return [pos,isSafe]
                    }
                })


                if(nextObj.eaten<pTotal){
                    // Check whether to take second turn
                    // all not eaten pawns can't move i.e. nextPos is their next move
                    let nextNextMove = knightMoves[nextPos]
                    let canPawnMove = nextObj.pawns.some(([pos,isSafe])=> isSafe===2 ||(isSafe<2 && pawnMoves[pos][0]!==nextPos) || (isSafe<2 && pawnMoves[pos][0]===nextPos && pawnMoves[pos][1]===0))
                    //takeSecondTurn = nextObj.pawns.every(([pos,isSafe],pi)=> isSafe===3 || (isSafe<2 && (pawnMoves[pos][0]===nextPos && pawnMoves[pos][1]>0)))
                    
                    if(!canPawnMove){
                       // console.log('canPawnMove is ',canPawnMove,'pawns',nextObj.pawns,' next knight move ',nextNextMove)
                        nextObj.lastTurn = 'S'
                    }
                   // console.log('knight move, adding to queue',nextObj)

                    //if(canPawnMove && nextObj.eaten+nextObj.atEnd.length<pTotal){
                        pQueue[nextObj.path.length].push(nextObj)
                    //}

                    
                } else {
                    uniquePaths++
                    //console.log('all eaten last ',lastCopy)
                   // console.log('all eaten',nextPos,nextObj)
                    //allPaths.push(nextObj.path.map((x)=>typeof x === 'object' ? `S>${x[0]}`:`D>${x}`).join('_'))
                }

            })
        }
    //}
    pcounter++
    if(pcounter%1000000===0){
        let t2 = performance.now()
        console.log('counter is ',pcounter,' uniquepaths found ',uniquePaths, 'time running ',Math.floor(t2-t1/1000)," seconds")
    }
    
}
    

console.log(uniquePaths)
//console.log(allPaths)

// do{
    
//     let nextQueue = []
//     let inQueue = {}
//     let sheepMoves = sheepGrid.flatMap((x,xi)=>x.flatMap((y,yi)=>y==="S"?[`${xi}-${yi}`]:[]))
    
//     while(queue.length>0){
//         let [r,c] = queue.shift()
    
//         const nextArr = [[-2,-1],[-2,1],[2,1],[2,-1],[1,-2],[-1,-2],[1,2],[-1,2]].flatMap(([nr,nc])=> lines?.[r+nr]?.[c+nc] && !inQueue[`${r+nr}-${c+nc}`]? [[r+nr,c+nc]] :[])
//         // const nextArr = [[-2,-1],[-2,1],[2,1],[2,-1],[1,-2],[-1,-2],[1,2],[-1,2]].flatMap(([nr,nc])=> lines?.[r+nr]?.[c+nc] && !visited[`${r+nr}-${c+nc}`] ? [[r+nr,c+nc]]:[])
//         //console.log(nextArr)
//         nextArr.forEach(([nr,nc])=>{
//             let nKey = `${nr}-${nc}`
//             if(lines[nr][nc]!=='#' && sheepGrid[nr][nc]==="S"){
//                 //if(sheepMoves.includes(nKey)){
//                     sheep++
//                     sheepGrid[nr][nc]='.'
//                 //}
//             }
//             visited[nKey]=1
//             inQueue[nKey]=1
//             nextQueue.push([nr,nc])
//         })
//     }
//     //console.log('counter,sheep',counter,sheep)
//     sheepGrid.pop()
//     sheepGrid.unshift(newLine)

//     nextQueue.forEach(([nr,nc])=>{
//         if(lines[nr][nc]!=="#" && sheepGrid[nr][nc]==="S"){
//             sheep++
//             sheepGrid[nr][nc]='.'
//         }
//     })
// console.log('counter,sheep',counter,sheep,nextQueue.length)
    
//     queue = nextQueue
 
//     counter++
//     //console.log(counter,queue)

// } while (counter<moves)

// console.log(sheep)

// // input2.split(/[\r\n]/).map((x)=>x.split('')).forEach((x,i)=>{
// //     x.forEach((y,yi)=>{
// //         if(y!=='.'){
// //             console.log([i,yi])
// //         }
// //     })
// // })

// //console.log(Object.keys(visited).length)

// // Object.keys(visited).forEach((x)=>{
// //     let [r,c] = x.split('-').map(Number)

// //     if(lines[r][c]==='S') sheep++
// // })

// // console.log(sheep) // Part 1