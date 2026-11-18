const { off } = require('cluster')
const fs = require('fs')
const [eventName, year, quest] = ['lord_of_the_wings', 2026, 12]
const filePath = `../../inputs/everybody_codes/${year}/${eventName}/quest${quest}`
const [input1, input2, input3] = [1, 2, 3].map((partNo) => fs.readFileSync(`${filePath}_${partNo}.txt`, { encoding: 'utf8', flag: 'a+' }))


let lines = input1.split(/[\r\n]+/).map((x) => x.split(''))

class Vertice {
    constructor(id,r,c,type,n) {
        this.id = id
        this.row = r
        this.col = c
        this.type = type
        this.neighbours = n
    }
}

class Edge {
    constructor(vertices){
        this.start = vertices[0]
        this.end = vertices[1] || vertices[0]
        //this.vertices = vertices
        this.direction = vertices.length === 1 ? 'b' : vertices[0].row === vertices[1].row ? 'h' : 'v'
    }
}

class Rectangle {
    constructor(edges) {
        //this.id = id
        this.edges = edges
        //this.vertices = vertices 
    }


    // spells() {
    //     return Math.min(this.height, this.width)
    // }
}

//let vertices = []

let vId = 0
let rId = 0

const nSides = (r, c) => [[r - 1, c, 'U'], [r + 1, c, 'D'], [r, c + 1, 'R'], [r, c - 1, 'L']].flatMap(([nr, nc, nd]) => lines?.[nr]?.[nc] && lines[nr][nc] !== '.' ? [[nr, nc, nd]] : [])

const nCorners = (r,c) => [[r-1,c-1,'TL'],[r-1,c+1,'TR'],[r+1,c-1,'BL'],[r+1,c+1,'BR']].filter(([nr,nc])=>lines?.[nr]?.[nc] && lines[nr][nc] !== '.')

const cDirs = ['TL','TR','BL','BR']
const dirs = ['T','B','L','R']
const oppDirs = {T:'B',B:'T',R:'L',L:'R'}


// const makeConcave = (r,c,corners) => {
//     return [new Vertice(vId++,r,c,'concave',cDirs.find((d)=>!corners.some(([nr,nc,nd])=>nd === d)))]
// }

const makeConvex = (r,c,neighbours) => {
    
    //if(!neighbours.length) return cDirs.map((d)=>new Vertice(vId++,r,c,'convex',d))
    //let vDirs = ['T','B'].flatMap((d)=>neighbours.some(([nr,nc,nd])=>nd === d) ? [oppDirs[d]] : [])

    //let hDirs = ['L','R'].flatMap((d)=>neighbours.some(([nr,nc,nd])=>nd === d) ? [oppDirs[d]] : [])

    //return vDirs.flatMap((vd)=>hDirs.map((hd)=>`${vd}${hd}`)).map((d)=>new Vertice(vId++,r,c,'convex',d))

}

const findCorners = (r,c) => {
    if(lines[r][c] === '.') return []
    let neighbours = nSides(r,c)
    //let corners = nCorners(r,c)
    //let nLen = neighbours.length
    return !neighbours.length || (neighbours.length<=2 && !['U','D'].every((d)=>neighbours.some(([nr,nc,nd])=>nd===d)) && !['L','R'].every((d)=>neighbours.some(([nr,nc,nd])=>nd === d))) ? [new Vertice(vId++,r,c,'convex',neighbours.map(([nr,nc,nd])=>nd))] : []
    //let cLen = corners.length
    //if(nLen+cLen === 8) return []
    //if(nLen+cLen === 0) return makeConvex(r,c,neighbours)
    
    // if(nLen<=2)



    // if(neighbours.length === 4){
        
    //     if(corners.length === 3){
    //         // get dir
    //         return makeConcave(r,c,corners)
    //     }
    //     return []
    // } else if (neighbours.length<=2){
    //     return makeConvex(r,c,neighbours)
    // }
    // return []
}

let vertices = lines.flatMap((row,rowInd)=>row.flatMap((val,colInd)=>findCorners(rowInd,colInd)))
let byRow = Map.groupBy(vertices,({row})=>row)
let byCol = Map.groupBy(vertices,({col})=>col)

let edges = []
let rectangles = []
let orphans = []

//console.log(byRow)

