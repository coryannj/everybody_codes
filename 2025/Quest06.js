const fs = require('fs');
const input1 = fs.readFileSync('../inputs/everybody_codes/2025/quest6_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../inputs/everybody_codes/2025/quest6_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../inputs/everybody_codes/2025/quest6_3.txt',{ encoding: 'utf8', flag: 'r' });

let list = input1.split('')
let list2 = input2.split('')
let list3 = input3.split('')
console.log(list3.length)

console.log(list.filter((x)=>x==='a'||x==='A').map((x,i,a)=>x===x.toLowerCase()?a.filter((y,yi)=>yi<i && y===x.toUpperCase()).length:x).filter((x)=>typeof(x)==='number').reduce((a,c)=>a+c))

console.log(list2.map((x,i,a)=>x===x.toLowerCase()?a.filter((y,yi)=>yi<i && y===x.toUpperCase()).length:x).filter((x)=>typeof(x)==='number').reduce((a,c)=>a+c))

let r=1000

let list4 = Array(1000).fill(input3).map((x)=>x.split('')).flat()

console.log(new Set([...input3.split('')]))
console.log(input3.split('').length)

let len=input3.length

console.log(len)
//let start=list3
//let start = [...input3.split(''),...input3.split('')]
let start = [...input3.split(''),...input3.split('').slice(0,1000)]
let middle = [...input3.split('').slice(-1000),...input3.split(''),...input3.split('').slice(0,1000)]
let end = [...input3.split('').slice(-1000),...input3.split('')]
console.log(start.length,middle.length,end.length)
let s = [0,9999]
let m = [1000,10999]
let e = [1000,10999]

let result=0
let result2=0
let result3=0
let limit=10

for(const [i,x]of start.entries()){
    if(i>s[1])break;

    if(x===x.toLowerCase()){
        let mentors = start.filter((y,yi)=>y===x.toUpperCase() && yi>i-1000 && yi<i+1000).length
        result+=mentors
    }
}
console.log(result,result2,result3)
for(const [i,x]of end.entries()){
    //if(i<e[1])continue;
    if(i>=e[0] && x===x.toLowerCase()){
        let mentors = start.filter((y,yi)=>y===x.toUpperCase() && yi>i-1000 && yi<i+1000).length
        result2+=mentors
    }
}
console.log(result,result2,result3)
for(const [i,x]of middle.entries()){
    //if(i<e[1])continue;
    if(i>m[1])break;
    if(i>=m[0] && x===x.toLowerCase()){
        let mentors = middle.filter((y,yi)=>y===x.toUpperCase() && yi>i-1000 && yi<i+1000).length
        result3+=mentors
    }
}

console.log(result,result2,result3)

console.log(result+result2+(998*result3))
//1620257
//178
