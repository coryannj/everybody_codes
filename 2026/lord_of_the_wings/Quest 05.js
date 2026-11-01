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
			grid[key] = { value: val, neighbours: new Set(neighbours(rowInd, colInd)) }
		})
	})

	return [`${startRow}_${startCol}`, rowLen, colLen, grid]
}

const solve = (input, partNo) => {
	let [startKey, rowLen, colLen, grid] = makeGrid(input)

	const isLand = (k) => {
		return (
			grid[k]['value'] !== '#' &&
			grid[k]['neighbours']
				.values()
				.filter((v) => grid[v]['value'] !== '0')
				.toArray().length >= 5
		)
	}

	const isSand = (k) => {
		if (grid[k]['value'] !== '#') return false
		if (k.startsWith('0_') || k.startsWith(`${rowLen - 1}_`) || k.endsWith('_0') || k.endsWith(`_${colLen - 1}`))
			return true

		let neighbours = grid[k]['neighbours'].values().reduce((a, c) => {
			let val = grid[c]['value']
			a[val] = (a[val] || 0) + 1
			return a
		}, {})

		return neighbours['0'] || neighbours['1'] || neighbours['='] >= 5
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

	const stepTree = (k, acc) => {
		if (grid[k]['value'] !== '#') return false

		let neighbours = grid[k]['neighbours'].values().reduce((a, c) => {
			if (acc && acc.has(c)) {
				a['@'] = (a['@'] || 0) + 1
			} else {
				let val = grid[c]['value']
				a[val] = (a[val] || 0) + 1
			}

			return a
		}, {})

		return neighbours['='] === undefined && neighbours[`@`] >= 4
	}

	const mapGrid = (candidates, newVal, callback) => {
		let result = new Set()

		while (true) {
			candidates = new Set(
				candidates.values().flatMap((k) => {
					if (callback(k)) {
						grid[k]['value'] = newVal
						result.add(k)
						return grid[k]['neighbours']
					} else {
						return []
					}
				})
			)

			if (!candidates.size) break
		}

		return result
	}

	let land = mapGrid(grid[startKey]['neighbours'], '#', isLand)
	land.add(startKey)

	if (partNo === 1) return land.size

	let sand = mapGrid(land, '=', isSand)

	if (partNo === 2) return sand.size

	land = land.difference(sand)

	let trees = mapGrid(land, '@', isTree)

	land = land.difference(trees)

	let step1 = new Set(land.values().filter((k) => stepTree(k)))

	let step2 = new Set(step1.values().flatMap((k) => grid[k]['neighbours'].values().filter((nk) => stepTree(nk, step1))))

	return trees.size + step1.size + step2.size
}

console.log(solve(input1, 1))
console.log(solve(input2, 2))
console.log(solve(input3, 3))
