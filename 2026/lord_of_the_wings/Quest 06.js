const fs = require('fs')
const year = '2026'
const eventName = 'lord_of_the_wings'
const quest = 6
const filePath = `../../inputs/everybody_codes/${year}/${eventName}/quest${quest}_`

const [input1, input2, input3] = [1, 2, 3].map((partNo) => fs.readFileSync(`${filePath}${partNo}.txt`, {encoding: 'utf8', flag: 'a+'}))

const solve = (input, partNo) => {
	let lines = input.split(/[\r\n]+/).map((x) => x.split(/[:,]/g)),
		ingredients =
			partNo === 1
				? Object.fromEntries(lines.map((x) => [x[0], new Set(x.slice(1))]))
				: lines.reduce((a, [item, ...ings]) => {
						ings.forEach((ing) => {
							a[ing] ? a[ing].add(item) : (a[ing] = new Set([item]))
						})
						return a
					}, {})

	const made = (i) => {
		let result = ingredients[i]

		for (const v of result.values()) {
			ingredients[v]?.values()?.forEach((nv) => result.add(nv))
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
