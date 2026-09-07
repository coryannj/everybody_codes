const { dir, group } = require('console')
const fs = require('fs')
const input1 = fs.readFileSync('../inputs/everybody_codes/2024/quest15_1.txt', { encoding: 'utf8', flag: 'r' })
const input2 = fs.readFileSync('../inputs/everybody_codes/2024/quest15_2.txt', { encoding: 'utf8', flag: 'r' })
const input3 = fs.readFileSync('../inputs/everybody_codes/2024/quest15_3.txt', { encoding: 'utf8', flag: 'r' })

const makeGrid = (input, partNo) => {
	if (partNo === 3) input = input.replaceAll(/[EKR]/g, '.') // Slight cheating - removes herbs on single path between cols and makes the only segments with multiple herbs the 'last' segment of each column

	let lines = input.split(/[\r\n]+/).map((x) => x.split(''))

	// Get start/end row indexes for the segment 'rows' - need to do this before blocking deadends
	let segments = lines
		.flatMap((x, xi) => (x.join('').includes('##########') ? [xi] : []))
		.map((x, xi, a) => [x, a?.[xi + 1]])
		.slice(0, -1)

	const neighbours = (r, c, joinKeys = false) => {
		let n = [
			[r + 1, c],
			[r - 1, c],
			[r, c + 1],
			[r, c - 1]
		].filter(([nr, nc]) => lines?.[nr]?.[nc] && lines[nr][nc] !== '#' && lines[nr][nc] !== '~')
		return joinKeys ? n.map((x) => x.join('_')) : n
	}

	const fixDeadends = (r, c) => {
		if (r > 0 && lines[r][c] === '.') {
			let n = neighbours(r, c)
			if (n.length <= 1) {
				lines[r][c] = '#'

				n.forEach(([nr, nc]) => {
					fixDeadends(nr, nc)
				})
			}
		}
	}

	lines.forEach((r, ri) => r.forEach((c, ci) => fixDeadends(ri, ci)))

	let segmentCols =
		partNo < 3
			? [[0, lines[0].length - 1]]
			: lines[0]
					.flatMap((x, xi) => (lines.map((y) => y[xi]).filter((y) => y === '.').length <= 1 ? [xi] : []))
					.map((x, xi, a) => [x, a?.[xi + 1]])
					.slice(0, -1)

	let herbs = {}
	let grid = lines.flatMap((row, rowInd) => {
		return row.flatMap((val, colInd) => {
			if (val === '#' || val === '~') return []

			let gridObj = {
				key: `${rowInd}_${colInd}`,
				row: rowInd,
				col: colInd,
				value: val,
				segmentRow: segments.flatMap(([s, e], xi) => (s <= rowInd && rowInd <= e ? [xi] : [])),
				segmentCol: segmentCols.flatMap(([s, e], xi) => (s <= colInd && colInd <= e ? [xi] : [])),
				neighbours: new Set(neighbours(rowInd, colInd, true))
			}

			if (val !== '.') {
				if (!herbs[val]) {
					herbs[val] = {
						value: val,
						segmentCol: gridObj.segmentCol[0],
						segmentRow: gridObj.segmentRow[0],
						keys: [gridObj.key]
					}
				} else {
					herbs[val]['keys'].push(gridObj.key)
				}
			}

			return [gridObj]
		})
	})

	return [
		grid,
		Object.values(herbs),
		segmentCols,
		segments.map((x, xi) =>
			Object.fromEntries([
				['segmentRow', xi],
				['rowInds', x]
			])
		)
	]
}

const bfs = (startKey, endKeys, gridKeys, mergeKeys = false) => {
	let seen = new Set([startKey]),
		queue = new Set([startKey]),
		result = {},
		steps = 1

	endKeys = [...new Set(endKeys)].filter(
		(ek) => ek !== startKey && (gridKeys[ek]['value'] === '.' || gridKeys[ek]['value'] !== gridKeys[startKey]['value'])
	)

	while (endKeys.some((x) => (mergeKeys ? !result[`${startKey}|${x}`] : !result[x]))) {
		newQueue = new Set()
		queue.values().forEach((k) => {
			if (!gridKeys?.[k]?.['neighbours']) console.log(k, gridKeys[k])
			gridKeys[k]['neighbours'].values().forEach((nk) => {
				if (!seen.has(nk)) {
					seen.add(nk)
					if (endKeys.includes(nk)) {
						result[mergeKeys ? `${startKey}|${nk}` : nk] = steps
					} else {
						if (gridKeys[nk]) {
							newQueue.add(nk)
						}
					}
				}
			})
		})
		queue = newQueue
		steps++
	}
	return result
}

