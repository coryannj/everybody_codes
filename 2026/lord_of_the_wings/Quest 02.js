const { dir, group } = require('console')
const fs = require('fs')
const input1 = fs.readFileSync('../../inputs/everybody_codes/2026/lord_of_the_wings/quest2_1.txt', {
	encoding: 'utf8',
	flag: 'r'
})
const input2 = fs.readFileSync('../../inputs/everybody_codes/2026/lord_of_the_wings/quest2_2.txt', {
	encoding: 'utf8',
	flag: 'r'
})
const input3 = fs.readFileSync('../../inputs/everybody_codes/2026/lord_of_the_wings/quest2_3.txt', {
	encoding: 'utf8',
	flag: 'r'
})

const solve = (input) => {
	let lines = input.split(/[\r\n]+/).map((x) => x.split(' ').map((y) => y.match(/\d+|[<>]/g)))
	let total = 0
	lines.forEach((line) => {
		let elements = new Set(line.flatMap(([a, b, c]) => [a, c]))
		let order = Object.fromEntries([...elements].map((x, i, a) => [x, {}]))
		let len = elements.size

		line.forEach(([a, b, c]) => {
			let opp = b === '<' ? '>' : '<'
			order[a][c] = b
			order[c][a] = opp
		})

		let missing = Object.keys(order)
			.filter((k) => Object.keys(order[k]).length + 1 < len)
			.sort((k1, k2) => Object.keys(order[k2]).length - Object.keys(order[k1]).length)

		missing.forEach((k) => {
			let v = order[k]
			let missingKeys = [...elements].filter((x) => x !== k && v[x] === undefined)

			missingKeys.forEach((mk) => {
				let [nk, op] = Object.entries(v).find(([nk2, op2]) =>
					Object.entries(order[nk2]).some(([nk3, op3]) => mk === nk3 && op2 === op3)
				)

				let opp = op === '<' ? '>' : '<'
				order[k][mk] = op
				order[mk][k] = opp
			})
		})

		let sort = [...elements].sort((a, b) => {
			if (order[a][b] === '<') {
				return 1
			} else {
				return -1
			}
		})

		total += Number(sort.join(''))
	})

	return total
}

console.log(solve(input1))
console.log(solve(input2))
console.log(solve(input3))
