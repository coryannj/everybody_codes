const { dir, group } = require('console')
const fs = require('fs')
const input1 = fs.readFileSync('../../inputs/everybody_codes/2026/lord_of_the_wings/quest3_1.txt', {
	encoding: 'utf8',
	flag: 'r'
})
const input2 = fs.readFileSync('../../inputs/everybody_codes/2026/lord_of_the_wings/quest3_2.txt', {
	encoding: 'utf8',
	flag: 'r'
})
const input3 = fs.readFileSync('../../inputs/everybody_codes/2026/lord_of_the_wings/quest3_3.txt', {
	encoding: 'utf8',
	flag: 'r'
})

const iso = (a, b) => {
	let bLen = b.length

	while (a.length < bLen) {
		a = a.concat(a)
	}

	a = a.slice(-bLen)

	return b.reduce((p, n, ind) => p + n * a[ind] ** (bLen - 1 - ind), 0)
}

const solve = (input, partNo) => {
	lines = input.split(/[\r\n]+/).map((x) =>
		x
			.slice(4)
			.match(/\d+/g)
			.map((y) => y.split('').map(Number))
	)

	if (partNo < 3) return lines.reduce((a, c) => a + iso(...c), 0)

	return lines.reduce((p, [a, b]) => {
		let subtotal = iso(a, b)
		let num = Number(b.join(''))
		let valid = true

		for (i = num - 1; i > 0; i--) {
			let ss = iso(a, i.toString().split('').map(Number))
			if (ss === subtotal) {
				valid = false
				break
			}
		}

		return valid ? p + subtotal : p
	}, 0)
}

console.log(solve(input1, 1))
console.log(solve(input2, 2))
console.log(solve(input3, 3))
