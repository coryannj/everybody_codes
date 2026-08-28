const fs = require('fs')
const input1 = fs.readFileSync('../../inputs/everybody_codes/2026/the_digital_atelier/quest3_1.txt', {
	encoding: 'utf8',
	flag: 'r'
})
const input2 = fs.readFileSync('../../inputs/everybody_codes/2026/the_digital_atelier/quest3_2.txt', {
	encoding: 'utf8',
	flag: 'r'
})
const input3 = fs.readFileSync('../../inputs/everybody_codes/2026/the_digital_atelier/quest3_3.txt', {
	encoding: 'utf8',
	flag: 'r'
})

const solve = (input, partNo) => {
	let [width, height, hOffset, vOffset] = input
		.split(/[\r\n]/)
		.map((x) => x.split('=')[1])
		.map((x, xi) => (xi < 2 ? +x : x.split('').map(Number)))

	// Double the offsets to avoid alternating tiles
	hOffset = hOffset.concat(hOffset)
	vOffset = vOffset.concat(vOffset)
	let [hLen, vLen] = [hOffset.length, vOffset.length]

	// Make pairs so we get 4 sides of each cell
	let hPairs = hOffset.map((x, xi) => [x, hOffset[(xi + 1) % hLen]])
	let vPairs = vOffset.map((x, xi) => [x, vOffset[(xi + 1) % vLen]])

	// Populate our tile
	let baseTile = hPairs.map((x, xi) =>
		vPairs.map((y, yi) => {
			return { rowInd: xi, colInd: yi, hLines: x.map((v) => +(yi % 2 === v)), vLines: y.map((w) => +(xi % 2 === w)) }
		})
	)

	// Populate the colours (doing this in prev loop is slower somehow?!?)
	baseTile.forEach((row, rowInd) => {
		row.forEach((col, colInd) => {
			if (rowInd === 0 && colInd === 0) {
				baseTile[rowInd][colInd].colour = 0
			} else {
				if (colInd > 0) {
					baseTile[rowInd][colInd].colour =
						col.vLines[0] === 1 ? 1 - baseTile[rowInd][colInd - 1].colour : baseTile[rowInd][colInd - 1].colour
				} else {
					baseTile[rowInd][colInd].colour =
						col.hLines[0] === 1 ? 1 - baseTile[rowInd - 1][colInd].colour : baseTile[rowInd - 1][colInd].colour
				}
			}
		})
	})

	const isolated = baseTile.flat().filter((x) => x.hLines.concat(x.vLines).every((y) => y === 1))

	const getCounts = (squares, maxRow = Infinity, maxCol = Infinity) => {
		let counts = squares
			.filter((x) => x.rowInd < maxRow && x.colInd < maxCol)
			.reduce((counts, obj) => counts.with(obj.colour, counts[obj.colour] + 1), [0, 0])
		return counts
	}

	const baseTileCount = getCounts(isolated)

	// Work out tiles/counts in a single row
	let [tileCols, colRem] = [Math.floor(width / vLen), width % vLen]

	let remCols = colRem > 0 ? getCounts(isolated, Infinity, colRem) : [0, 0]
	let baseRowCount = baseTileCount.map((x, xi) => x * tileCols + remCols[xi])

	// Partial rows at bottom of grid
	let [tileRows, rowRem] = [Math.floor(height / hLen), height % hLen]
	let partialRow = rowRem > 0 ? getCounts(isolated, rowRem, Infinity) : [0, 0]
	let partialCols = rowRem > 0 && colRem > 0 ? getCounts(isolated, rowRem, colRem) : [0, 0]
	let partialTotal = partialRow.map((x, xi) => x * tileCols + partialCols[xi])

	// Tally up everything
	let totalCount = baseRowCount.map((x, xi) => x * tileRows + partialTotal[xi])

	return partNo === 1 ? totalCount[0] + totalCount[1] : Math.max(...totalCount)
}

console.log(solve(input1, 1))
console.log(solve(input2, 2))
console.log(solve(input3, 3))
