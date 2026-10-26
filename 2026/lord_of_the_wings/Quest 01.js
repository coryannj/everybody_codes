const { dir, group } = require('console')
const fs = require('fs')
const input1 = fs.readFileSync('../../inputs/everybody_codes/2026/lord_of_the_wings/quest1_1.txt', {
	encoding: 'utf8',
	flag: 'r'
})
const input2 = fs.readFileSync('../../inputs/everybody_codes/2026/lord_of_the_wings/quest1_2.txt', {
	encoding: 'utf8',
	flag: 'r'
})
const input3 = fs.readFileSync('../../inputs/everybody_codes/2026/lord_of_the_wings/quest1_3.txt', {
	encoding: 'utf8',
	flag: 'r'
})

let lines = input1.split(/[\r\n]+/).map((x) => x.split(''))

let rowLen = lines.length
let colLen = lines[0].length
let [sr, sc] = [0, lines[0].indexOf('S')]
let startPos = `${sr}_${sc}`

let grid = {}

const neighbours = (r, c) => {
	let result = {}

	let next = [
		[r + 1, c],
		[r - 1, c],
		[r, c + 1],
		[r, c - 1]
	]
	next
		.filter(([nr, nc]) => lines?.[nr]?.[nc] && lines[nr][nc] !== '#')
		.forEach(([nr, nc]) => {
			let v = lines[nr][nc]
			let key = [nr, nc].join('_')

			if (v === '+') {
				result[1] = result[1]?.concat(key) || [key]
			} else if (v === '-') {
				result[-2] = result[-2]?.concat(key) || [key]
			} else {
				result[-1] = result[-1]?.concat(key) || [key]
			}
		})

	return result
}

lines.forEach((row, rowInd) => {
	row.forEach((val, colInd) => {
		if (val !== '#') {
			let key = `${rowInd}_${colInd}`
			grid[key] = neighbours(rowInd, colInd)
		}
	})
})

let loopCorners = Object.keys(grid).filter((x) => {
	let [r, c] = x.split('_').map(Number)

	if (lines[r][c] === '+' && grid[x][1]?.length === 2) {
		let n = grid[x][1]
		return (
			n.some((k) => k.startsWith(`${r - 1}_`) || k.startsWith(`${r + 1}_`)) &&
			n.some((k) => k.endsWith(`_${c - 1}`) || k.endsWith(`_${c + 1}`))
		)
	} else {
		return false
	}
})

const bfs = (start, end) => {
	let queue = { ...start }
	let seen = new Set(Object.keys(queue))
	let t = 0
	let result = {}

	while (end.some((ek) => !seen.has(ek))) {
		let newQueue = {}
		Object.entries(queue).forEach(([k, v]) => {
			;[1, -1, -2].forEach((alt) => {
				grid[k][alt].forEach((nk) => {
					if (end.includes(nk)) {
						if (result[nk] === undefined || result[nk] < v + alt) {
							result[nk] = {}
						}
					} else if (newQueue[nk] === undefined || newQueue[nk] < v + alt) {
						newQueue[nk] = v + alt
					}
				})
			})
		})
		t++
	}
}

// let loop = [loopCorner].concat(grid[loopCorner][1])

// let oppCorner = Object.keys(grid).find((x) => {
// 	let adj = grid?.[x]?.[1]
// 	return adj ? grid[loopCorner][1].every((v) => adj.includes(v)) : false
// })

// console.log(loop, oppCorner)

//
// queue {startKey:startAltitude}
