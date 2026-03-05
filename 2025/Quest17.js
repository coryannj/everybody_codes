const { timeStamp } = require('console');
const fs = require('fs');
const input1 = fs.readFileSync('../inputs/everybody_codes/2025/quest17_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../inputs/everybody_codes/2025/quest17_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../inputs/everybody_codes/2025/quest17_3.txt',{ encoding: 'utf8', flag: 'r' });

const getRadius = (r,c,vR,vC) => Math.ceil(Math.sqrt(((vR - r) ** 2) + ((vC - c) ** 2)))

const inRadius = (r,c,vR,vC,radius) => ((vR - r) ** 2) + ((vC - c) ** 2) <= radius ** 2

const grid = (input) =>{
    let grid= input.split(/[\r\n]/).map((x,xi)=>x.split('').map((y,yi)=>y==='S'||y==='@' ? y : parseInt(y)))
    let vR= grid.findIndex((x)=>x.includes('@')), vC= grid[vR].indexOf('@')

    let obj = { 
        grid: grid,
        rowLen: grid.length,
        colLen: grid[0].length,
        vR: vR,
        vC: vC,
        vKey: `${vR}-${vC}`
    }

    return obj
}

// Part 1
let p1 = grid(input1)

console.log('Part 1 answer is ',p1.grid.flatMap((x,xi)=>x.flatMap((y,yi)=> typeof y ==='number' && getRadius(xi,yi,p1.vR,p1.vC)<=10? [y]:[])).reduce((a,c)=>a+c))

// Part 2
let p2 = grid(input2)
let p2maxRadius = getRadius(p2.vR,0,p2.vR,p2.vC)
let radiusMap = p2.grid.flatMap((x,xi)=>x.flatMap((y,yi)=>typeof y === 'number' ? [[y,getRadius(xi,yi,p2.vR,p2.vC)]]:[]))

let maxDestroyed = -1
let maxInd = -1

for(i=1;i<=p2maxRadius;i++){
    let destroyedCount = radiusMap.values().filter(([v,r])=>r===i).reduce((a,c)=>a+c[0],0);
    
    if(destroyedCount>maxDestroyed){
        maxDestroyed=destroyedCount;
        maxInd=i;
    }
}
console.log('Part 2 answer is ',maxDestroyed*maxInd)

// Part 3
let p3 = grid(input3)
let sR = p3.grid.findIndex((x)=>x.includes('S'))
let sC = p3.grid[sR].indexOf('S')
let sKey = `${sR}-${sC}`
let sRadius = getRadius(sR,sC,p3.vR,p3.vC)
let p3maxRadius = Math.min(getRadius(p3.vR,0,p3.vR,p3.vC),sRadius)
let p3minRadius = 30

// Divide grid into L/R sides and top (0)/bottom (1) quadrants (note volcano row/col is duplicated in each)
let quads = new Map([['L0',[[0,p3.vR],[0,p3.vC]]],['R0',[[0,p3.vR],[p3.vC,p3.colLen-1]]],['L1',[[p3.vR,p3.rowLen-1],[0,p3.vC]]],['R1',[[p3.vR,p3.rowLen-1],[p3.vC,p3.colLen-1]]]]) 
console.log(quads)

const getQuadrant = (r,c) => {
    return [...quads.keys()].filter((x)=>{
        let [[r1,r2],[c1,c2]] = quads.get(x);
        return r1<=r && r<=r2 && c1<=c && c<=c2;
    })
}

const nextArr = (r,c) => [[r+1,c],[r-1,c],[r,c+1],[r,c-1]].filter(([nr,nc])=>0<=nr && nr<p3.rowLen && 0<=nc && nc<p3.colLen && `${nr}-${nc}`!==p3.vKey).map((x)=>x.join('-'))

let gridObj = {}

for(i=0;i<p3.rowLen;i++){
    for(j=0;j<p3.colLen;j++){
        if(i===p3.vR && j===p3.vC) continue;

        let key = `${i}-${j}`
        gridObj[key] = {
            key: key,
            point: [i,j],
            quadrant: getQuadrant(i,j),
            val: p3.grid[i][j],
            radius: getRadius(i,j,p3.vR,p3.vC),
            next: nextArr(i,j)
        }
    }
}

