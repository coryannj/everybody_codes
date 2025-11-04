const fs = require('fs');
const input = fs.readFileSync('../quest2.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../quest2_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../quest2_3.txt',{ encoding: 'utf8', flag: 'r' });

// Part 1
let lines = input.split(/[\r\n]+/)

let words = lines[0].replace('WORDS:','').split(',')
let helmet = lines[1]

let p1Count = 0

words.forEach((word)=>{
    const myRe = new RegExp(`${word}`, "g");
    p1Count += helmet.match(myRe).length
})

console.log(p1Count)

// Part 2
let p2lines = input2.split(/[\r\n]+/)
let words2 = [...new Set(p2lines[0].replace('WORDS:','').split(',').flatMap((x)=>[x,x.split('').reverse().join('')]))]
let inscription2 = p2lines.slice(1)
let p2Count = 0

inscription2.forEach((line)=>{
    let matchIndexes = new Set()
    words2.forEach((word)=>{
        const myRe = new RegExp(`((?=${word}))`, "gd");

        let m1 = [...line.matchAll(myRe)]
        
        m1.forEach((x)=>{
            let [s1,e1] = x.indices[0]

            for(i=s1;i<s1+word.length;i++){
                matchIndexes.add(i)
            }
        })
    })

    p2Count+=matchIndexes.size

})

console.log(p2Count)

// Part 3
let p3lines = input3.split(/[\r\n]+/)
let words3 = [...new Set(p3lines[0].replace('WORDS:','').split(',').flatMap((x)=>[x,x.split('').reverse().join('')]))]
let grid = p3lines.slice(1).map((x)=>x.split(''))
let rows = p3lines.slice(1)
let cols = grid[0].map((_, colIndex) => grid.map(row => row[colIndex])).map((x)=>x.join(''))
let p3Seen = new Set()

rows.forEach((line,lineind)=>{
    words3.forEach((word)=>{
        const myRe = new RegExp(`((?=${word}))`, "gd");

        let m1 = [...line.matchAll(myRe)]
        
        m1.forEach((x)=>{
            let [s1,e1] = x.indices[0]

            for(i=s1;i<s1+word.length;i++){
                p3Seen.add(`${lineind}-${i}`)
            }
        })

        // Check wrap around
        if(word.length>1){
            let start = line.slice(0,word.length-1)
            let startInds = start.split('').map((x,ix)=>ix)
            let end = line.slice((-1*(word.length-1)))
            let endInds = end.split('').map((x,ix)=>ix+(line.length-word.length+1))
    
            let wrap = end+start
            let wrapInds = endInds.concat(startInds)
    
            let m2 = [...wrap.matchAll(myRe)]
    
            m2.forEach((x)=>{
                let [s1,e1] = x.indices[0]
    
                for(i=s1;i<s1+word.length;i++){
                    p3Seen.add(`${lineind}-${wrapInds[i]}`)
                }
            })
        }
    })
})

cols.forEach((line,lineind)=>{
    words3.forEach((word)=>{
        const myRe = new RegExp(`((?=${word}))`, "gd");

        let m1 = [...line.matchAll(myRe)]
        
        m1.forEach((x)=>{
            let [s1,e1] = x.indices[0]

            for(i=s1;i<s1+word.length;i++){
                p3Seen.add(`${i}-${lineind}`)
            }
        })
    })
})

console.log(p3Seen.size)
