const { dir, group } = require('console');
const fs = require('fs');
const input1 = fs.readFileSync('../inputs/everybody_codes/2024/quest15_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../inputs/everybody_codes/2024/quest15_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../inputs/everybody_codes/2024/quest15_3.txt',{ encoding: 'utf8', flag: 'r' });

// Generate cartesian product of given iterables:
function* cartesian(head, ...tail) {
    const remainder = tail.length > 0 ? cartesian(...tail) : [[]];
    for (let r of remainder){
        for (let h of head){
            if(r.length === 0){
                yield [h, ...r];
            } else {
                let hSplit = h.split('|')
                let rSplit = r[0].split('|')

                if(rSplit[0] === hSplit.at(-1)){
                    yield [h, ...r];
                }
            }
        } 
    } 
}

const neighbours = (r,c) => [[r+1,c],[r-1,c],[r,c+1],[r,c-1]]

const makeRange = (n1,n2) => Array(Math.abs(n1-n2)+1).fill(Math.min(n1,n2)).map((x,i)=>x+i)

const findDeadEnds = (grid) => {
    let counter
    let deleted = []

    const deFilter = (o) => o.neighbours.length === 0 || (o.row > 0 && o.val === '.' && o.neighbours.length === 1)
    let deList = grid.filter(deFilter)

    while(deList.length>0){
        deList.forEach((o)=>{
            deleted.push(`${o.row}_${o.col}`)
            let dIndex = grid.findIndex((x)=>x.row === o.row && x.col === o.col)
            grid.splice(dIndex,1)
        })

        grid = grid.map((o)=> {
            o.neighbours = o.neighbours.filter((x)=> !deleted.includes(x.join('_')))
            return o
        })

        deList = grid.filter(deFilter)
    } 

    return grid
}

