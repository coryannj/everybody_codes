const fs = require('fs');
const input1 = fs.readFileSync('../inputs/everybody_codes/2025/quest17_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../inputs/everybody_codes/2025/quest17_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../inputs/everybody_codes/2025/quest17_3.txt',{ encoding: 'utf8', flag: 'r' });

// Part 1
lines=input3.split(/[\r\n]/).map((x,xi)=>x.split('').map((y,yi)=>'@S'.includes(y)?y:parseInt(y)))
let len = lines.length
let vR = lines.findIndex((x)=>x.includes('@'))
let vC = lines[vR].indexOf('@')

const getRadius = (r,c) => Math.floor(Math.sqrt(((vR - r) ** 2) + ((vC - c) ** 2)));

const inRadius = (r,c,radius) => ((vR - r) ** 2) + ((vC - c) ** 2) <= radius ** 2;

let sR = lines.findIndex((x)=>x.includes('S'))
let sC = lines[sR].indexOf('S')
let sKey = `${sR}-${sC}`
let sRadius = getRadius(sR,sC)

console.log(len,'vr vc',vR,vC,'sr sc',sR,sC,'sRad',sRadius)

// Divide grid into quadrants: 0 = top left, 1 = top right, 2 = bottom right, 3 = bottom left (note volcano row/col is duplicated in each)
let quads = new Map([[0,[[0,vR],[0,vC]]],[1,[[0,vR],[vC,len-1]]],[2,[[vR,len-1],[vC,len-1]]],[3,[[vR,len-1],[0,vC]]]]) 

const getQuadrant = (r,c) => {
    return [...quads.keys()].filter((x)=>{
        let [[r1,r2],[c1,c2]] = quads.get(x);
        return r1<=r && r<=r2 && c1<=c && c<=c2;
    })
}

const nextArr = (r,c) => [[r+1,c],[r-1,c],[r,c+1],[r,c-1]].filter(([nr,nc])=>lines?.[nr]?.[nc] !== undefined && lines?.[nr]?.[nc] !== '@').map((x)=>x.join('-'))

let gridObj = {}

for(i=0;i<len;i++){
    for(j=0;j<len;j++){
        if(i===vR && j===vC) continue;

        let key = `${i}-${j}`
        gridObj[key] = {
            key: key,
            point: [i,j],
            quadrant: getQuadrant(i,j),
            val: lines[i][j],
            radius: getRadius(i,j),
            next: nextArr(i,j)
        }
    }
}

//console.log(gridObj)

//Dijkstra's from start to all points on midline
// time, radius increase, minRadius(rad inc+1) of path, path

let tArr = Array(sRadius).fill('.').map((x,i)=>i)

let timeObj = {}

Object.keys(gridObj).forEach((x)=>{
    timeObj[x]={}
    
    tArr.forEach((y)=>{
        timeObj[x][y] = {}
        timeObj[x][y]['time']=1000000
        timeObj[x][y]['paths']=[]
    })
    
    //Object.fromEntries(tArr.map((x)=>[`${x}`,{time:1000000,paths:[]}]))
})

// start
// end callback fn - end keys???









let pQueue = [{
        time:0,
        pRadius:0,
        minRadius:0,
        path: [sKey]
    }]

let paths = []
let counter = 0
let tcounter = 0

