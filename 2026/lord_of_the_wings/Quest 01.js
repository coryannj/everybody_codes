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

const solve = (input, partNo) => {
	return input
		.split(',')
		.map(Number)
		.map((x) => {
			if (partNo === 1) {
				return Math.ceil(Math.sqrt(x)) ** 2 - x
			} else if (partNo === 2) {
				let upper = Math.ceil((x + 2) / 4)
				if (upper < 3) upper = 3
				let border = upper * 2 + (upper - 2) * 2

				if (border < x) {
					upper++
					border = upper * 2 + (upper - 2) * 2
				}
				return border - x
			} else if (partNo === 3) {
				let square = Math.ceil(Math.sqrt(x))

				if (square % 2 === 0) square++
				let f = square ** 2 - 1
				if (f < x) {
					square % 2 ? (square += 2) : square++
					f = square ** 2 - 1
				}

				return f - x
			}
		})
		.reduce((a, c) => a + c, 0)
}

console.log(solve(input1, 1))
console.log(solve(input2, 2))
console.log(solve(input3, 3))
