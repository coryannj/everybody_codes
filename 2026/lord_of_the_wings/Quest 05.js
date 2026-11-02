const {dir, group} = require('console')
const fs = require('fs')
const input1 = fs.readFileSync('../../inputs/everybody_codes/2026/lord_of_the_wings/quest5_1.txt', {encoding: 'utf8', flag: 'r'})
const input2 = fs.readFileSync('../../inputs/everybody_codes/2026/lord_of_the_wings/quest5_2.txt', {encoding: 'utf8', flag: 'r'})
const input3 = fs.readFileSync('../../inputs/everybody_codes/2026/lord_of_the_wings/quest5_3.txt', {encoding: 'utf8', flag: 'r'})

const solve = (input, partNo) => {
	let lines = input.split(/[\r\n]+/)

	let rowLen = lines.length,
		colLen = lines[0].length,
		startRow = Math.floor(rowLen / 2),
		startCol = Math.floor(colLen / 2),
		startKey = `${startRow}_${startCol}`,
		neighbours = {}

	let ones = new Set(lines.values().flatMap((row, rowInd) => row[Symbol.iterator]().flatMap((val, colInd) => (val === '1' ? [`${rowInd}_${colInd}`] : []))))

	const getNeighbours = (k) => {
		if (neighbours[k]) return neighbours[k]

		let [r, c] = k.split('_').map(Number)

		let n = new Set(
			[
				[r - 1, c],
				[r - 1, c + 1],
				[r, c + 1],
				[r + 1, c + 1],
				[r + 1, c],
				[r + 1, c - 1],
				[r, c - 1],
				[r - 1, c - 1]
			].flatMap(([nr, nc]) => (0 <= nr && nr < rowLen && 0 <= nc && nc <= colLen ? [`${nr}_${nc}`] : []))
		)
		neighbours[k] = n

		return n
	}

	let land = new Set([startKey])

	const isLand = (k) =>
		getNeighbours(k)
			.values()
			.reduce((a, c) => (ones.has(c) || land.has(c) ? a + 1 : a), 0) >= 5

	const constructMap = (candidates, result, callback) => {
		while (candidates.size) {
			candidates = new Set(
				candidates.values().flatMap((k) => {
					if (callback(k)) {
						result.add(k)
						return getNeighbours(k)
					} else {
						return []
					}
				})
			).difference(result)
		}
	}

	constructMap(getNeighbours(startKey), land, isLand)

	if (partNo === 1) return land.size

	let sand = new Set(land.values().filter((k) => neighbours[k].values().some((v) => !land.has(v) || v.startsWith('0_') || v.startsWith(`${rowLen - 1}_`) || v.endsWith('_0') || v.endsWith(`_${colLen - 1}`))))

	const isSand = (k) => neighbours[k].values().reduce((a, c) => (sand.has(c) ? a + 1 : a), 0) >= 5

	constructMap(land.difference(sand), sand, isSand)

	if (partNo === 2) return sand.size

	const isTree = (k) => {
		let [r, c] = k.split('_').map(Number)

		for (i = -2; i <= 2; i++) {
			for (j = -2; j <= 2; j++) {
				if ((i === 0 && j === 0) || Math.abs(i) + Math.abs(j) === 4) continue
				if (sand.has(`${r + i}_${c + j}`)) return false
			}
		}
		return true
	}

	let trees = new Set(
		land
			.difference(sand)
			.values()
			.filter((k) => isTree(k))
	)

	const stepTree = (k) => !trees.has(k) && neighbours[k].values().reduce((a, c) => (trees.has(c) ? a + 1 : a), 0) >= 4
	const takeStep = (set) =>
		new Set(
			set
				.values()
				.flatMap((k) => neighbours[k])
				.filter((k) => stepTree(k))
		)

	let step1 = takeStep(trees)

	trees = trees.union(step1)

	return trees.size + takeStep(step1).size
}

console.log(solve(input1, 1))
console.log(solve(input2, 2))
console.log(solve(input3, 3))
