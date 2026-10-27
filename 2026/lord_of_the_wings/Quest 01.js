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
	let nums = input.split(',').map(Number)

	if (partNo === 1) return nums.map((x) => Math.ceil(Math.sqrt(x)) ** 2 - x).reduce((a, c) => a + c, 0)

	if (partNo === 2) return nums.map((x) => (x <= 8 ? 8 - x : Math.ceil(x / 4) * 4 - x)).reduce((a, c) => a + c, 0)

	return nums
		.map((x) => {
			let square = Math.ceil(Math.sqrt(x))
			if (square % 2 === 0) square++
			let f = square ** 2 - 1

			return f >= x ? f - x : (square + 2) ** 2 - 1 - x
		})
		.reduce((a, c) => a + c, 0)
}

console.log(solve(input1, 1))
console.log(solve(input2, 2))
console.log(solve(input3, 3))