const solveP1 = () => {
	let [grid, herbs] = makeGrid(input1, 1)
	let startPos = grid.find((o) => o.row === 0).key
	let herbKeys = herbs[0].keys
	let herbSteps = bfs(startPos, herbKeys, Object.fromEntries(grid.map((o) => [o.key, o])), true)
	return Math.min(...Object.values(herbSteps)) * 2
}

const mergePaths = (prev, next) => {
	let newObj = {}

	Object.entries(prev).forEach(([pk, pv]) => {
		let [start, end, currScore] = pk.split('|')

		Object.entries(next).forEach(([nextScore, nObj]) => {
			Object.entries(nObj).forEach(([nk, nv]) => {
				let [nStart, nEnd] = nk.split('|')
				let newKey = `${start}|${nEnd}|${currScore}${nextScore}`
				if (end === nStart && (!newObj[newKey] || newObj[newKey] > pv + nv)) {
					newObj[newKey] = pv + nv
				}
			})
		})
	})

	return newObj
}

const sumHerbs = (h1, h2) => (parseInt(h1, 2) | parseInt(h2, 2)).toString(2).padStart(h1.length, '0')

const singleHerbPath = (herbKeys, entrances, exits, gridObj) => {
	return herbKeys.reduce(
		(distances, hKey) => {
			let hDistances = bfs(hKey, entrances.concat(exits), gridObj)
			Object.keys(distances).forEach((dk) => {
				let [s, e] = dk.split('|')
				distances[dk] = Math.min(distances[dk], hDistances[s] + hDistances[e])
			})

			return distances
		},
		Object.fromEntries(entrances.flatMap((x) => exits.flatMap((y) => `${x}|${y}`)).map((x) => [x, Infinity]))
	)
}

