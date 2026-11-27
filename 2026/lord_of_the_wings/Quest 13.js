import { lcm, gcd } from '../../inputs/utils.js';
import { readFileSync } from 'node:fs';
const [eventName, year, quest] = ['lord_of_the_wings', 2026, 13]
const filePath = `../../inputs/everybody_codes/${year}/${eventName}/quest${quest}`
const [input1, input2, input3] = [1, 2, 3].map((partNo) => readFileSync(`${filePath}_${partNo}.txt`, { encoding: 'utf8', flag: 'a+' }))

class Hand {
    constructor([hands, step, start, seconds], multiple, startVal, endVal, moves) {
        this.hands = hands
        this.seconds = seconds
        this.start = start
        this.step = step
        this.spacing = multiple / hands
        this.startVal = startVal
        this.endVal = endVal
        this.moves = moves
        this.multiple = multiple
    }

    *allMoves() {
        let currVal = this.startVal
        let t = 0

        outer: {
            while (this.seconds) {
                for (const m of this.moves) {
                    t++
                    yield [t, this.step, currVal, m]
                    if (t === this.seconds) break outer;
                    currVal = m
                }
            }
        }

        while (true) {
            yield [null, this.step, this.endVal, this.endVal]
        }
    }

    static isMeeting([t1, d1, p1, n1], [t2, d2, p2, n2], multiple) {
        if ((!t1 && !t2) || (p1 === p2)) return false
        if (n1 === n2) return true
        if (!t1) return d2 > 0 ? (p2 < n1 && n1 <= (n2 || multiple)) : (n2 <= n1 && n1 < (p2 || multiple))

        if (d1 === d2) {
            if (d1 > 0) { // both clockwise
                return (p2 < p1 && (n1 || multiple) < (n2 || multiple)) || (p1 < p2 && (n2 || multiple) < (n1 || multiple))
            } else { // both counter clockwise
                return (n1 < n2 && (p2 || multiple) < (p1 || multiple)) || (n2 < n1 && (p1 || multiple) < (p2 || multiple))
            }
        } else {
            if (d1 > 0) {
                return (n2 <= p1 && p1 < (p2 || multiple)) || p1 <= n2 && n2 < (n1 || multiple)
            } else {
                return (n1 <= p2 && p2 < (p1 || multiple)) || (p2 <= n1 && n1 < (n2 || multiple))
            }
        }
    }

    static isOverlap([t1, d1, p1, n1], [t2, d2, p2, n2], multiple) {
        let [s1, e1] = d1 > 0 ? [p1, n1 || multiple] : [n1, p1 || multiple]
        let [s2, e2] = d2 > 0 ? [p2, n2 || multiple] : [n2, p2 || multiple]
        return Math.max(s1, s2) <= Math.min(e1, e2)
    }

    static getSignals(h1, h2) {
        if (h1.seconds === 0 && h2.seconds === 0) return 0
        let thisLCM = lcm(h1.hands, h2.hands), minLen = h1.seconds || h2.seconds, maxLen = h2.seconds

        let doLoops = thisLCM < minLen
        let len = doLoops ? thisLCM : maxLen

        if (!doLoops) {
            let h1Arr = h1.allMoves().take(len), h2Arr = h2.allMoves().take(len)

            return h1Arr.reduce((a, c) => Hand.isMeeting(c, h2Arr.next().value, h1.multiple) ? a + 1 : a, 0)
        }

        let fullLoops = Math.floor(minLen / thisLCM), rem = minLen % thisLCM, h1Arr = h1.allMoves().take(len), h2Arr = h2.allMoves().take(len)

        let result = 0, loopTotal = 0, remTotal = 0

        h1Arr.forEach((h, i) => {
            if (Hand.isMeeting(h, h2Arr.next().value, h1.multiple)) {
                loopTotal++
                if (i < rem) remTotal++
            }
        })

        result += ((fullLoops * loopTotal) + remTotal)

        if (h2.seconds > minLen) {
            let diff = h2.seconds - h1.seconds, dLoops = Math.floor(diff / len), dRem = diff % len
            let dLoopTotal = 0, dRemTotal = 0

            h2.allMoves().drop(rem).take(len).forEach((h, i) => {
                if (Hand.isMeeting([null, -1, h1.endVal, h1.endVal], h, h1.multiple)) {
                    dLoopTotal++
                    if (i < dRem) dRemTotal++
                }
            })
            result += ((dLoops * dLoopTotal) + dRemTotal)
        }

        return result
    }
}

const makeMoves = ([hands, dir, start, seconds], multiple) => {
    let pos = seconds ? Array(hands).fill(0).map((x, i) => x + (i * (multiple / hands))) : null
    let startVal = pos ? pos[start] : (start * (multiple / hands)), lastVal

    if (seconds) {
        if (dir > 0) {
            lastVal = pos[(start + seconds) % hands]
            if (start + 1 < hands) {
                pos = pos.slice(start + 1).concat(pos.slice(0, start + 1))
            }
        } else {
            lastVal = pos[(start - seconds + (Math.ceil(seconds / hands) * hands)) % hands]
            if (start > 0) {
                pos = pos.slice(0, start).reverse().concat(pos.slice(start).reverse())
            } else {
                pos.reverse()
            }
        }
    } else {
        lastVal = startVal
    }

    return [startVal, lastVal, pos]
}

const solve = (input) => {
    let lines = input.split(/[\r\n]{2}/).map((x) => x.split(/[\r\n]+/).map((x, i) => i === 1 ? x.split(' ')[1].split(':').map((y) => y === 'CW' ? 1 : -1) : x.split(' ')[1].match(/\d+/g).map(Number)))

    return lines.flatMap((x) => {
        let m = x[0].reduce((a, c) => lcm(a, c))
        let [h1, h2, h3] = x.reduce((a, c) => {
            c.forEach((v, i) => a[i].push(v))
            return a
        }, [[], [], []]).map((x) => new Hand(x, m, ...makeMoves(x, m))).sort((a, b) => a.seconds - b.seconds)

        return [Hand.getSignals(h1, h2), Hand.getSignals(h1, h3), Hand.getSignals(h2, h3)]
    }).reduce((a, c) => a + c, 0)
}

console.log(solve(input1))
console.log(solve(input2))
console.log(solve(input3))