//console.log(gridObj)

//time
//quadrants
//path
let midLine = Object.entries(gridObj).filter(([k,v])=>k.split('-').map(Number).every((val,i)=> (i===0 && val>p3.vR) || (i===1 && val===p3.vC)))

let baseQueue = midLine.map(([k,v])=>{
    return v.quadrant.map((q)=>{
        return {time: v.time, steps: 1, startQuad:q, minRadius: v.radius, timeKey: [v.key,q]}
    })
})


// let baseQueue = loops.map((x)=> {
//     return {time:0, steps:0, quadrant: x, minRadius:sRadius, timeKey: [sKey,x[0]].join('-') ,path: new Set([sKey]) }
// })

baseQueue.pop()

let timeObj = {}


for(m=p3minRadius;m<=p3minRadius;m++){
    let pQueue = new Map([[0,baseQueue.map((x)=>{return {...x,maxTime:m*30}})]])
    console.log(pQueue)
    let pqInd = 0
    let counter = 0
    //console.log([1].slice(0,2))
    let found = false

    while(pQueue.size>0 && !found){
        pqInd = Math.min(...pQueue.keys())
        let lastmin = pqInd
        console.log(counter,pqInd,pQueue.get(pqInd).length)
        for (const p of pQueue.get(pqInd).values().filter((x)=> x.time === 0 || timeObj[x.timeKey]>= x.time)){
            //console.log(counter)
            // check haven't seen position at shorter time
            //if((timeObj[p.timeKey] !== undefined && timeObj[p.timeKey]<p.time)||pQueue.keys().some((x)=>x<pqInd && pQueue.get(x).some((y)=> y.path.isSuperSetOf(p.path)))) continue;

            // go through neighbours and add valid to queue

            let next = gridObj[p.timeKey.slice(0,-2)].next
            //console.log(p,'next before flatmap ',next)
            if(next.includes(sKey) && p.quadrant.length===1){
                console.log('found end',p,next)// Found end
                found=true
                break
            }
            
            const nextMove = (nKey) => {
                let nxt = gridObj[nKey]
                let nextQuad = p.quadrant.slice(0,2).findLast((x)=>nxt.quadrant.includes(x))
                let newMin = Math.min(nxt.radius,p.minRadius)
                let newPath = new Set([...p.path,nKey])
                
                let n = {
                            time: nxt.val + p.time,
                            steps: p.steps+1,
                            quadrant: [...p.quadrant],
                            minRadius: newMin,
                            timeKey: [nxt.key,nextQuad].join('-'),
                            maxTime: p.maxTime,
                            path: newPath
                        }
                
                if (p.path.has(nKey) || n.minRadius < m || n.time >= p.maxTime || nextQuad === undefined ||(timeObj[n.timeKey] !== undefined && n.time>timeObj[n.timeKey])){
                    return []
                } else {
                    if(nextQuad!==n.quadrant[0]) n.quadrant.shift()
                    return [n]
                }
            }

            next=next.flatMap((nk)=>nextMove(nk)).forEach((no)=>{
                timeObj[no.timeKey] = no.time
                
                let [tR,tC] = no.timeKey.slice(0,-2).split('-').map(Number)
                let manhattan = no.quadrant.length>2 ? (Math.abs(tR-p3.vR)+Math.abs(tC-p3.vC))*(no.quadrant.length**2) : Math.floor((Math.abs(tR-sR)+Math.abs(tC-sC))/2)*(no.quadrant.length**2)

                if(pQueue.has(manhattan) && !pQueue.get(manhattan).some((x)=>x.path.isSupersetOf(no.path) && (x.timeKey === no.timeKey && x.time<=no.time))){
                    //console.log('untidy queue this time is ',no.time,pQueue.keys().filter((x)=>x>no.time && pQueue.get(x).some((y)=>no.path.isSupersetOf(no.path))).toArray.length)

                    let moreTime = pQueue.get(manhattan).indexOf((x)=>x.timeKey === no.timeKey && x.time>no.time)

                    if(moreTime !== -1){
                        pQueue.get(manhattan).splice(moreTime,1,no)
                    } else {
                        pQueue.get(manhattan).push(no)
                    }

                    
                } else {
                    pQueue.set(manhattan,[no])
                }
            })
            //console.log('next after flatmap',next)
            counter++

            if(counter%10000 === 0){
                console.log(counter,lastmin,pQueue.size,Object.keys(timeObj).length,pQueue.get(lastmin).at(-1))
            }
    
        }


        pQueue.delete(lastmin)



    }
    console.log('no found at min, m was ',m,counter)
    if(found) break;
}





    