const makeGrid = (input,partNo) => {
    input = (partNo || 0) < 3 ? input.replaceAll('~',"#") : input.replaceAll('~',"#").replaceAll(/[EKR]/g,'.')
    
    let herbBits = Object.fromEntries('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter((x)=>input.includes(x)).map((x,i)=>[x,parseInt('1'.padEnd(i+1,'0'),2)]))
    let grid = []
    let rows = input.split(/[\r\n]+/)
    let start

    rows.forEach((row,rowInd)=>{
        row.split('').forEach((val,colInd)=>{
            if(val !== '#'){
                gridObj = {
                        'row': rowInd,
                        'col': colInd,
                        'val': val,
                        'herbScore': herbBits[val] || 0,
                        'neighbours': neighbours(rowInd,colInd).flatMap(([r,c])=> rows?.[r]?.[c] && rows[r][c] !== '#' ? [[r,c]] : [])
                    }
                grid.push(gridObj)

                if(rowInd === 0){
                    start = [rowInd,colInd]
                }
            }
        })
    })
    
    grid = findDeadEnds(grid)
    
    const limits = [(partNo || 0) < 3 ? 10 : 22,1]
    
    let segments = grid
                    .map((o)=>[o.row,o.col])
                    .reduce((acc,curr)=> acc.map((x,i)=>{return x[curr[i]]++,x}),[rows.length-1,rows[0].length-1].map((x)=>Object.fromEntries(makeRange(0,x).map((k)=>[k,0]))))
                    .map((o,i)=>Object.keys(o).filter((k)=>o[k]<=limits[i]).map(Number))

    return [grid, herbBits, start, ...segments]
}

//let g = makeGrid(input1)
//console.log(g)
//console.log(Object.groupBy(g[0],({ row,col }) => [row,col].join('_')))

const solve = (input,partNo) => {
    const [grid,herbBits,startPos,subgridRows,subgridCols] = makeGrid(input,partNo)

    let herbTotal = Object.values(herbBits).reduce((a,c)=>a|c,0)
    let paths = {}

    subgridCols.forEach(([startCol,endCol],colInd)=>{
        let startFromTop = startCol <= startPos[1] && startPos[1]<= endCol
        
        if(!startFromTop){
            subgridRows = subgridRows.map(([s,e])=> [e,s]).reverse()
        }

        let lastSubGridRow = subgridRows.length - 1

        subgridRows.forEach(([startRow,endRow],rowInd)=>{
            let startKeys = rowInd === 0 && startFromTop === false ? Object.keys(grid).filter((x)=> x.includes('_'+startCol+'_') || x.includes('_'+endCol+'_')) : makeRange(startCol,endCol).map((y)=>`${startRow}_${y}`).filter((x)=>grid[x])
            let endKeys = makeRange(startCol,endCol).map((y)=>`${endRow}_${y}`).filter((x)=>grid[x])
            //let endKeys = Object.keys(grid).filter

            const bfs = (sKey,eKeys) => {

                let steps = 0
                let seen = new Set([sKey])
                let paths = {}
                let queue = [sKey]

                while(eKeys.some((k)=>!seen.has(k))){
                    queue = [...new Set(queue.flatMap((x)=>grid[x]['neighbours']))].filter((x)=>!seen.has(x))
                    steps+=1
                    queue.forEach((x)=>{
                        seen.add(x)
                        if(eKeys.includes(x)){
                            paths[x] = steps
                        }
                    })
                    
                }

                return paths

            }

            let segPaths = {}
            console.log(rowInd,startRow,endRow,startKeys,endKeys)

            for (const [herb,herbKeys] of Object.entries(allHerbs).filter(([k,v])=> v.every(([r,c])=> startRow <= r  && r <= endRow && startCol <= c && c <= endCol)).map(([k,v])=>[k,v.map(([hr,hc])=>`${hr}_${hc}`)])){
                thisBit = herbBits[herb]
                console.log(herb,thisBit)
                herbKeys.forEach((hk)=>{
                    let hp = bfs(hk,startKeys.concat(endKeys))
                    if(rowInd === lastSubGridRow) console.log(hp)
                    startKeys.forEach((sk)=>{
                        skSteps = hp[sk]
                        endKeys.forEach((ek)=>{
                            let pKey = `${sk}_${ek}_${thisBit}`
                            let ekSteps = hp[ek]
                            if(!segPaths[pKey] || segPaths[pKey]>skSteps+ekSteps){
                                segPaths[pKey] = skSteps+ekSteps
                            }
                        })
                    })
                })
            }
            console.log(segPaths)

            startKeys.forEach((sk)=>{
                console.log(sk,bfs(sk,endKeys))
            })


            //let herbKeys = Object.fromEntries(Object.entries(allHerbs).filter(([k,v])=> v.every(([r,c])=> startRow <= r  && r <= endRow && startCol <= c && c <= endCol)).map(([k,v])=>[k,v.map(([hr,hc])=>`${hr}_${hc}`)]))


            let thisHerbs = Object.keys(allHerbs).filter((k)=>allHerbs[k].every(([r,c])=> startRow <= r  && r <= endRow && startCol <= c && c <= endCol))
            //let herbKeys = thisHerbs.map((hk)=>allHerbs[hk].map(([hr,hc])=>`${hr}_${hc}`))
            //console.log(startRow,endRow,thisHerbs)
            //console.log(herbKeys)
            //let paths = {}
            
            // const makeState = (keys) => keys.map((k)=>{
            //     let obj = {startKey:k, steps:0, seen:{}, currLayer: [k]}
            //     obj['seen'][k] = 0
            //     // if(isStart){
            //     //     obj.noHerbs = eKeys
            //     //     if(thisHerbs.length>0) obj.withHerbs = eKeys
            //     // }
            //     return obj
            // })

            // const bfs = (sKeys,eKeys) => {
            //     let startQueue = makeState(startKeys)
                
                
                
            //     const step = (state) => {
            //         state.steps++

            //         state.currLayer.forEach((k)=>{
            //             let {val,neighbours} = grid[k]

            //         })

            //         let nextLayer = state.currLayer.flatMap((k)=>grid[k]['neighbours'].filter((nk)=>state['seen'][nk] === undefined))

            //         nextLayer.forEach((nk)=>state['seen'][nk] = state.steps)
            //         return state
            //     }

            //     console.log(startQueue)
            //     console.log(startQueue.map(step))

            // }

            // bfs(startKeys,endKeys)


        })
    })
}

console.log(solve(input2,1))

    // const bfs = (currKey,endKey) => {
    //     let steps = 0
    //     let seen = new Set([currKey])
    //     let queue = [currKey]

    //     while(!queue.includes(endKey)){
    //         queue = [...new Set(queue.flatMap((x)=>grid[x]))].filter((x)=>!seen.has(x))
    //         queue.forEach((x)=>seen.add(x))
    //         steps+=1
    //     }

    //     return steps
    // }

    const traverseSegment = ([start_Row,end_Row],[startCol,endCol]) => {
        let rowIndexes = Array(end_Row-start_Row+1).fill(start_Row).map((x,i)=>x+i).filter((x)=>Object.keys(gridObj).some((y)=>y.startsWith(x+'_')))

        let allNodes = Object.keys(gridObj).filter((x)=> rowIndexes.some((y)=>x.startsWith(y+'_')))

        let herbs = [...new Set(allNodes.filter((x)=> x.slice(-1) !== '.').map((x)=>x.slice(-1)))] ?? []
        //console.log('rowIndexes',rowIndexes,' herbs',herbs)
        herbList = herbList.concat(herbs)

        //if(!rowIndexes.includes(end_Row)) end_Row = start_Row // move outside to segment parsing



        // let start = allNodes.filter((x)=>x.startsWith(start_Row+'_'))
        // let end = allNodes.filter((x)=>x.startsWith(end_Row+'_'))

        let queue = allNodes.filter((x)=>x.startsWith(start_Row+'_')).map((x)=>[0,[start_Row],[x]])
        
        let nodes = herbs.concat(end_Row)

        let paths = {}



        

        while(queue.length>0){
            let [steps,seenNodes,seenKeys] = queue.shift()
            let nextNodes = nodes.filter((x)=>(isNaN(x) && !seenNodes.includes(x)) || (!isNaN(x) && seenNodes.at(-1) !== x))

            nextNodes.forEach((x)=>{
                let nextKeys = isNaN(x) ? allNodes.filter((y)=>y.slice(-1) === x) : allNodes.filter((y)=> y.startsWith(x+'_'))

                let newVisited = seenNodes.concat(x)

                nextKeys.forEach((y)=>{
                    let newSteps = steps+bfs(seenKeys.at(-1),y)
                    if(x !== end_Row){
                        queue.push([newSteps,newVisited,seenKeys.concat(y)])
                    } else {
                        //let pathKey = newVisited.join('|')
                        //if(!paths[pathKey]) paths[pathKey] = {};

                        let keysArr = newVisited.map((x,i)=>{
                            if(i === 0){
                                return seenKeys[0]
                            } else if (x === end_Row){
                                return y
                            } else {
                                return x
                            }
                        })

                        let nodesKey = keysArr.join('|')
                        let reverseNodesKey = keysArr.toReversed().join('|')



                        //console.log('nodesKey',nodesKey,'currMin',paths[pathKey][nodesKey])
                        if(!paths[nodesKey] || paths[nodesKey]>newSteps){
                            paths[nodesKey] = newSteps
                            paths[reverseNodesKey] = newSteps
                        }
                    }
                    
                })
                
            })
        }
        return paths

    }
}