while(pQueue.length>0){
    let p = pQueue.shift()
    // console.log('***** NEW LINE *****')
    // console.log(p,p.path.at(-1))
    // console.log('tcheck',timeObj[`${p.path.at(-1)}`])
    // console.log(timeObj[`${p.path.at(-1)}`][`${p.pRadius}`])

    if(p.time>0 && timeObj[p.path.at(-1)][`${p.pRadius}`].time<p.time) continue;



    const getNext = (last,nextKey) => {


        // if(timeObj?.[nextKey]?.[newRadius]?.['time'] === undefined){
        //     console.log(last,nextKey,nxt,newRadius)
        // }
        if(!last.path.includes(nextKey)){
                    let nxt = gridObj[nextKey]
        let newRadius = Math.floor((last.time+nxt.val)/30)
        let nxtObj = structuredClone(last)

            if(last.time+nxt.val<=timeObj[nextKey][newRadius]['time'] && nxt.quadrant.every((n)=>n<2) && newRadius < nxt.radius && newRadius < sRadius 
                //&& gridObj[last.path.at(-1)].radius
            ){
                
                nxtObj.time+=nxt.val
                nxtObj.pRadius=newRadius
                nxtObj.minRadius=newRadius+1
                nxtObj.path.push(nextKey)

                if(nxtObj.time === timeObj[nextKey][newRadius]['time']){
                    timeObj[nextKey][newRadius]['paths'].push(nxtObj)
                } else {
                    timeObj[nextKey][newRadius]['time'] = nxtObj.time
                    timeObj[nextKey][newRadius]['paths'] = [nxtObj]
                    tcounter++
                }

                //timeObj[nextKey]=nxtObj.time;
                //console.log('nextObj is ',nxtObj)

                return nxtObj

            } else {
                return undefined
            }
        } else {
            return undefined
        }



    }

    //console.log('p is ',p,' getNext is ',gridObj[p.path.at(-1)].next.map((x)=>getNext(p,x)))

    gridObj[p.path.at(-1)].next.forEach((x)=>{
        if(parseInt(x[0])===vR){
        //if(x === sKey){
            let xObj = gridObj[x]

            let v=structuredClone(p)
            v.path.push(x)
            v.time+=xObj.val
            v.pRadius=Math.floor(v.time/30)
            //v.minRadius=v.pRadius+1

            if(v.pRadius<xObj.radius && v.time<=timeObj[x][v.pRadius]['time']){
                if(v.time === timeObj[x][v.pRadius]['time']){
                    timeObj[x][v.pRadius]['paths'].push(v)
                } else {
                     timeObj[x][v.pRadius]['time'] = v.time
                    timeObj[x][v.pRadius]['paths'] = [v]
                }

            paths.push(v)

            console.log('found path', 'paths length is now', paths.length, 'queue length is ',pQueue.length,' counter is ',counter,v)
            }



        } else {
            let nextObj = getNext(p,x)

            if(nextObj !== undefined){
                // if(x === sKey){
                    
                //     paths.push(nextObj)
                if(pQueue.length===0){
                    pQueue.push(nextObj)
                } else {
                    if(nextObj.time<pQueue[0].time){
                        pQueue.unshift(nextObj)
                    } else if(nextObj.time>pQueue.at(-1).time){
                        pQueue.push(nextObj)
                    } else {
                        pQueue.splice(pQueue.findIndex((x)=>x.time>nextObj.time),0,nextObj)
                    }
                }

                // } else {



                //}
            }
        }
        
        

    })
    if(counter%10000===0){
        console.log(' counter is ',counter, 'paths length is now',paths.length, 'queue length is ',pQueue.length)
    }
    counter++
}

//console.log(timeObj)
console.log('Ended paths.length is ',paths.length)


//console.log(paths)

console.log(timeObj)


// quadrant <2
// let newMinRadius=Math.floor((currTime+val)/30)
// newMin < sRadius
// path every > new Radius




// const nextArr = ([r,c,v],rad,path) => [[r+1,c],[r-1,c],[r,c+1],[r,c-1]].filter(([nr,nc])=>lines?.[nr]?.[nc] !== undefined && lines?.[nr]?.[nc] !== '@' && !dist([r,c],rad) && !path.some(([pr,pc])=>pr===nr && pc===nc)).map(([nr,nc])=>lines[nr][nc])

// for(k=1;k<=Math.floor(rowLen/2);k++){
//     let sTotal=0
//     for(i=0;i<rowLen;i++){
        
//         for(j=0;j<colLen;j++){
//             let val = lines[i][j]

//             if(val !== '@'){


//                 if(dist){
//                     sTotal+=val
//                 } 
//             }



//         }
        
//     }
//     total.push(sTotal)

// }


// console.log(total.map((x,i,a)=>i===0?[i+1,x]:[i+1,x-a[i-1]]).sort((a,b)=>b[1]-a[1])[0].reduce((a,c)=>a*c,1))

// //lines.forEach((x)=>console.log(x.join('')))