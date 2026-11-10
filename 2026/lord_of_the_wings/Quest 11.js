const { off } = require('cluster')
const fs = require('fs')
const [eventName, year, quest] = ['lord_of_the_wings', 2026, 11]
const filePath = `../../inputs/everybody_codes/${year}/${eventName}/quest${quest}`
const [input1, input2, input3] = [1, 2, 3].map((partNo) => fs.readFileSync(`${filePath}_${partNo}.txt`, { encoding: 'utf8', flag: 'a+' }))

const solve = (input, partNo) => {
    let [portals, ...shortcuts] = input.split(/[\r\n]+/).map((x) => x.match(/\d+/g).map(Number)).map((x) => x.length === 1 ? x[0] : x)

    let nodes = {}, neighbours = partNo === 1 ? 1 : 3

    for (i = 1; i <= portals; i++) {
        nodes[i] = new Set()
        for (j = 1; j <= neighbours; j++) {
            nodes[i].add((i + j) % portals || portals)
            nodes[i].add((i + portals - j) % portals || portals)
        }
    }

    let baseCache = Object.fromEntries(Object.entries(nodes).map(([k, v]) => [k, Object.fromEntries(v.values().map((val) => [val, 1]).toArray())]))

    const strain = (p, n, c, initial = false, returnCache = false) => {
        let limit = initial ? 1 : p, sum = 0, cache = structuredClone(c), max = -Infinity

        const bfs = (start, target) => {
            if (n[start].has(target)) return 1
            let queue = n[start], seen = new Set([start]), steps = 1
            while (!queue.has(target)) {
                seen = seen.union(queue)
                steps++
                queue = new Set(queue.values().flatMap((v) => n[v] || [])).difference(seen)
            }
            return steps
        }

        for (i = 1; i <= limit; i++) {
            let subTotal = 0
            if (!cache[i]) cache[i] = {}

            for (j = 1; j <= portals; j++) {
                if (i === j) continue;

                if (cache[i]?.[j]) {
                    subTotal += cache[i][j]
                    continue;
                }

                if (!cache[j]) cache[j] = {}

                let val = bfs(i, j)
                subTotal += val

                cache[i][j] = val
                cache[j][i] = val
                if (val > max) max = val
            }

            sum += subTotal
        }

        if (initial) sum *= p
        return returnCache ? [sum, max, cache] : sum
    }

    let s1 = strain(portals, nodes, baseCache, true)

    shortcuts.forEach(([n1, n2]) => {
        nodes[n1].add(n2)
        nodes[n2].add(n1)
        baseCache[n1][n2] = 1
        baseCache[n2][n1] = 1
    })

    if (partNo === 1) return s1 - strain(portals, nodes, baseCache, false)

    let [_, max, cache] = strain(portals, nodes, baseCache, false, true)
    let offset = 1 // increase to 3 for examples

    // Part 2
    if (partNo === 2) {
        let p2Min = Infinity
        let pre = Object.entries(cache).flatMap(([k1, o]) => Object.entries(o).flatMap(([k2, v]) => !nodes[k1].has(+k2) && v >= max - offset ? [[+k1, +k2]] : [])).filter(([a1, b1], i, arr) => i === arr.findIndex(([a2, b2]) => a1 === a2 && b1 === b2 || b1 === a2 && a1 === b2))

        pre.forEach(([n1, n2]) => {
            nodes[n1].add(n2)
            let v = strain(portals, nodes, baseCache, false)
            if (v < p2Min) p2Min = v
            nodes[n1].delete(n2)
        })

        return s1 - p2Min
    }

    // Part 3
    let spacing = portals / 8, elements = 8, p3Max = 0, p3min = Infinity
    let connections = Array(spacing).fill().map((_, i) => Array(elements).fill(i + 1).map((y, yi) => y + (yi * spacing)))

    const getDist = (set) => { let [n1, n2] = [...set]; return cache[n1][n2] }
    const makePairs = (arr) => arr.flatMap((x, i, a) => a.slice(i + 1).flatMap((y) => [new Set([x, y])]))
    const setNodes = (s) => { let [n1, n2] = [...s]; nodes[n1].add(n2); nodes[n2].add(n1) }
    const deleteNodes = (s) => { let [n1, n2] = [...s]; nodes[n1].delete(n2); nodes[n2].delete(n1) }

    const makeConnections = (arr) => {
        let startingElement = arr[0], arrCopy = [...arr], first = p3Max === 0, pairs = makePairs(arr)

        const pairFilter = (pair, nextVal, prevDist = 0, prev = []) => {
            let pLen = prev.length
            if (!pair.has(nextVal) || (pLen && prev.some((item) => !item.isDisjointFrom(pair)))) return []
            let nextDist = getDist(pair)
            return !pLen || prevDist + nextDist + ((4 - (pLen + 1)) * max) >= p3Max - offset ? [[prevDist + nextDist, prev.concat(pair)]] : []
        }

        let queue = pairs.flatMap((x) => pairFilter(x, startingElement))

        for (i = 0; i < 3; i++) {
            queue = queue.flatMap(([dist, q]) => {
                let nextElement = arrCopy.find((v) => q.every((item) => !item.has(v)))
                return pairs.flatMap((p) => pairFilter(p, nextElement, dist, q))
            })

            if (!queue.length) return []
        }

        queue.sort((a, b) => b[0] - a[0])
        if (queue[0][0] > p3Max) p3Max = queue[0][0]
        if (first) queue = queue.filter(([d, q]) => d >= p3Max - offset)

        return queue
    }

    connections.forEach((c) => makeConnections(c).forEach(([dist, pairs]) => {
        pairs.forEach((p) => setNodes(p))
        let val = strain(portals, nodes, baseCache, false)
        if (val < p3min) p3min = val
        pairs.forEach((p) => deleteNodes(p))
    }))

    return s1 - p3min
}
console.log(solve(input1, 1))
console.log(solve(input2, 2))
console.log(solve(input3, 3))