const fs = require('fs')
const year = '2026'
const eventName = 'lord_of_the_wings'
const quest = 6
const filePath = `../../inputs/everybody_codes/${year}/${eventName}/quest${quest}_`

const [input1, input2, input3] = [1, 2, 3].map((partNo) => fs.readFileSync(`${filePath}${partNo}.txt`, {encoding: 'utf8', flag: 'a+'}))

const solve = (input, partNo) => {
	lines = input.split(/[\r\n]+/).map((x) => x.split(/[:,]/g))

	ingredients = Object.fromEntries(new Set(lines.flat()).values().map((v) => (v = [v, {uses: new Set(), usedBy: new Set()}])))

	lines.forEach(([item, ...ings]) => {
		ings.forEach((ing) => {
			ingredients[item]['uses'].add(ing)

			if (partNo > 1) {
				ingredients[ing]['usedBy'].add(item)
			}
		})
	})

	const made = (ing, direction) => {
		let queue = ingredients[ing][direction]
		let result = new Set()

		while (queue.size) {
			queue = new Set(
				queue.values().flatMap((v) => {
					if (!v.startsWith('NULL')) {
						result.add(v)
					}
					return ingredients[v][direction]
				})
			).difference(result)
		}

		return result
	}

	if (partNo === 1) return made('NULL', 'uses').size
	if (partNo === 2) return made('NULL', 'usedBy').size

	return Object.keys(ingredients)
		.flatMap((k) => (k.startsWith('NULL') ? [made(k, 'usedBy')] : []))
		.flatMap((v, i, a) => a.slice(i + 1).map((z) => v.intersection(z)))
		.reduce((a, c) => a.union(c)).size
}

console.log(solve(input1, 1))
console.log(solve(input2, 2))
console.log(solve(input3, 3))