// //Dijkstra's from start to all points on midline
// // time, radius increase, minRadius(rad inc+1) of path, path

// let tArr = Array(sRadius).fill('.').map((x,i)=>i)

// //let timeObj = {}

// // Object.keys(gridObj).forEach((x)=>{
// //     timeObj[x]={}
    
// //     tArr.forEach((y)=>{
// //         timeObj[x][y] = {}
// //         timeObj[x][y]['time']=1000000
// //         timeObj[x][y]['paths']=[]
// //     })
    
// //     //Object.fromEntries(tArr.map((x)=>[`${x}`,{time:1000000,paths:[]}]))
// // })

// // start
// // end callback fn - end keys???

// // let pQueue = [{
// //         time:0,
// //         pRadius:0,
// //         minRadius:100000,
// //         path: [sKey]
// //     }]

// // let paths = []
// // let counter = 0
// // let tcounter = 0

// // redo priority queue in iterables - array buckets


// while(pQueue.length>0){
//     let p = pQueue.shift()
//     // console.log('***** NEW LINE *****')
//     // console.log(p,p.path.at(-1))
//     // console.log('tcheck',timeObj[`${p.path.at(-1)}`])
//     // console.log(timeObj[`${p.path.at(-1)}`][`${p.pRadius}`])

//     if(p.time>0 && timeObj[`${p.path.at(-1)}-${p.pRadius}`] !== undefined && timeObj[`${p.path.at(-1)}-${p.pRadius}`]['time']<p.time) continue;



//     const getNext = (last,nextKey) => {


//         // if(timeObj?.[nextKey]?.[newRadius]?.['time'] === undefined){
//         //     console.log(last,nextKey,nxt,newRadius)
//         // }
//         if(!last.path.includes(nextKey)){
//                     let nxt = gridObj[nextKey]
//         let newRadius = Math.floor((last.time+nxt.val)/30)
//         let timeKey = `${nextKey}-${newRadius}`

//             if((timeObj[timeKey]===undefined || last.time+nxt.val<=timeObj[timeKey]['time']) && nxt.quadrant.includes(0) && newRadius <last.minRadius && newRadius < nxt.radius && newRadius < sRadius
//                 //&& gridObj[last.path.at(-1)].radius
//             ){
//                 let nxtObj = structuredClone(last)  
//                 nxtObj.time+=nxt.val
//                 nxtObj.pRadius=newRadius
//                 nxtObj.minRadius=nxt.radius<last.minRadius ? nxt.radius : last.minRadius
//                 nxtObj.path.push(nextKey)

                

//                 if(timeObj[timeKey]===undefined || nxtObj.time<timeObj[timeKey]['time']){
//                     timeObj[timeKey] = {time:nxtObj.time,paths:[nxtObj]}
//                 } else {
//                     timeObj[timeKey]['paths'].push(nxtObj)
//                     // if(nxtObj.time === timeObj[timeKey]['time']){
                        
//                     // } else {

//                     // }
//                 }

//                 // if(nxtObj.time === timeObj[nextKey][newRadius]['time']){
//                 //     timeObj[nextKey][newRadius]['paths'].push(nxtObj)
//                 // } else {
//                 //     timeObj[nextKey][newRadius]['time'] = nxtObj.time
//                 //     timeObj[nextKey][newRadius]['paths'] = [nxtObj]
//                 //     tcounter++
//                 // }

//                 //timeObj[nextKey]=nxtObj.time;
//                 //console.log('nextObj is ',nxtObj)

//                 return nxtObj

//             } else {
//                 return undefined
//             }
//         } else {
//             return undefined
//         }



//     }

//     //console.log('p is ',p,' getNext is ',gridObj[p.path.at(-1)].next.map((x)=>getNext(p,x)))

//     gridObj[p.path.at(-1)].next.forEach((x)=>{
//         if(parseInt(x.split('-')[0])===vR){
//         //if(x === sKey){
//             let xObj = gridObj[x]

