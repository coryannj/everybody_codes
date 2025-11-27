const fs = require('fs');
const input1 = fs.readFileSync('../inputs/everybody_codes/2025/quest18_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../inputs/everybody_codes/2025/quest18_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../inputs/everybody_codes/2025/quest18_3.txt',{ encoding: 'utf8', flag: 'r' });

//console.log(input2.split(/[\r\n]{2,}/))

let split = input3.split(/[\r\n]{2,}/)

let linesp2 = split.slice(0,-1).flatMap((x)=>x.split(/[\r\n]{2,}/).map((y)=>y.split(/[\r\n]/)))

let testCases = split.at(-1).split(/[\r\n]/).map((x)=>x.split(' ').map((y,yi)=>[yi+1,parseInt(y)]))
//console.log(lines)
console.log(testCases.length)

let testLen = testCases[0].length

// Generate cartesian product of given iterables:
function* cartesian(head, ...tail) {
  const remainder = tail.length > 0 ? cartesian(...tail) : [[]];
  for (let r of remainder) for (let h of head) yield [h,...r];
}

// let allF = [3,691,1382,2073,2764,2764,4146]

// let cMap = [123,112,122,119,113,123,125,115,127]

// allF.forEach((x)=>{
//     console.log(x,cMap.map((y)=>x%y))
// })

// let fMap = [51,118,43,42,37,4,81,12].map((x)=>[0,x])

// //console.log([...new Set([...cartesian(...fMap)])].sort((a,b)=>a-b))

// console.log([...cartesian(...fMap)].map((x)=>{
//     let sum = x.map(Number).reduce((a,c)=>a+c)

//     return [x,sum,cMap.map((y)=>sum<y?y%sum:sum%y)]
// }).filter((x)=>x[2].includes(0)||cMap.includes(x[2].reduce((a,c)=>a+c))).map((x)=>x.concat(x[2].reduce((a,c)=>a+c))))


let cases = [0,1]

//let allTest = Array(testLen).fill('.').map((x)=>cases.slice())
//console.log(allTest)

// Example:
//let all = cartesian(...allTest).toArray().map((x,i)=>x.map((y,yi)=>[yi+1,y]))
//let oldTestCases = testCases.map((x)=>x.map((y)=>y.join('-')).join(','))
//console.log(oldTestCases)
//testCases = all
//console.log(all.length)


let lines1=input1.split(/[\r\n]{2,}/).map((x)=>x.split(/[\r\n]/))

const plantMap = (input) => {
    let plants=new Map()
    plants.set(0,new Map())
    plants.get(0).set('thickness',1)
    plants.get(0).set('branches',new Map())

    let idregex = /[-]*\d+/g

    //console.log('Plant 1 with thickness 1:'.match(idregex))

    //lines = lines.split(/[\r\n]{2,}/).map((x)=>x.split(/[\r\n]/))
    //console.log(lines)


    input.forEach((x,i)=>{
        //console.log('x is ',x)
        let [id,thickness] = x[0].match(idregex).map(Number)
        plants.set(id,new Map())
        plants.get(id).set('thickness',thickness)
        plants.get(id).set('branches',new Map())

        x.slice(1).forEach((y,yi)=>{
            if(y.includes('free')){
                let [bt] = y.match(idregex).map(Number)
                plants.get(0).get('branches').set(id,bt)
            } else {
                let [toId,toT] = y.match(idregex).map(Number)

                //plants.get(id).get('branches').set(toId,toT)
                plants.get(toId).get('branches').set(id,toT)
            }
            
        })

        //console.log(plants)
    })

    return plants
}

//console.log(plantMap(lines1))

let p2plants = plantMap(linesp2)
console.log([...p2plants.entries()].slice(-30))

let allIncoming = Object.fromEntries(Array(110).fill('.').map((x,i)=>[i,[p2plants.get(i).get('thickness')]]))

p2plants.keys().forEach((x)=>{
    let val = p2plants.get(x)

    if(val.has('branches')){
        val.get('branches').entries().forEach(([bId,bT])=>allIncoming[bId].push(bT))
    }
    
    
    //console.log('key is ',x,val)
})
//console.log(allIncoming)

Object.entries(allIncoming).forEach(([k,v])=>{
    let t = v[0]
    let rest = v.slice(1)
    

    

    if(rest.length>1){
        
        let restSum = rest.filter((x)=>x>0).reduce((a,c)=>a+c)
        if(restSum>=t){
            console.log('SUM FOUND id is ',k, rest.filter((x)=>x>0),' can sum to ',t, 'max sum is ',restSum, ' all vals is ',rest.sort((a,b)=>a-b))
            console.log('this thickness is ',p2plants.get(parseInt(k)).get('thickness'),' next branches is ',p2plants.get(parseInt(k)).get('branches'))
            //console.log('val is ',k,t,rest.sort((a,b)=>a-b))
        }
        
    }
})



console.log([...p2plants.entries()].slice(-30))
console.log(Math.max(...p2plants.keys()))

let maxPlant = Math.max(...p2plants.keys())

//console.log(plants)
// let tPlants = new Map()
// tPlants.set(5,new Map())
// tPlants.set(4,new Map())
// tPlants.get(5).set('thickness',1)
// tPlants.get(4).set('thickness',17)
// console.log(tPlants)
// tPlants.get(5).get('thickness')+=1

// console.log(tPlants)

// let t = new Map([[5,1],[4,23]])
// console.log(t)
// let q = t.entries().filter(([id,incoming])=>incoming>=tPlants.get(id).get('thickness'))

// console.log(q.next())
// console.log(q.next())

const getEnergy = (plants) =>{
    let queue = plants.get(0).get('branches').entries().filter(([id,incoming])=>incoming>0)
    let hasBranches=true
    let next = queue.next()
    let lastEnergy

    while(hasBranches){
    hasBranches=false
    let newQueue = new Map()

        while(!next.done){
            let [id,incoming] = next.value
            //console.log('id,incoming',id,incoming)
            //let thickness = plants.get(id).get('thickness')

            plants.get(id).get('branches').entries().forEach(([nextId,nextT])=>{
                hasBranches=true
                if(!newQueue.has(nextId)){
                    newQueue.set(nextId,nextT*incoming)
                } else {
                    newQueue.set(nextId,newQueue.get(nextId)+(nextT*incoming))
                }
            })
            if(!hasBranches && id===maxPlant){
                console.log('no branches',id,incoming,plants.get(id))
                lastEnergy=incoming
            } 
            next = queue.next()
        }
    console.log('loop done, newQueue is ',newQueue)
    queue=newQueue.entries().filter(([id,incoming])=> incoming>=plants.get(id).get('thickness'))
    next=queue.next()
    
    }

    return lastEnergy ?? 0
}

//console.log(getEnergy(plantMap(lines1)))

console.log([123,112,122,119,113,123,125,115,127].map((x)=>[x,8292%x]))

let p2ans = []

let p2m = []

testCases.forEach((x,i)=>{
    console.log('***** NEW LINE *****')
    console.log(x.map((v)=>v[1]))
    x.forEach(([tId,tVal])=>{
        p2plants.get(0).get('branches').set(tId,tVal)
    })
    let last = getEnergy(p2plants)

    p2ans.push(last)

    if(oldTestCases.includes(x.map((y)=>y.join('-')).join(','))){
        p2m.push(last)
    }
    
})

console.log(p2ans)

let maxLast = Math.max(...p2ans)
console.log(p2m)
console.log(p2m.filter((x)=>x>0).map((x)=>Math.abs(x-maxLast)).reduce((a,c)=>a+c))


// console.log(next)



// console.log('answer is ',ans)