console.log(traverseColumn(input1))
console.log(traverseColumn(input2))
console.log(traverseColumn(input3))




console.log(rowLen,colLen)

// Part 1
//let lines = input2.replaceAll('~',"#").split(/[\r\n]+/)
//let segmentIndexes = lines.flatMap((x,xi)=>x.split('').filter((y)=>y === '.').length<10 ? [xi]: []).map((x,i,a)=>[x,a[i+1]]).slice(0,-1)



//let segments = lines.flatMap((x,xi)=>x.includes('######################') ? [xi]: []).map((x,i,a)=>[x,a[i+1]]).slice(0,-1)




//const grid = makeGrid(lines,segmentIndexes)

// let colIndexes = lines[0].split('').flatMap((x,i)=>{
//     let thisCol = Object.keys(grid).filter((x)=>{
//         let [r,c,v] = x.split('_')
//         return +c === i
//     })

//     return thisCol.length<=1 ? [i] : []
// }).map((x,i,a)=>[x,a[i+1]]).slice(0,-1)

// console.log(colIndexes)

// lines.forEach((row,rowInd)=>{
//     console.log(row.split('').map((val,colInd)=>grid[`${rowInd}_${colInd}_${val}`] ? val : '#').join(''))
// })



//console.log(grid)

let herbList = []



let segmentPaths = segmentIndexes.map((x)=>allShortest(x,grid))
console.log('herblist is ',herbList)
segmentPaths = segmentPaths.concat(segmentPaths.slice(0,-1).toReversed())

let endSegments = segmentIndexes.slice(0,-1).map((x)=>x.toReversed()).toReversed()
let allSegmentPaths = [...segmentIndexes,...endSegments].map(([s,e],i)=>Object.keys(segmentPaths[i]).filter((y)=>y.startsWith(s+'_')))

let min = 100000000

for (const fullPath of cartesian(...allSegmentPaths)){
    if(!herbList.every((x)=>fullPath.some((y)=>y.includes(x)))) continue;

    let dist = fullPath.map((x,i)=>segmentPaths[i][x]).reduce((a,c)=>a+c)
    if(dist<min){
        console.log(fullPath,dist)
        min = dist
    } 
}
console.log('min is ',min)

//segmentIndexes.forEach((x)=>console.log(allShortest(x,grid)))


// start row
// end row
// check if herbs in segment - add to nodes if exist
// BFS all start to all end
// if hit a herb reset BFS seen

