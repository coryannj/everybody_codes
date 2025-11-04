const { dir } = require('console');
const fs = require('fs');
const input1 = fs.readFileSync('../quest7_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../quest7_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../quest7_3.txt',{ encoding: 'utf8', flag: 'r' });
const input4 = fs.readFileSync('../quest7_2r.txt',{ encoding: 'utf8', flag: 'r' });
const input5 = fs.readFileSync('../quest7_3r.txt',{ encoding: 'utf8', flag: 'r' });
const subs = {'=':0,'-':-1,'+':1}

// Part 1
console.log(input1.split(/[\r\n]+/).map((x)=>x.split(/[,:]/).map((y,yx)=> yx === 0 ? y : subs[y])).map((x)=>[x[0],x.slice(1).concat(x.slice(1,(10-x.slice(1).length))).map((sum = 10, n => sum += n)).reduce((acc,curr)=>acc+curr)]).sort((a,b)=>b[1]-a[1]).map((x)=>x[0]).join('')) // Part 1 answer

// Part 2
let loops2 = 10;
let chariots2 = input2.split(/[\r\n]+/).map((x)=>x.split(/[,:]/).map((y,yx)=> yx === 0 ? y : subs[y])).map((x)=>[x[0],x.slice(1)]);
let cLen = chariots2[0][1].length;

let parseTrack2 = input4.replace('S','=').split(/[\r\n]+/).map((x)=>x.replaceAll(/[\s]+/g,'').split(''));

let racetrack2 = parseTrack2[0].slice(1).concat(parseTrack2.slice(1,-1).flatMap((x)=>x[1]),parseTrack2.at(-1).reverse(),parseTrack2.slice(1,-1).flatMap((x)=>x[0]).reverse(),parseTrack2[0][0]).map((x)=>subs[x]);

console.log(Array(chariots2.length).fill('.').map((x,ix)=>Array(loops2).fill('.').map((y)=>racetrack2.slice()).flat()).map((x,ix)=>x.map((y,yx)=>y !== 0 ? y : chariots2[ix][1][yx%cLen]).map((sum = 10, n => sum += n)).reduce((acc,curr)=>acc+curr)).map((x,ix)=>[chariots2[ix][0],x]).sort((a,b)=>b[1]-a[1]).map((x)=>x[0]).join('')) // Part 2 answer

// Part 3
let cache = {}
//let loops3 = 2024
let loops3 = 11 // Will work with 11 loops only - perf goes from ~12s -> 0.2s
let rival = input3.slice(2).split(',').map((x)=>subs[x]) 
cache[rival.join('|')] = true

let planLen = rival.length

let parseTrack3 = input5.replace('S','=').split(/[\r\n]+/).map((x)=>x.split(''));
let pRow = parseTrack3.length;
let pCol = parseTrack3[0].length;
let coOrd = [last,r,c] = ['0-0',0,1]
let racetrack3 = [subs[parseTrack3[r][c]]]

const checkrc = ([row,col]) => row >= 0 && row < pRow && col >= 0 && col < pCol && `${row}-${col}` !== last && parseTrack3[row][col]!==' ' && parseTrack3[row][col]!==undefined

while (`${r}-${c}`!=='0-0'){    
    let next = [[r,c+1],[r,c-1],[r-1,c],[r+1,c]];
    coOrd = [last,r,c] = [`${r}-${c}`].concat(next.find((x)=>checkrc(x)));
    racetrack3.push(subs[parseTrack3[r][c]]);
}

let allLoops = Array(loops3).fill('.').map((y)=>racetrack3.slice()).flat()

let rivalscore = allLoops.map((x,ix)=> x !== 0 ? x : rival[ix%planLen]).map((sum = 10, n => sum += n)).reduce((acc,curr)=>acc+curr);

// From https://stackoverflow.com/questions/12303989/cartesian-product-of-multiple-arrays-in-javascript
function* cartesian(head, ...tail) {
  const remainder = tail.length > 0 ? cartesian(...tail) : [[]];
  for (let r of remainder) for (let h of head) yield [h, ...r];
}

function valid(tArr){
  let score = [0,0,0]
  for(i=0;i<11;i++){
    score[tArr[i]+1]++
  }

  if('335' === score.join('') && !cache[tArr.join('|')]){
    cache[tArr.join('|')] = true
    return true
  } else {
    return false
  }
}

let higher = 0
let pArr = Array(11).fill('.').map((x)=>[-1,0,1])
let perm = cartesian(...pArr)

for(const p of perm){  
  if(p && valid(p)){
    let thisScore = 0
    let currScore = 10
    let j = 0
    let k = allLoops.length
    
    while(k--){
        currScore += allLoops[j] !== 0 ? allLoops[j] : p[j%planLen]
        thisScore += currScore
        j++
    }

    if(thisScore>rivalscore) higher++
  }
}

console.log(higher)