byRow.entries().forEach(([r,arr])=>{
    //console.log('r is ',r,' vArr is ',vArr)
    let vArr = arr.slice(0)
    while(vArr.length){
        let v = vArr.shift()
        if(v.neighbours.length === 0){
            let e = new Edge([v])
            edges.push(e)
            rectangles.push(new Rectangle([e]))
            //console.log(edges[0],rectangles[0])


            continue;
        } else if(v.neighbours.includes('R')){
            if(vArr.length && vArr[0].neighbours.includes('L')){
                let next = vArr.shift()
                edges.push(new Edge([v,next]))
                if(v.neighbours)
            } else {
                orphans.push(v)
            }
        } else if(v.neighbours.includes('L')) {
            orphans.push(v)
        } 
        
        // else {
        //     //edges.push(new Edge([v]))
        // }
    }
    //console.log('r is ',r,'edges',edges,'orphans',orphans)

})

byCol.entries().forEach(([c,arr])=>{
    let vArr = arr.slice(0)
    //console.log(c,vArr)
    while(vArr.length){
        let v = vArr.shift()
        if(v.neighbours.includes('D')){
            if(vArr.length && vArr[0].neighbours.includes('U')){
                let next = vArr.shift()
                edges.push(new Edge([v,next]))
            } else {
                orphans.push(v)
            }
        } else if (v.neighbours.includes('U')){
            orphans.push(v)
        }
    }
})

console.log(edges)
console.log(orphans)
console.log(rectangles[0])


// lines.forEach((row, rowInd) => {
//     row.forEach((val, colInd) => {
//         if (val !== '.') {
//             let isTopLeftCorner = isStackCorner(rowInd, colInd)
//             if (isTopLeftCorner) {

//                 //Go right then down
//                 let right = findRight(rowInd, colInd)
//                 let rightbottom = findBottom(rowInd, right)
//                 let isRBCorner = isCorner(rightbottom, right)

                

//                 //Go down then right
//                 let bottom = findBottom(rowInd, colInd)
//                 let leftbottom = findRight(bottom, colInd)
//                 let isLBCorner = isCorner(bottom, leftbottom)
//                 console.log('corner found at', rowInd, colInd, 'right is ', right, ' rightbottom is ', rightbottom, ' and isCorner', isRBCorner)
//                 console.log('bottom is ', bottom, ' leftbottom is ', leftbottom, ' and isCorner ', isLBCorner)

//                 //stacks.push(new Stack(rId++, rowInd, findRight(rowInd, colInd), findBottom(rowInd, colInd), colInd, val))

//             }
//         }
//     })
// })

//console.log(stacks.map((s) => s.spells()).reduce((a, c) => a + c, 0))




// const isStackCorner = (r, c) => neighbours(r, c).every(([nr, nc, nd]) => nd !== 'U' && nd !== 'L')






// const convex = (r, c) => {
//     let n = neighbours(r, c)
//     if(n.length>2) return []
//     let dirs = ['T','B','R','L'].filter((d)=>!n.some(([nr,nc,nd])=>nd === d))
//     if(dirs.length === 2) return [[r,c,dirs.join('')]]
//     let result = []
//     if(dirs.includes('T')){
//         if(dirs.includes('L')){
//             result.push('TL')
//         }
//         if(dirs.includes('R')){
//             result.push('TR')
//         }
//     }
//     if(dirs.includes('B')){
//         if(dirs.includes('L')){
//             result.push('TL')
//         }
//         if(dirs.includes('R')){
//             result.push('TR')
//         }
//     }
//     return [result.map((d)=>[r,c,d])]
// }
// const concave = (r,c) => {
//     let neighbours
// }
    
    
//     adjacent.concat(nCorners(r,c)).length === 8  




// const goRight = (r, c) => {
//     //let right = 0
//     let next = neighbours(r, c).find(([nr, nc, nd]) => nd === 'R')

//     while (next) {
//         let [nr, nc, nd] = next
//         c = nc
//         next = neighbours(r, c).find(([nr, nc, nd]) => nd === 'R')
//     }
//     return [nr,nc]
// }

// const goDown = (r, c) => {
//     let next = neighbours(r, c).find(([nr, nc, nd]) => nd === 'D')
//     while (next) {
//         let [nr, nc, nd] = next
//         r = nr
//         next = neighbours(r, c).find(([nr, nc, nd]) => nd === 'D')
//     }
//     return r
// }

// let rId = 0