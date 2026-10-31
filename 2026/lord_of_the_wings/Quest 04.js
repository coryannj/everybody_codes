const { dir, group } = require('console')
const fs = require('fs')
const input1 = fs.readFileSync('../../inputs/everybody_codes/2026/lord_of_the_wings/quest4_1.txt', {
	encoding: 'utf8',
	flag: 'r'
})
const input2 = fs.readFileSync('../../inputs/everybody_codes/2026/lord_of_the_wings/quest4_2.txt', {
	encoding: 'utf8',
	flag: 'r'
})
const input3 = fs.readFileSync('../../inputs/everybody_codes/2026/lord_of_the_wings/quest4_3.txt', {
	encoding: 'utf8',
	flag: 'r'
})

const checksum = (arr) => {
	let curr = 1,
		next = 1,
		total = 0,
		len = arr.length

	arr.forEach((x, i, a) => {
		total += curr * x
		next++
		if (i < len - 1 && a[i + 1] !== x) {
			curr = next
		}
	})

	return total
}

const solve = (input, partNo) => {
	let lines = input.split(/[\r\n]+/).map((x) => x.match(/\d+/g).map(Number))
	let maxId = Math.max(...lines.map((x) => x[0]))
	let maxQuests = Math.max(...lines.map((x) => x[1]))

	if (partNo < 3) {
		let participants = lines
			.reduce(
				(a, [id, q, p, t]) => {
					a[id - 1][0]++
					a[id - 1][1] += t
					return a
				},
				Array(maxId)
					.fill(0)
					.map((x) => [0, 0])
			)
			.sort(([p1, t1], [p2, t2]) => {
				if (partNo === 1 || p1 === p2) {
					return t1 - t2
				} else {
					return p2 - p1
				}
			})
			.map((x) => x[1])
		return checksum(participants)
	}

	lines.sort(([id1, q1, p1, t1], [id2, q2, p2, t2]) => p1 - p2)

	let participants = lines.reduce(
		(a, [id, q, p, t]) => {
			p === 1 ? a[id - 1][1][q - 1].push(t) : a[id - 1][1][q - 1].push(a[id - 1][1][q - 1].at(-1) + t)
			return a
		},
		Array(maxId)
			.fill()
			.map((x, i) => [
				i,
				Array(maxQuests)
					.fill()
					.map((y) => [])
			])
	)

	let points = Array(maxId)
		.fill(0)
		.map((x) => x)

	for (i = 0; i < maxQuests; i++) {
		let top = 50
		for (j = 0; j < 3; j++) {
			let scores = participants
				.flatMap(([id, times]) => (times[i].length >= j + 1 ? [[id, times[i][j]]] : []))
				.sort(([id1, t1], [id2, t2]) => t1 - t2)

			let curr = top,
				next = top,
				len = scores.length

			for (const [ind, [id, time]] of scores.entries()) {
				points[id] += curr
				next--

				if (ind < len - 1 && scores[ind + 1][1] !== time) {
					curr = next
				}

				if (curr < 1) break
			}

			top += 50
		}
	}

	return checksum(points.sort((a, b) => b - a))
}

console.log(solve(input1, 1))
console.log(solve(input2, 2))
console.log(solve(input3, 3))
