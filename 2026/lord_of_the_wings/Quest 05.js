const { dir, group } = require('console')
const fs = require('fs')
const input1 = fs.readFileSync('../../inputs/everybody_codes/2026/lord_of_the_wings/quest5_1.txt', {
	encoding: 'utf8',
	flag: 'r'
})
const input2 = fs.readFileSync('../../inputs/everybody_codes/2026/lord_of_the_wings/quest5_2.txt', {
	encoding: 'utf8',
	flag: 'r'
})
const input3 = fs.readFileSync('../../inputs/everybody_codes/2026/lord_of_the_wings/quest5_3.txt', {
	encoding: 'utf8',
	flag: 'r'
})

const makeGrid = (input) => {
	let lines = input.split(/[\r\n]+/).map((x) => x.split('')),
		rowLen = lines.length,
		colLen = lines[0].length,
		startRow = Math.floor(rowLen / 2),
		startCol = Math.floor(colLen / 2)

	const neighbours = (r, c) =>
		[
			[r - 1, c],
			[r - 1, c + 1],
			[r, c + 1],
			[r + 1, c + 1],
			[r + 1, c],
			[r + 1, c - 1],
			[r, c - 1],
			[r - 1, c - 1]
		]
			.filter(([nr, nc]) => lines?.[nr]?.[nc])
			.map((x) => x.join('_'))

	lines[startRow][startCol] = '#'

	let grid = {}

	lines.forEach((row, rowInd) => {
		row.forEach((val, colInd) => {
			let key = `${rowInd}_${colInd}`
			grid[key] = { value: val, neighbours: neighbours(rowInd, colInd) }
		})
	})

	return [`${startRow}_${startCol}`, rowLen, colLen, grid]
}

const solve = (input, partNo) => {
	let [startKey, rowLen, colLen, grid] = makeGrid(input)

	const isLand = (k) => {
		if (grid[k]['value'] === '#') return false

		let neighbours = grid[k]['neighbours'].map((v) => grid[v]['value'])

		return neighbours.includes('#') && neighbours.filter((v) => v !== '0').length >= 5
	}

	const isSand = (k) => {
		if (grid[k]['value'] !== '#') return false
		if (k.startsWith('0_') || k.startsWith(`${rowLen - 1}_`) || k.endsWith('_0') || k.endsWith(`_${colLen - 1}`))
			return true

		let neighbours = grid[k]['neighbours'].map((v) => grid[v]['value'])

		return neighbours.some((v) => '01'.includes(v)) || neighbours.filter((v) => v === '=').length >= 5
	}

	const isTree = (k) => {
		if (grid[k]['value'] !== '#') return false

		let [r, c] = k.split('_').map(Number)

		if (r < 2 || r + 2 >= rowLen || c < 2 || c + 2 >= colLen) return false

		for (i = -2; i <= 2; i++) {
			for (j = -2; j <= 2; j++) {
				if ((i === 0 && j === 0) || Math.abs(i) + Math.abs(j) === 4) continue
				let val = grid[`${r + i}_${c + j}`]['value']
				if (val !== '#' && val !== '@') return false
			}
		}
		return true
	}

	const stepTree = (k) => {
		if (grid[k]['value'] !== '#') return false
		let neighbours = grid[k]['neighbours'].map((v) => grid[v]['value'])
		return !neighbours.includes('=') && neighbours.filter((v) => v === '@').length >= 4
	}

	const mapGrid = (candidates, newVal, loops, callback) => {
		let queue = candidates.filter(callback)
		let seen = [...queue]

		while (loops) {
			loops--
			queue.forEach((k) => (grid[k]['value'] = newVal))
			queue = candidates.filter(callback)
			if (!queue.length) break
			if (loops) seen = seen.concat(queue)
		}

		return seen
	}

	let land = mapGrid(Object.keys(grid), '#', Infinity, isLand).concat(startKey)

	if (partNo === 1) return land.length

	let sand = mapGrid(land, '=', Infinity, isSand)

	if (partNo === 2) return sand.length

	land = land.filter((v) => !sand.includes(v))

	let trees = mapGrid(land, '@', Infinity, isTree)

	let steps = mapGrid(
		land.filter((k) => !trees.includes(k)),
		'@',
		2,
		stepTree
	)

	return trees.length + steps.length
}

console.log(solve(input1, 1))
console.log(solve(input2, 2))
console.log(solve(input3, 3))
