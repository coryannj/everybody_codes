const { dir, group } = require('console')
const fs = require('fs')
const input1 = fs.readFileSync('../inputs/everybody_codes/2024/quest15_1.txt', { encoding: 'utf8', flag: 'r' })
const input2 = fs.readFileSync('../inputs/everybody_codes/2024/quest15_2.txt', { encoding: 'utf8', flag: 'r' })
const input3 = fs.readFileSync('../inputs/everybody_codes/2024/quest15_3.txt', { encoding: 'utf8', flag: 'r' })

// Generate cartesian product of given iterables:

function* cartesian(head, ...tail) {
	const remainder = tail.length > 0 ? cartesian(...tail) : [[]]
	for (let r of remainder) {
		for (let h of head) {
			//console.log('h',h,' r',r)
			yield [h, ...r]
		}
	}
}
let sides = [
	[[0, 1]],
	[
		[0, 1],
		[1, 0]
	],
	[
		[0, 1],
		[1, 0]
	],
	[[0, 0]]
]
console.log([...cartesian(...sides)])

const neighbours = (r, c) => [
	[r + 1, c],
	[r - 1, c],
	[r, c + 1],
	[r, c - 1]
]

const makeRange = (n1, n2) =>
	Array(Math.abs(n1 - n2) + 1)
		.fill(Math.min(n1, n2))
		.map((x, i) => x + i)

const makeGrid = (input, partNo) => {
	//if(partNo === 3) input = input.replaceAll(/[ER]/g,'.').replace('K','L')
	if (partNo === 3) input = input.replaceAll(/[EKR]/g, '.')
	let herbs = Object.fromEntries(
		'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
			.split('')
			.filter((x) => input.includes(x))
			.map((x, i) => [x, { value: x, bits: parseInt('1'.padEnd(i + 1, '0'), 2) }])
	)

	let lines = input.split(/[\r\n]+/).map((x) => x.split(''))

	let segments = lines
		.flatMap((x, xi) => (x.join('').includes('##########') ? [xi] : []))
		.map((x, xi, a) => [x, a?.[xi + 1]])
		.slice(0, -1)

	let deadEnds = lines.flatMap((r, ri) =>
		r.flatMap((c, ci) =>
			ri > 0 &&
			c === '.' &&
			neighbours(ri, ci).filter(([nr, nc]) => lines?.[nr]?.[nc] && lines[nr][nc] !== '#' && lines[nr][nc] !== '~')
				.length <= 1
				? [[ri, ci]]
				: []
		)
	)

	while (deadEnds.length) {
		deadEnds.forEach(([r, c]) => {
			lines[r][c] = '#'
		})
		deadEnds = lines.flatMap((r, ri) =>
			r.flatMap((c, ci) =>
				ri > 0 &&
				c === '.' &&
				neighbours(ri, ci).filter(([nr, nc]) => lines?.[nr]?.[nc] && lines[nr][nc] !== '#' && lines[nr][nc] !== '~')
					.length <= 1
					? [[ri, ci]]
					: []
			)
		)
	}

	let segmentCols =
		partNo < 3
			? [[0, lines[0].length - 1]]
			: lines[0]
					.flatMap((x, xi) => (lines.map((y) => y[xi]).filter((y) => y === '.').length <= 1 ? [xi] : []))
					.map((x, xi, a) => [x, a?.[xi + 1]])
					.slice(0, -1)

	let grid = []

	lines.forEach((row, rowInd) => {
		row.forEach((val, colInd) => {
			if (val !== '#' && val !== '~') {
				gridObj = {
					key: `${rowInd}_${colInd}`,
					row: rowInd,
					col: colInd,
					value: val,
					segmentRow: segments.flatMap(([s, e], xi) => (s <= rowInd && rowInd <= e ? [xi] : [])),
					segmentCol: segmentCols.flatMap(([s, e], xi) => (s <= colInd && colInd <= e ? [xi] : [])),
					herbScore: val === '.' ? 0 : herbs[val]['bits'],
					neighbours: neighbours(rowInd, colInd).flatMap(([r, c]) =>
						lines?.[r]?.[c] && lines[r][c] !== '#' && lines[r][c] !== '~' ? [[r, c]] : []
					)
				}

				gridObj['nKeys'] = new Set(gridObj.neighbours.map((x) => x.join('_')))
				if (partNo > 1 && val !== '.' && !herbs[val]['segmentCol']) {
					herbs[val]['segmentCol'] = gridObj.segmentCol[0]
					herbs[val]['segmentRow'] = gridObj.segmentRow[0]
				}

				grid.push(gridObj)
			}
		})
	})

	return [
		grid,
		herbs,
		segmentCols,
		segments.map((x, xi) =>
			Object.fromEntries([
				['segmentRow', xi],
				['rowInds', x]
			])
		)
	]
}

//console.log(makeGrid(input3,3).at(-1))

