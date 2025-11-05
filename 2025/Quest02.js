let part1 = [139,50]
let part2 = [-79775,15616]

const cycle = (a,noCycles,divideBy,checkRange) => {
    let counter = 0
    let r = [0,0]

    while(counter < noCycles){
        r = [
                Math.trunc(((r[0] * r[0]) - (r[1] * r[1])) / divideBy) + a[0], //x
                Math.trunc(((r[0] * r[1]) + (r[1] * r[0])) / divideBy) + a[1] //y
            ];

        if(checkRange){
            if(r.some((x)=> x < -1000000 || x > 1000000)) break;
        }
        counter++;
    }

    return {"r":r, "noOfCycles":counter}
}

const engraved = (a,noCycles,divideBy,gridStep,checkRange) => {
    let a2 = a.map((x)=>x+1000)
    let points = []

    for(i=a[0]; i<=a2[0]; i+=gridStep){
        for(j=a[1]; j<=a2[1]; j+=gridStep){
            let check = cycle([i,j],noCycles,divideBy,gridStep,checkRange)

            if (check.noOfCycles === 100) points.push(check.r)
        }
    }

    return points.length
}

console.log(cycle(part1,3,10).r) // Part 1
console.log(engraved(part2,100,100000,10,true)) // Part 2
console.log(engraved(part2,100,100000,1,true)) // Part 3