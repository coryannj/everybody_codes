const { off } = require('cluster')
const fs = require('fs')
const [eventName, year, quest] = ['lord_of_the_wings', 2026, 13]
const filePath = `../../inputs/everybody_codes/${year}/${eventName}/quest${quest}`
const [input1, input2, input3] = [1, 2, 3].map((partNo) => fs.readFileSync(`${filePath}_${partNo}.txt`, { encoding: 'utf8', flag: 'a+' }))


let lines = input1.split(/[\r\n]+/).map((x, i) => i === 1 ? x.split(' ')[1].split(':').map((y) => y === 'CW' ? 1 : -1) : x.split(' ')[1].match(/\d+/g).map(Number))
let cLen = lines[0].length

const getMoves = (hands, step, start) => {
    let moves = Array(hands).fill(0).map((x, i) => x + (i * (360 / hands))).map((x, i, a) => step > 0 ? [x, a[i + 1] || 0] : [a.at(i + step), x])

    if (start === 0) return step > 0 ? moves : moves.reverse()
    let first, second
    if (step === 1) {
        first = moves.slice(start)
        second = moves.slice(0, start)
    } else {
        first = moves.slice(0, start + 1).reverse()
        second = moves.slice(start + 1).reverse()
    }
    return first.concat(second)
}

//console.log(m(8, -1, 4))

const lastMove = (moves, seconds, step) => {
    let last = moves[(seconds - 1) % moves.length]
    console.log('last is ', seconds, last)
    return step > 0 ? last[1] : last[0]
}

//console.log(lastMove(m(8, -1, 4), 7, -1))

class Hand {
    constructor([hands, step, start, seconds]) {
        this.hands = hands
        this.seconds = seconds
        this.start = start
        this.step = step
        this.spacing = 360 / hands
        this.moves = getMoves(hands, step, start)
    }

    // set seconds(s) {
    //     this.seconds =
    // }

    *allMoves() {
        let last = lastMove(this.moves, this.seconds, this.step)

        //this.seconds--
        outer: {
            while (this.seconds) {
                for (const m of this.moves) {
                    this.seconds--
                    yield [this.seconds, this.step, m]
                    if (this.seconds === 0) break outer

                }
            }
        }

        while (true) {
            yield [this.seconds, this.step, last]
        }
    }

}

let [h1, h2, h3] = Array(cLen).fill().map((x, i) => lines.map((x) => x[i])).map((x) => new Hand(x)).sort((a, b) => {
    if (a.seconds === b.seconds) {
        return b.hands - a.hands
    }
    return b.seconds - a.seconds
})

let max = h1.seconds

console.log(h1, h2, h3)

const meeting = (a, b) => {
    if (typeof a === 'object' && typeof b === 'object') {
        let [s1, step1, [n1, n2]] = a
        let [s2, step2, [n3, n4]] = b
        let [start1, end1] = step1 > 0 ? [n1, n2] : [n2, n1]
        let [start2, end2] = step2 > 0 ? [n1, n2] : [n2, n1]
        if (end1 === end2) return 1

    } else {

    }

}


let h1Arr = h1.allMoves().take(max).toArray()
let h2Arr = h2.allMoves().take(max).toArray()
let h3Arr = h3.allMoves().take(max).toArray()
console.log(h1Arr)
console.log(h2Arr)
console.log(h3Arr)