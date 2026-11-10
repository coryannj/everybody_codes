const { off } = require('cluster')
const fs = require('fs')
const [eventName, year, quest] = ['lord_of_the_wings', 2026, 10]
const filePath = `../../inputs/everybody_codes/${year}/${eventName}/quest${quest}`
const [input1, input2, input3] = [1, 2, 3].map((partNo) => fs.readFileSync(`${filePath}_${partNo}.txt`, { encoding: 'utf8', flag: 'a+' }))

const arrows = { '<': 'L', '>': 'R', '^': 'U', 'v': 'D' }
const dirs = ['D', 'U', 'L', 'R']
//const 

class Ghost {
    constructor(id, key, dir) {
        this._id = id
        this._key = key
        this._dir = arrows[dir]
    }

    get id() {
        return this._id
    }

    get dir() {
        return this._dir
    }

    get key() {
        this._key
    }

    set key(k) {
        this._key = k
    }

    // turn(degrees) {
    //     this._dir = turn[degrees][this._dir]
    // }

}

// class Point {
//     constructor(key, n) {
//         this._key = key
//         this._neighbours = n
//     }

//     neighbour(dir) {
//         return this._neighbours[dir]
//     }
// }

class Grid {
    constructor(limit, partNo) {
        //this._points = {}
        this._limit = limit
        this._storeStates = partNo < 3 ? false : true
    }
    _rounds = 0
    _setState = false
    _advancedLast = false
    _states = {}
    _ghosts = new Map()
    _collisions = new Map()
    _points = undefined
    _turn = {
        90: { L: 'U', U: 'R', R: 'D', D: 'L' },
        180: { L: 'R', R: 'L', U: 'D', D: 'U' }
    }

    get rounds() {
        return this._rounds
    }

    get points() {
        return this._points
    }

    get ghosts() {
        return this._ghosts
    }

    get ghostCount() {
        return this._ghosts.size
    }

    get turn() {
        return this._turn
    }

    set points(obj) {
        this._points = obj
    }

    point(key) {
        return this._points[key]
    }

    ghost(id) {
        return this._ghosts.get(id)
    }

    collision(id) {
        let val = this._collisions.get(id)

        if (val + 1 < this._limit) {
            this._collisions.set(id, val + 1)
        } else {
            this._ghosts.delete(id)
            this._collisions.delete(id)

        }
    }

    turn(g, degrees) {
        this.collision(g.id)
        return g.key = this.turn[degrees][g.dir]
    }

    move(g) {
        //console.log('g is ', g)
        console.log(this.point(g.key))
        g.key = this.point(g.key)?.[g.dir] || this.turn(g, 90)
        // if (samedir) {
        //     g.key = samedir
        // } else {
        //     g.turn(90)
        //     this.collision(g._id)
        // }
    }

    moveGhosts() {
        this.ghosts.values().forEach((g) => this.move(g))
    }

    sameSpace() {
        Map.groupBy(this._ghosts.values(), ({ _key }) => _key).values().filter((g) => g.length > 1).forEach((g) => {
            if (g.length > 1) {
                g.forEach((ghost) => {
                    ghost.turn(180)
                    this.collision(ghost._id)
                })
            }
        })
    }

    getStateKey() {
        return JSON.stringify(this.ghosts.values().toArray())
        //console.log(this._collisions.values())
        //this._states['first'] = this._collisions.values()
        //console.log(this._states['first'])

    }

    // addPoint(k, n) {
    //     //this._points[k] = new Point(k, n)
    //     this._points[k]
    // }

    addGhost(id, key, dir) {
        this._ghosts.set(id, new Ghost(id, key, dir))
        this._collisions.set(id, 0)
    }

    *moveRound() {
        while (this.ghostCount) {
            this._rounds++
            this.moveGhosts()
            this.sameSpace()
            //console.log([this._rounds, this._collisions.values()])
            yield [this._rounds, this._collisions.values()]
        }
        yield [this._rounds, 0]
    }


}


const neighbours = (r, c) => Object.fromEntries([[r + 1, c, 'D'], [r - 1, c, 'U'], [r, c + 1, 'R'], [r, c - 1, 'L']].flatMap(([nr, nc, d]) => lines[nr][nc] !== '#' ? [[d, `${nr}_${nc}`]] : [[d, null]]))

const solve = (input, partNo) => {
    let t0 = performance.now()
    let limit = partNo === 1 ? Infinity : partNo === 2 ? 10000 : 1000000000000

    let grid = new Grid(limit, partNo)

    let lines = input.split(/[\r\n]+/).map((x) => x.split(''))

    const neighbours = (r, c) => Object.fromEntries([[r + 1, c, 'D'], [r - 1, c, 'U'], [r, c + 1, 'R'], [r, c - 1, 'L']].flatMap(([nr, nc, d]) => lines[nr][nc] !== '#' ? [[d, `${nr}_${nc}`]] : [[d, null]]))

    let gInd = 0

    let obj = Object.fromEntries(
        lines.flatMap((row, rowInd) => {
            return row.flatMap((val, colInd) => {
                if (val !== '#') {
                    let key = `${rowInd}_${colInd}`, n = neighbours(rowInd, colInd)
                    //grid.addPoint(key, n)

                    if (val !== '.') {
                        grid.addGhost(gInd++, key, val)
                    }
                    return [[key, n]]
                }
                return []
            })
        })
    )

    //console.log('obj is ', obj)
    grid.points = obj
    //grid.stateKey()
    //console.log(performance.now() - t0)
    if (partNo === 1) return grid.moveRound().find(([r, c]) => r === 10)[1].reduce((a, c) => a + c, 0)
    if (partNo === 2) return grid.moveRound().find(([r, c]) => c === 0)[0]



}

//solve(input1, 1)
let t1 = performance.now()
solve(input1, 1)
let t2 = performance.now()
solve(input2, 2)
let t3 = performance.now()
console.log(t2 - t1, t3 - t2)