const { dir, group } = require('console')
const fs = require('fs')
const input1 = fs.readFileSync('../inputs/everybody_codes/2024/quest20_1.txt', { encoding: 'utf8', flag: 'r' })
const input2 = fs.readFileSync('../inputs/everybody_codes/2024/quest20_2.txt', { encoding: 'utf8', flag: 'r' })
const input3 = fs.readFileSync('../inputs/everybody_codes/2024/quest20_3.txt', { encoding: 'utf8', flag: 'r' })



const makeGrid = (input) => {
	let lines = input.split(/[\r\n]+/).map((x) => x.split('')), colLen = lines[0].length, padding = '#'.repeat(colLen).split('')

	lines.unshift(padding)
	lines.push(padding)

	let [sr, sc] = [1, lines[1].indexOf('S')]
	let startKey = `${sr}_${sc}`
	let grid = {}

	const neighbours = (r, c) => {
		let next = [
			[r + 1, c, 'D'],
			[r - 1, c, 'U'],
			[r, c + 1, 'R'],
			[r, c - 1, 'L']
		]

		return next.flatMap(([nr, nc, d]) => lines?.[nr]?.[nc] && lines[nr][nc] !== '#' ? [[`${nr}_${nc}_${d}`, d, lines[nr][nc]]] : [])
	}

	lines.forEach((row, rowInd) => {
		row.forEach((val, colInd) => {
			if (val !== '#') {
				let prefix = `${rowInd}_${colInd}`, n = neighbours(rowInd, colInd), opp = [['U', 'D'], ['D', 'U'], ['L', 'R'], ['R', 'L']]

				opp.forEach(([k, oppK]) => {
					let obj = { value: val, prev: '' }
					let result = new Map()

					n.forEach(([nk, nd, nv]) => {
						if (nd === oppK) {
							obj['prev'] = nk
						} else {
							if (nv === '+') {
								result.set(1, result?.get(1)?.concat(nk) || [nk])
							} else if (nv === '-') {
								result.set(-2, result?.get(-2)?.concat(nk) || [nk])
							} else {
								result.set(-1, result?.get(-1)?.concat(nk) || [nk])
							}
						}
					})
					obj['neighbours'] = result
					grid[`${prefix}_${k}`] = obj
				})
			}
		})
	})

	return [startKey, grid]
}

const solve = (input, partNo) => {
	let [startKey, grid] = makeGrid(input)

	let state = partNo === 1 ? '' : '|_'

	let startAltitude = partNo === 1 ? 1000 : 10000

	let seen = Object.fromEntries(grid[`${startKey}_D`]['neighbours'].entries().flatMap(([alt, keys]) => keys.flatMap((k) => [[k + state, startAltitude + alt]])))

	let queue = new Map(Object.entries(seen))

	if (partNo === 1) {
		for (i = 1; i < 100; i++) {
			queue = queue.entries().reduce((newQueue, [k1, a1]) => {
				grid[k1]['neighbours'].entries().forEach(([a2, keys]) => {
					keys.forEach((k2) => {
						if (!seen[k2] || seen[k2] < a1 + a2) {
							seen[k2] = a1 + a2
							newQueue.set(k2, a1 + a2)
						}
					})
				})

				return newQueue
			}, new Map())
		}

		return Math.max(...Object.values(seen))
	}

	let checkpoints = { A: '_', B: '_A', C: '_AB', S: '_ABC' }
	let time = 1

	while (true) {
		time++
		let newQueue = new Map()

		for (const [s, a1] of queue.entries()) {
			let [k1, state] = s.split('|')

			for (const [a2, keys] of grid[k1]['neighbours'].entries()) {
				for (const k2 of keys) {
					let val = grid[k2]['value']
					if (checkpoints[val]) {
						let prevState = checkpoints[val]
						if (state === prevState) {
							let newState = `${prevState}${val}`
							let newKey = `${k2}|${newState}`
							if (!seen[newKey] || seen[newKey] < a1 + a2) {
								if (val === 'S' && a1 + a2 >= 10000) return time

								seen[newKey] = a1 + a2
								newQueue.set(newKey, a1 + a2)
							}
						}
					} else {
						let newKey = `${k2}|${state}`
						if (!seen[newKey] || seen[newKey] < a1 + a2) {
							seen[newKey] = a1 + a2
							newQueue.set(newKey, a1 + a2)
						}
					}
				}
			}
		}

		queue = newQueue
	}
}
console.log(solve(input1, 1))
console.log(solve(input2, 2))

let p3 = 384400
let tile1Offset = 9
let tile = 6
let tileLen = 12

let tiles = Math.floor((p3 - tile1Offset) / tile)
let totalAltitude = tiles * tile + tile1Offset + 1
let distance = (tiles + 1) * tileLen + (p3 - totalAltitude)
console.log(distance)