const solveP2P3 = (input, partNo) => {
	let [grid, allHerbs, cols, segments] = makeGrid(input, partNo)

	let total = 0

	cols.forEach(([cs, ce], colInd) => {
		let startFromTop = grid.some((o) => o.key.startsWith('0') && o.segmentCol.includes(colInd)),
			rows = startFromTop ? segments : segments.toReversed()

		rows = rows.map((o, i) => {
			let [s, e] = startFromTop ? o.rowInds : o.rowInds.toReversed()
			o.keys = grid.filter((g) => g.segmentCol.includes(colInd) && g.segmentRow.includes(o.segmentRow))
			o.obj = Object.fromEntries(o.keys.map((k) => [k.key, k]))
			o.entrances = o.keys.flatMap((k) =>
				k.row === s || (!startFromTop && (k.col === cs || k.col === ce)) ? [k.key] : []
			)
			o.exits = o.keys.flatMap((k) => (k.row === e ? [k.key] : []))
			o.herbs = allHerbs.filter((k) => k.segmentCol === colInd && k.segmentRow === o.segmentRow)
			o.sameColExit = o.herbs.length
				? [...new Set(o.herbs.flatMap((h) => h.keys.map((hk) => hk.split('_')[1])))].every((hk) =>
						o.entrances.some((ek) => ek.endsWith(`${+hk - 1}`) || ek.endsWith(`${+hk + 1}`))
					)
				: false
			return o
		})

		let lastRow = rows.pop()

		// Calculate all combos of traversing all prior segments (except last) with/without herb
		let subPaths = rows.reduce((paths, { keys, obj, entrances, exits, herbs, sameColExit }, i) => {
			let rPaths = [
				entrances.reduce((eObj, k) => {
					return { ...eObj, ...bfs(k, exits, obj, true) }
				}, {})
			]

			if (herbs.length) {
				if (sameColExit) {
					rPaths.push(
						Object.fromEntries(
							Object.entries(rPaths[0])
								.filter(([k, v]) => {
									let [s, e] = k.split('|').map((ek) => ek.split('_')[1])
									return s === e && herbs[0].keys.some((hk) => hk.endsWith(+s + 1) || hk.endsWith(+s - 1))
								})
								.map(([k, v]) => [k, v + 2])
						)
					)
				} else {
					rPaths.push(singleHerbPath(herbs[0].keys, entrances, exits, obj))
				}

				Object.entries(rPaths[1]).forEach(([k, v]) => {
					if (rPaths[0]?.[k] && rPaths[0][k] >= v) {
						delete rPaths[0][k]
					}
				})
			}

			return i === 0
				? Object.fromEntries(
						Object.entries(rPaths).flatMap(([score, p]) =>
							Object.entries(p).flatMap(([k, v]) => [[`${k}|${score}`, v]])
						)
					)
				: mergePaths(paths, rPaths)
		}, {})

		// Filter paths where equal or shorter paths have more herbs
		subPaths = Object.entries(subPaths).filter(([k, v], i, a) => {
			let [s, e, score] = k.split('|')
			return !a.some(([ak, av]) => {
				let [as, ae, aScore] = ak.split('|')
				return ak !== k && e === ae && av <= v && sumHerbs(score, aScore) === aScore
			})
		})

		// Process all combos for last segment
		const lastPaths = ({ keys, obj, entrances, exits, herbs, sameColExit }) => {
			let herbKeys = herbs.flatMap((h) => h.keys),
				poi = colInd === 1 ? keys.filter((k) => k.col === cs || k.col === ce).map((k) => k.key) : [],
				startKeys = herbKeys.concat(poi),
				distances = startKeys.reduce((a, c) => {
					return { ...a, ...bfs(c, entrances.concat(startKeys), obj, true) }
				}, {}),
				len = herbs.length + poi.length + 1,
				result = {}

			if (len === 2) return singleHerbPath(herbKeys, entrances, entrances, obj)

			let queue = Object.keys(distances)
				.filter((k) => entrances.some((e) => k.includes(e)))
				.map((x) => {
					let nodes = x.split('|').toReversed()
					let hSeen = nodes.flatMap((n) => (obj[n]['value'] !== '.' ? [obj[n]['value']] : []))
					return [[x, nodes.join('|')], nodes, hSeen, distances[x]]
				})

			const makeLastPath = ([seen, nodes, sHerbs, steps], pathLen) => {
				let nextKeys = Object.keys(distances).filter((k) => {
					let [s, e] = k.split('|')
					let endVal = obj[e]['value']

					return k.startsWith(nodes.at(-1)) && !seen.includes(k) && (endVal === '.' || !sHerbs.includes(endVal))
				})

				nextKeys
					.filter((nk) =>
						seen.length < pathLen
							? nodes.every((no) => no !== nk.split('|')[1]) && !entrances.some((ek) => nk.endsWith(ek))
							: entrances.some((ek) => nk.endsWith(ek))
					)
					.forEach((nk) => {
						let [s, e] = nk.split('|')
						let val = obj[e]['value']
						let newDist = steps + distances[nk]

						if (seen.length < pathLen) {
							queue.push([seen.concat(nk), nodes.concat(s, e), sHerbs.concat(val !== '.' ? val : []), newDist])
						} else {
							let dKey = `${nodes[0]}|${e}`
							if (!result?.[dKey] || newDist < result[dKey]) {
								result[dKey] = newDist
							}
						}
					})
			}

			while (queue.length) {
				makeLastPath(queue.shift(), len)
			}

			return result
		}

		let last = lastPaths(lastRow)
		let herbTotal = rows.map((o) => +!!o.herbs.length).join('')
		let hLen = herbTotal.length
		let minSteps = Infinity

		//Find all pairs of paths that collect all herbs, and add matching end path/steps
		while (subPaths.length > 1) {
			let [currKey, currSteps] = subPaths.shift()
			let [s, e, score] = currKey.split('|')
			subPaths
				.filter(([nk, nSteps]) => sumHerbs(score, nk.slice(-hLen)) === herbTotal)
				.forEach(([nk, nSteps]) => {
					let [ns, ne, nScore] = nk.split('|')
					let endDist = last[`${e}|${ne}`]
					let totalDist = currSteps + nSteps + endDist
					if (totalDist < minSteps) {
						minSteps = totalDist
					}
				})
		}

		total += minSteps
	})
	return total
}

console.log('P1', solveP1())
console.log('P2', solveP2P3(input2, 2))
console.log('P2', solveP2P3(input3, 3))
