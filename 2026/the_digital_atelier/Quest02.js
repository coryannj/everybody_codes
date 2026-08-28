const fs = require('fs')
const input1 = fs.readFileSync('../../inputs/everybody_codes/2026/the_digital_atelier/quest2_1.txt', {
	encoding: 'utf8',
	flag: 'r'
})
const input2 = fs.readFileSync('../../inputs/everybody_codes/2026/the_digital_atelier/quest2_2.txt', {
	encoding: 'utf8',
	flag: 'r'
})
const input3 = fs.readFileSync('../../inputs/everybody_codes/2026/the_digital_atelier/quest2_3.txt', {
	encoding: 'utf8',
	flag: 'r'
})

const nextMove = ([x1, y1], [x2, y2]) => [Math.floor((x1 + x2) / 2), Math.floor((y1 + y2) / 2)]

const solve = (input, partNo) => {
	let lines = input.split(/[\r\n]/)
	let moves

	if (partNo < 3) moves = lines.pop().split('=')[1].split('')

	let [start, ...beacons] = lines.map((x) => x.split('=').map((y, yi) => (yi === 0 ? y : y.match(/\d+/g).map(Number))))

	beacons = partNo < 3 ? Object.fromEntries(beacons) : beacons.map((x) => x[1])
	currPos = start[1]
	let skySquares = new Map([[currPos.join(','), currPos]])

	if (partNo < 3) {
		skySquares = moves.reduce((seen, b) => {
			currPos = nextMove(currPos, beacons[b])
			seen.set(currPos.join(','), currPos)
			return seen
		}, skySquares)
	} else {
		for (const val of skySquares.values()) {
			beacons.forEach((b) => {
				let next = nextMove(val, b)
				if (!skySquares.has(next.join(','))) skySquares.set(next.join(','), next)
			})
		}
	}

	const neighbours = ([x, y]) =>
		[
			[x - 1, y],
			[x + 1, y],
			[x, y + 1],
			[x, y - 1]
		]
			.map((x) => x.join(','))
			.filter((x) => !skySquares.has(x))

	return partNo === 1 ? skySquares.size : new Set(skySquares.values().flatMap((x) => neighbours(x))).size
}
let t1 = performance.now()
solve(input1, 1)
let t2 = performance.now()
solve(input2, 2)
let t3 = performance.now()
solve(input3, 3)
let t4 = performance.now()

console.log(t2 - t1, t3 - t2, t4 - t3)

console.log(solve(input1, 1))
console.log(solve(input2, 2))
console.log(solve(input3, 3))
