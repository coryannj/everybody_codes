const fs = require('fs');
const { escape } = require('querystring');
const input1 = fs.readFileSync('../inputs/everybody_codes/2025/quest15_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../inputs/everybody_codes/2025/quest15_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../inputs/everybody_codes/2025/quest15_3.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input3.split(",").map((x)=>[x[0],parseInt(x.slice(1))])

let [fr,fd] = lines.shift()

let p = [fr === 'R' ? fd : -fd, 0 , fr]

let flip = [rinkyDink,naughty] = fr === 'R' ? ['RR','LL'] : ['LL','RR']
console.log(fr,fd,flip)

let edges = []

const manhattan = ([x1,y1,d1],[x2,y2,d2]) => Math.abs(x1-x2) + Math.abs(y1-y2)



while(lines.length>1){
    let [currX,currY,currDir] = p

    let newY = [yDir,yDist] = lines.shift()
    let newX = [xDir,xDist] = lines.shift()
    
    let d = {
        R:{
            RR: [-xDist+currX, -yDist+currY, 'L'], //(down left)
            LL: [-xDist+currX, yDist+currY, 'L'], //(up left)
            RL: [xDist+currX, -yDist+currY, 'R'], //(down right)
            LR: [xDist+currX,yDist+currY, 'R'] //(up right)
        },
        L: {
            RR: [xDist+currX,yDist+currY, 'R'], //(up right)
            LL: [xDist+currX,-yDist+currY, 'R'], //(down right)
            RL: [-xDist+currX,yDist+currY, 'L'], //(up left)
            LR: [-xDist+currX,-yDist+currY, 'L'] //(down left)
        }
    }
    
    let next = d[currDir][`${yDir}${xDir}`]
    let removed=false
    
    if(`${yDir}${xDir}`===rinkyDink){
        console.log('*** RINKYDINK ***',p,next)
    }

    if(`${yDir}${xDir}`=== naughty){
        console.log('naughty found ','yDirXdir',`${yDir}${xDir}`,'xDir',edges.at(-1),p,next,lines[0])

        let prev = edges.pop()
        console.log('naughty edge removed',prev)

        while(manhattan(edges.at(-1).at(-1),next)+edges.at(-1)[0]>manhattan(edges.at(-1)[2],next)){
            console.log('naughty edges removed ',edges.pop())
            removed=true
        }
        p = edges.at(-1).at(-1)
        //console.log('new p - p is now ',p)
    } 

    if(removed){
        let newEdge = [manhattan(p,next),`${yDir}${xDir}`,p,next]
        console.log('new last',p)
        console.log('new edge',newEdge)
    }
    


    //edges.push(newEdge)

    edges.push([manhattan(p,next),`${yDir}${xDir}`,p,next])

    p=next
    
}

console.log('lines remaining ',lines)

//edges.forEach((x)=>console.log(x))

edges.forEach((x)=>console.log(x[2].slice(0,2).join('|')))

const cumulativeSum = (sum => value => sum += value)(0);


console.log(edges.map((x)=>x[0]).map(cumulativeSum))


// 'RR','RL','LR','LL'


// R
    // RR [-x[1],-y[0]] (down left)
    // LL [-x[1],y[0]] (up left)
    // RL [+x[1],-y[0]] (down right)
    // LR [+x[1],y[0]] (up right)

// L 
    // RR [+x[0],+y[1]] (up right)
    // LL [+x[0],-y[1]] (down right)
    // RL [-x[0],+y[1]] (up left)
    // LR [-x[0],-y[1]] (down left)


while(lines.length>0){
    let spiral = {
        index: spiralInd,
        quadrants: []
    }

    let quadInd = 0

    while(quadCounter<quadOrder.length){
        let last = [lx,ly,lastDir] = p.slice()

        //spiral[quadInd].push(last)

        let next = [nextDir,nextDist] = lines.shift()

        let dirObj = {
            'UR':[(1*dist)+e[0],e[1],'R'],
            "UL":[(-1*dist)+e[0],e[1],'L'],
            "RR":[e[0],(-1*dist)+e[1],'D'],
            "RL":[e[0],(1*dist)+e[1],'U'],
            "DR":[(-1*dist)+e[0],e[1],'L'],
            "DL":[(1*dist)+e[0],e[1],'R'],
            "LR":[e[0],(1*dist)+e[1],'U'],
            "LL":[e[0],(-1*dist)+e[1],'D']
        }

        let [newX,newY,newDir] = dirObj[`${lastDir}${nd}`]
        
    }


    
    seen.push(p)
    //console.log('last p',s,e,prevDir,lastDir,' newdir,dist',nd,dist)



    
    
    let nextp = [[e[0],e[1]],[e[0]+newX,e[1]+newY],lastDir,newDir]
    //console.log([newX,newY,newDir],' p is now ',p)
    p=nextp
    
}
//console.log(seen.slice(0,5))

seen.forEach((x)=>console.log(x))


let points = seen.map((x)=>x[1])

points.forEach(([x,y])=>console.log(`${x.toString()}|${y.toString()}`))
console.log(seen.slice(-10))

// We are starting 'outside' and we want to be 'inside'



// let [startR,startC] = [0,0]
// let p = [0,0,'U','U']
// let seen = []

// while(lines.length>0){
//     let[newdir,dist] = lines.shift()

//     let[r,c,oldDir] = p
//     seen.push(p)
//     //console.log('last p',p,' newdir,dist',newdir,dist)
//     let dirObj = {
//         'UR':[0,1*dist,'R'],
//         "UL":[0,-1*dist,'L'],
//         "RR":[1*dist,0,'D'],
//         "RL":[-1*dist,0,'U'],
//         "DR":[0,-1*dist,'L'],
//         "DL":[0,1*dist,'R'],
//         "LR":[-1*dist,0,'U'],
//         "LL":[1*dist,0,'D']
//     }

//     let [nr,nc,nd] = dirObj[`${oldDir}${newdir}`]
//     let nextp = [r+nr,c+nc,nd]
//     p=nextp
    
// }
// let points = seen.map((x)=>x.slice(0,2).reverse())

// points.forEach(([x,y])=>console.log(x,",",y))

// // Look at first 3 lines to know if spiral is clockwise or counter clockwise

// //Move along boundary till intersect next edge




// while(lines.length>0){
//     let[newdir,dist] = lines.shift()

//     let[r,c,oldDir] = p
//     seen.push(p)
//     //console.log('last p',p,' newdir,dist',newdir,dist)
//     let dirObj = {
//         'UR':[0,1*dist,'R'],
//         "UL":[0,-1*dist,'L'],
//         "RR":[1*dist,0,'D'],
//         "RL":[-1*dist,0,'U'],
//         "DR":[0,-1*dist,'L'],
//         "DL":[0,1*dist,'R'],
//         "LR":[-1*dist,0,'U'],
//         "LL":[1*dist,0,'D']
//     }

//     let [nr,nc,nd] = dirObj[`${oldDir}${newdir}`]
//     let nextp = [r+nr,c+nc,nd]
//     let nextR = nextp[0]
//     let nextC = nextp[1]
//     //console.log('next is ',nextp)
//     let stepObj = {
//         'R':[0,1],
//         'U':[-1,0],
//         'D':[1,0],
//         'L':[0,-1]
//     }
//     let [stepr,stepc]=stepObj[nd]
//     //console.log('nStep is ',stepr,stepc)
//     //console.log('r is ',r,' c is ',c,' nextR,nextC',nextR,nextC)
//     while(r!==nextR || c!==nextC){
        
//         //if(r!==)
//         r+=stepr
//         c+=stepc
//         //console.log("*** ADDED ***",'r is ',r,' c is ',c,' nextR,nextC',nextR,nextC)
//         seen.push([r,c,'.'])
//     }

//     p=nextp
//     //console.log(p)
// }

// seen.push(p)

// console.log('end was ',p)

// let er = p[0]
// let ec = p[1]

// seen = seen.slice(1)

// console.log(er,ec,seen.slice(-5),seen.slice(0,5))

// let minRow = Math.min(...seen.map((x)=>x[0]),er)
// let maxRow = Math.max(...seen.map((x)=>x[0]),er)
// let minCol = Math.min(...seen.map((x)=>x[1]),ec)
// let maxCol = Math.max(...seen.map((x)=>x[1]),ec)

// let steps = 1
// //console.log(seen.some(([r,c,d])=>r===er&&c===ec))
// //console.log('seen is ',seen)
// const nextArr=([lr,lc])=>{
//     let next = [[lr+1,lc],[lr-1,lc],[lr,lc+1],[lr,lc-1]].filter(([nr,nc])=>minRow<=nr&&nr<=maxRow&&minCol<=nc&&nc<=maxCol &&!seen.some((x)=>nr===x[0] && nc===x[1]))
//     seen.push(...next)
//     return next
// }



// queue = nextArr([er,ec])

// //console.log('queue is ',queue)
// // const t = ([r,c]) => [[r+1,c+1],[r-1,c-1]]

// // let arr = [[1,1],[2,2],[3,3]]

// // const nArr = arr.values().flatMap((x)=>t(x)).toArray()
// // console.log(nArr)




// while(!queue.some(([r,c])=>r===startR &&c===startC)){
//     steps++
//     // let newQueue = []
    
//     // while(queue.length>0){
//     //     //let l = [lr,lc]=queue.shift()
        
//     //     let next = nextArr(queue.shift())
        
//     //     if(next.length>0){
//     //         next.forEach(([nr,nc])=>{
//     //             if(!newQueue.some(([qr,qc])=>nr===qr && nc===qc)){
//     //                 newQueue.push([nr,nc])
//     //                 //seen.push([nr,nc,"."])
//     //             }
//     //         })
//     //     }
//     // }

//     newQueue = queue.values().flatMap((x)=>nextArr(x)).toArray()

//     //seen.push(...newQueue)

//     queue = newQueue
//     console.log('steps is now',steps,queue.length)
//     //console.log(queue)
// }

// console.log('steps is',steps)

