const fs = require('fs');
const input1 = fs.readFileSync('../inputs/everybody_codes/2025/quest18_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../inputs/everybody_codes/2025/quest18_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../inputs/everybody_codes/2025/quest18_3.txt',{ encoding: 'utf8', flag: 'r' });

const numregex = /[-]*\d+/g

let lines1=input1.split(/[\r\n]{2,}/).map((x)=>x.split(/[\r\n]/))

const plantMap = (input) => {
    let plants=new Map();
    plants.set(0, new Map());
    plants.get(0).set('thickness',1);
    plants.get(0).set('branches', new Map());

    input.values().forEach((x,i)=>{
        let [id,thickness] = x[0];
        plants.set(id,new Map([['thickness',thickness],['branches',new Map()]]));

        x.slice(1).values().forEach((y,yi)=>{
            if(y.length===1){
                plants.get(0).get('branches').set(id,y[0]);
            } else {
                let [toId,toT] = y;
                plants.get(toId).get('branches').set(id,toT);
            }  
        })
    })

    return plants
}

const getEnergy = (plants,q) =>{
    let 
        queue = q ?? plants.get(0).get('branches').entries().filter(([id,incoming])=>incoming>0),
        hasBranches=true,
        maxPlant = Math.max(...plants.keys()),
        next = queue.next(),
        lastEnergy

    while(hasBranches){
        hasBranches=false;
        let newQueue = new Map();

            while(!next.done){
                let [id,incoming] = next.value;

                plants.get(id).get('branches').entries().forEach(([nextId,nextT])=>{
                    hasBranches=true;

                    if(!newQueue.has(nextId)){
                        newQueue.set(nextId,nextT*incoming);
                    } else {
                        newQueue.set(nextId,newQueue.get(nextId)+(nextT*incoming));
                    }
                })

                if(!hasBranches && id===maxPlant){
                    return lastEnergy=incoming;
                } 
                
                next = queue.next();
            }

        queue=newQueue.entries().filter(([id,incoming])=> incoming>=plants.get(id).get('thickness'));
        next=queue.next();
    }

    return lastEnergy ?? 0
}

// Part 1
let p1Input = input1.split(/[\r\n]{2,}/).map((x)=>x.split(/[\r\n]/).map((y)=>y.match(numregex).map(Number)));
console.log('Part 1 answer is ',getEnergy(plantMap(p1Input)));

// Part 2
const getPlants = (input) =>{
    let
        lines = input.split(/[\r\n]{2,}/),
        pInput = lines.slice(0,-1).flatMap((x)=>x.split(/[\r\n]{2,}/).map((y)=>y.split(/[\r\n]/).map((y)=>y.match(numregex).map(Number)))),
        testCases = lines.at(-1).split(/[\r\n]/).map((x)=>x.split(' ').map((y,yi)=>[yi+1,parseInt(y)])),
        plants = plantMap(pInput)
    
    return [testCases,plants]
}

let [p2TestCases,p2Plants] = getPlants(input2);
let p2Answer = 0;

p2TestCases.values().forEach((x)=>{
    x.values().forEach(([tId,tVal])=>{
        p2Plants.get(0).get('branches').set(tId,tVal);
    })

    p2Answer+=getEnergy(p2Plants);
})

console.log('Part 2 answer is ',p2Answer);

// Part 3
let [p3TestCases,p3Plants] = getPlants(input3);
let p3Answer = [];

let p3Queue = p3Plants.get(0).get('branches').entries().filter(([id,incoming])=>{
    return incoming>0 && !p3Plants.get(id).get('branches').values().some((y)=>y<0);
})

let p3MaxEnergy = getEnergy(p3Plants,p3Queue)

p3TestCases.values().forEach((x)=>{
    x.values().forEach(([tId,tVal])=>{
        p3Plants.get(0).get('branches').set(tId,tVal);
    })

    p3Answer.push(getEnergy(p3Plants))
})

console.log('Part 3 answer is ',p3Answer.filter((x)=>x>0).reduce((a,c)=>a+Math.abs(p3MaxEnergy-c),0));