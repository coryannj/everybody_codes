const { dir } = require('console');
const fs = require('fs');

// Part 1
let odd = Array(2025).fill('.').map((x,ix)=>(ix*2)+1)
let oddSums = odd.map((sum = 0, n => sum += n))
let blocks = 4099279
let oddInd = oddSums.findLastIndex((x,ix,arr)=>arr[ix-1]<blocks)
console.log((oddSums[oddInd]-blocks)*odd[oddInd])

// Part 2
let nP = 848
let nA = 1111
let width = 1
let thickness = 1
let blocks2 = 20240000
let total = 1

while(total<blocks2){
  width+=2
  thickness*=nP
  thickness%=nA
  total+=(width*thickness)
}

console.log((total-blocks2)*width)

// Part 3
let nP3 = 972477
let nA3 = 10

let blocks3 = 202400000
let width3 = 1
let thickness3 = 1
let total3 = 1
let lastLayer = [1]

while(total3<blocks3){
  thickness3 = (thickness3*nP3)%nA3 + nA3
  width3+=2
  let tWidth = width3
  let nextLayer = []
  total3 = 0
  while(tWidth--){
    if(tWidth === width3-1 || tWidth === 0){
      nextLayer.push(thickness3)
      total3+=thickness3
    } else {
      let x = lastLayer[tWidth-1]+thickness3
      nextLayer.push(x)
      total3+=(x-((nP3*width3*x)%nA3))
    }
  }

  lastLayer = nextLayer
}

console.log(total3-blocks3)