//             let v=structuredClone(p)
//             v.path.push(x)
//             v.time+=xObj.val
//             v.pRadius=Math.floor(v.time/30)
//             //v.minRadius=v.pRadius+1

//             if(v.pRadius<xObj.radius && (timeObj[`${x}-${v.pRadius}`]===undefined || v.time<=timeObj[`${x}-${v.pRadius}`]['time'])){

//                 if(timeObj[`${x}-${v.pRadius}`]===undefined || v.time<timeObj[`${x}-${v.pRadius}`]['time']){
//                     timeObj[`${x}-${v.pRadius}`] = {time:v.time,paths:[v]}
//                 } else {
//                     timeObj[`${x}-${v.pRadius}`]['paths'].push(v)
//                 }

//                 // if(v.time === timeObj[x][v.pRadius]['time']){
//                 //     timeObj[x][v.pRadius]['paths'].push(v)
//                 // } else {
//                 //      timeObj[x][v.pRadius]['time'] = v.time
//                 //     timeObj[x][v.pRadius]['paths'] = [v]
//                 // }



//                 // if(timeObj[timeKey]===undefined || nxtObj.time<timeObj[timeKey]['time']){
//                 //     timeObj[timeKey] = {time:nxtObj.time,paths:[nxtObj]}
//                 // } else {
//                 //     timeObj[timeKey]['paths'].push(nxtObj)
//                 //     // if(nxtObj.time === timeObj[timeKey]['time']){
                        
//                 //     // } else {

//                 //     // }
//                 // }

//             paths.push(v)

//             console.log('found path', 'paths length is now', paths.length, 'queue length is ',pQueue.length,' counter is ',counter,v)
//             }



//         } else {
//             let nextObj = getNext(p,x)

//             if(nextObj !== undefined){
//                 // if(x === sKey){
                    
//                 //     paths.push(nextObj)
//                 if(pQueue.length===0){
//                     pQueue.push(nextObj)
//                 } else {
//                     if(nextObj.time<pQueue[0].time){
//                         pQueue.unshift(nextObj)
//                     } else if(nextObj.time>pQueue.at(-1).time){
//                         pQueue.push(nextObj)
//                     } else {
//                         pQueue.splice(pQueue.findIndex((x)=>x.time>nextObj.time),0,nextObj)
//                     }
//                 }

//                 // } else {



//                 //}
//             }
//         }
        
        

//     })
//     if(counter%10000===0){
//         console.log(' counter is ',counter, 'paths length is now',paths.length, 'queue length is ',pQueue.length)
//         console.log(Object.entries(timeObj).filter(([k,v])=>parseInt(k.split('-')[0])===vR))
//     }
//     counter++
// }

// //console.log(timeObj)
// console.log('Ended paths.length is ',paths.length)


// //console.log(paths)

// //console.log(Object.entries(timeObj).filter(([k,v])=>k.split('-')[0]==='15'))


// // quadrant <2
// // let newMinRadius=Math.floor((currTime+val)/30)
// // newMin < sRadius
// // path every > new Radius




// // const nextArr = ([r,c,v],rad,path) => [[r+1,c],[r-1,c],[r,c+1],[r,c-1]].filter(([nr,nc])=>lines?.[nr]?.[nc] !== undefined && lines?.[nr]?.[nc] !== '@' && !dist([r,c],rad) && !path.some(([pr,pc])=>pr===nr && pc===nc)).map(([nr,nc])=>lines[nr][nc])

// // for(k=1;k<=Math.floor(rowLen/2);k++){
// //     let sTotal=0
// //     for(i=0;i<rowLen;i++){
        
// //         for(j=0;j<colLen;j++){
// //             let val = lines[i][j]

// //             if(val !== '@'){


// //                 if(dist){
// //                     sTotal+=val
// //                 } 
// //             }



// //         }
        
// //     }
// //     total.push(sTotal)

// // }


// // console.log(total.map((x,i,a)=>i===0?[i+1,x]:[i+1,x-a[i-1]]).sort((a,b)=>b[1]-a[1])[0].reduce((a,c)=>a*c,1))

// // //lines.forEach((x)=>console.log(x.join('')))