const bfs = (startKey, endKeys, gridKeys, mergeKeys = false) => {
	let seen = new Set([startKey])
	let queue = new Set([startKey])
	let result = {}
	let steps = 1
	endKeys = endKeys.filter(
		(ek) => startKey !== ek && (gridKeys[ek]['value'] === '.' || gridKeys[ek]['value'] !== gridKeys[startKey]['value'])
	)

	while (endKeys.some((x) => (mergeKeys ? !result[`${startKey}|${x}`] : !result[x]))) {
		newQueue = new Set()
		queue.values().forEach((k) => {
			gridKeys[k]['nKeys'].values().forEach((nk) => {
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

// const solvep1 = () => {
//     let [grid] = makeGrid(input1,1)
//     let startPos = grid.find((o)=>o.row === 0).key
//     let herbKeys = grid.flatMap((x)=>x.herbScore>0 ? [x.key] : [])
//     let herbSteps = bfs(startPos,herbKeys,Object.groupBy(grid,({key})=>key),true)
//     return Math.min(...Object.values(herbSteps))*2
// }

// console.log('P1',solvep1())

const solve = (input, partNo) => {
	let [grid, allHerbs, cols, segments] = makeGrid(input, partNo)

	let total = 0

	cols.forEach(([cs, ce], colInd) => {
		let colKeys = grid.filter((o) => o.segmentCol.includes(colInd)),
			startPos = colKeys.find((o) => o.row === 0) || colKeys.find((o) => [cs, ce].includes(o.col)),
			startFromTop = startPos.row === 0,
			rows = startFromTop ? segments : segments.toReversed()
		//console.log(colInd,[cs,ce])
		rows = rows.map((o, i) => {
			let [s, e] = startFromTop ? o.rowInds : o.rowInds.toReversed()
			o.keys = colKeys.filter((k) => k.segmentRow.includes(o.segmentRow))
			o.obj = Object.fromEntries(o.keys.map((k) => [k.key, k]))
			o.entrances = o.keys.filter((k) => k.row === s || (i === 0 && (k.col === cs || k.col === ce)))
			o.exits = o.keys.filter((k) => k.row === e)
			o.herbs = Object.values(allHerbs).filter((k) => k.segmentCol === colInd && k.segmentRow === o.segmentRow)
			o.herbTotal = o.herbs.map((k) => k.bits).reduce((a, c) => a ^ c, 0)
			return o
		})

		let r = rows
			.slice(0, -1)
			.map(({ keys, obj, entrances, exits, herbs, herbTotal }) => {
				let rPaths = {}

				// Paths with herb
				if (herbs.length) {
					let herbKeys = keys.filter((k) => k.value === herbs[0].value)
					let herbCols = new Set(herbKeys.map((k) => k.col))
					let sameColExit =
						herbCols.size === 2 && entrances.some((k) => herbCols.has(k.col - 1) || herbCols.has(k.col + 1))
					let hEntrances = entrances
					let hExits = exits

					if (sameColExit) {
						hEntrances = entrances.filter((k) => herbCols.has(k.col - 1) || herbCols.has(k.col + 1))
						hExits = exits.filter((k) => herbCols.has(k.col - 1) || herbCols.has(k.col + 1))
					}

					let herbPaths = [
						...cartesian(
							hEntrances.map((k) => k.key),
							hExits.map((k) => k.key)
						)
					].filter((k) => !sameColExit || new Set(k.map((v) => v.split('_')[1])).size === 1)
					//console.log(h)
					let herbDistances = herbKeys.reduce(
						(h, x) => {
							let distances = bfs(
								x.key,
								entrances.concat(exits).map((k) => k.key),
								obj
							)
							herbPaths.forEach(([hs, he]) => {
								h[`${hs}|${he}`] = Math.min(h[`${hs}|${he}`], distances[hs] + distances[he])
								//if(distances[hs]+distances[he]<h[`hs_he`])
							})
							return h
						},
						Object.fromEntries(herbPaths.map(([hs, he]) => [`${hs}|${he}`, Infinity]))
					)

					//herbKeys.map((x)=>[x.key,bfs(x.key,entrances.concat(exits).map((k)=>k.key),obj)])
					//console.log(sameColExit,herbPaths.filter((k)=>!sameColExit || new Set(k.map((v)=>v.split('_')[1])).size === 1))
					//console.log(herbDistances)
					rPaths[1] = herbDistances
				}
				rPaths[0] = entrances.reduce((eObj, k) => {
					return {
						...eObj,
						...bfs(
							k.key,
							exits.map((v) => v.key),
							obj,
							true
						)
					}
				}, {})

				// Object.keys(rPaths[0]).forEach((k)=>{
				//     if(rPaths?.[1]?.[k] && rPaths[1][k]<rPaths[0][k]){
				//         console.log('smaller',rPaths[0][k],rPaths[1][k])
				//         rPaths[0][k] = rPaths[1][k]
				//     }
				// })

				return rPaths
				// Paths without herb
				//console.log(herbs,rPaths)
			})
			.reduce((sObj, paths) => {
				if (!Object.keys(sObj).length) {
					console.log(paths)
					return Object.fromEntries(
						Object.entries(paths).flatMap(([score, p]) => Object.entries(p).flatMap(([k, v]) => [[`${k}|${score}`, v]]))
					)
				} else {
					let newObj = {}

					Object.entries(sObj).forEach(([sk, sv]) => {
						let [start, end, currScore] = sk.split('|')

						Object.entries(paths).forEach(([score, scoreObj]) => {
							Object.entries(scoreObj).forEach(([k, v]) => {
								let [nStart, nEnd] = k.split('|')
								let newKey = `${start}|${nEnd}|${currScore}${score}`
								if (end === nStart && (!newObj[newKey] || newObj[newKey] > sv + v)) {
									newObj[newKey] = sv + v
								}
							})
						})
					})

					return newObj
				}
			}, {})
		console.log(r)

		const lastSegment = ({ keys, obj, entrances, exits, herbs, herbTotal }) => {
			let poi = keys.filter((k) => k.col === cs || k.col === ce)
			//let poi = []
			let herbKeys = keys.filter((k) => k.value !== '.')
			//console.log('entrances',entrances)
			//console.log(poi,herbKeys)
			let distances = herbKeys
				.concat(poi)
				.map((k) =>
					bfs(
						k.key,
						entrances.concat(exits, herbKeys, poi).map((v) => v.key),
						obj,
						true
					)
				)
				.reduce((a, c) => {
					return { ...a, ...c }
				}, {})
			//console.log(distances)

			let lPaths = {}
			let eKeys = entrances.map((k) => k.key)
			let toEntrances = Object.entries(distances).filter(([dk, dv]) => eKeys.includes(dk.split('|')[1]))

			let queue = entrances
				.flatMap((ek) => Object.entries(distances).filter(([dk, dv]) => dk.endsWith(ek.key)))
				.map(([dk, dv]) => {
					let firstNode = obj[dk.split('|')[0]]['value']

					return [[dk], firstNode === '.' ? [] : [firstNode], dv, dk.split('|').toReversed().join('|')]

					//{ steps: dv, seen: new Set(dk),last}
				})
			if (colInd === 1) {
				console.log('cs,ce', cs, ce)
				console.log('poi', poi)
				console.log('herbkeys', herbKeys)
				console.log('entrances', entrances)
				console.log('ekeys', eKeys)
				console.log('queue', queue)
			}
			allToVisit = poi.concat(herbKeys).map((p) => p.key)

			while (queue.length) {
				let [seen, seenVals, steps, curr] = queue.shift()
				let [s, e] = curr.split('|')

				let next = Object.entries(distances).filter(([dk, dv]) => {
					let [dks, dke] = dk.split('|')
					let dkeVal = obj[dke]['value']
					return (
						seen.every((s) => s !== dk && !s.includes(dke)) &&
						!seenVals.includes(dkeVal) &&
						dk.startsWith(e) &&
						allToVisit.includes(dke)
					)
				})

				if (next.length) {
					next.forEach(([nk, nv]) => {
						let [dks, dke] = nk.split('|')
						let dkeVal = obj[dke]['value'] !== '.' ? obj[dke]['value'] : []
						queue.push([seen.concat(nk), seenVals.concat(dkeVal), steps + nv, nk])
					})
				} else {
					if (colInd === 1) {
						console.log(
							'end',
							[seen, seenVals, steps, curr],
							' valid exits',
							toEntrances.filter(([ek, ev]) => ek.startsWith(e))
						)
					}
					//console.log('end',[seen,steps,curr],toEntrances.filter(([ek,ev])=> ek.startsWith(e)))
					toEntrances
						.filter(([ek, ev]) => ek.startsWith(e))
						.forEach(([ek, ev]) => {
							let sKey = seen[0].split('|')[1]
							let eKey = ek.split('|')[1]
							let newKey = `${sKey}|${eKey}`
							if (!lPaths?.[newKey] || lPaths[newKey] > steps + ev) {
								lPaths[newKey] = steps + ev
								if (colInd === 1) {
									console.log(newKey, ' is now ', lPaths[newKey])
								}
							}
						})
				}
			}
			return lPaths
		}

		let lastPaths = lastSegment(rows.at(-1))
		console.log(lastPaths)
		let bTotal = parseInt(
			rows
				.slice(0, -1)
				.map((x) => +!!x.herbTotal)
				.join(''),
			2
		)
		console.log(bTotal, bTotal.toString(2))
		let finalResult = Infinity
		let hE = Object.entries(r)

		while (hE.length) {
			let [k, v] = hE.shift()
			let [s, e, hTotal] = k.split('|')

			hE.filter(([hk, hv]) => (parseInt(hTotal, 2) | parseInt(hk.split('|')[2], 2)) >= bTotal).forEach(([nk, nv]) => {
				//console.log([k,v],[nk,nv])
				let [ns, ne, nTotal] = nk.split('|')
				let mEndPath = lastPaths[`${e}|${ne}`]
				if (v + mEndPath + nv < finalResult) {
					console.log('new min found', finalResult, v + mEndPath + nv, [k, v], [nk, nv])
					finalResult = v + mEndPath + nv
				}
			})
		}

		total += finalResult
	})

	return total
}

//console.log(solve(input2,2))
console.log(solve(input3, 3))
