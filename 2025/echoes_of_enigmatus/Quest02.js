const fs = require('fs');
const input1 = fs.readFileSync('../../inputs/everybody_codes/2025/echoes_of_enigmatus/quest2_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../../inputs/everybody_codes/2025/echoes_of_enigmatus/quest2_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../../inputs/everybody_codes/2025/echoes_of_enigmatus/quest2_3.txt',{ encoding: 'utf8', flag: 'r' });

const solve = (input,partNo) => {
    let lines = input.split(/[\r\n]/).map((x)=>x.split(/\s+/).map((y,yi)=>yi === 0 ? y : y.split('=')))

    let tree = {}
    let ids = {}
    let root

    const findParent = (thisNode,currNode) => {
        if(thisNode.value<currNode.value){
            if(currNode.leftChild === null){
                return [currNode.key,'leftChild']
            } else {
                return findParent(thisNode,tree[currNode.leftChild])
            }
        } else {
            if(currNode.rightChild === null){
                return [currNode.key,'rightChild']
            } else {
                return findParent(thisNode,tree[currNode.rightChild])
            }
        }
    }

    lines.forEach((x,i)=>{
        if(x[0] === 'ADD'){
            let id = x[1][1]
            let a = ['value','letter']
            let keys = []

            x.slice(2).forEach((v)=>{
                let rankObj = Object.fromEntries(v[1].match(/[\w!]+/g).map((x,xi)=>[a[xi],i===0 ? +x: x]))
                let key = `${id}_${rankObj['letter']}_${rankObj['value']}`
                keys.push(key)

                let baseObj = {
                    'key':key,
                    'leftChild':null,
                    'rightChild':null,
                }

                tree[key] = Object.assign(rankObj,baseObj)
            })

            ids[id] = keys

            if(i === 0){
                root = keys
            } else {
                keys.forEach((x,xi)=>{
                    let [parent,side] = findParent(tree[x],tree[root[xi]])
                    tree[parent][side] = x
                })
            }
            
        } else {
            let swapId = +x[1][0]
            let nodeIds = ids[swapId]
            
            if(swapId>1){
                let parents = nodeIds.map((x)=>Object.keys(tree).find((y)=>tree[y]['leftChild'] === x || tree[y]['rightChild'] === x))

                parents.forEach((x,i)=>{
                        let otherInd = i===0 ? 1 : 0
                        let side = tree[x]['leftChild'] === nodeIds[i] ? 'left' : 'right'
                        tree[x][`${side}Child`] = nodeIds[otherInd]
                })
            }

            if(partNo === 2){
                nodeIds.map((x)=>structuredClone(tree[x])).forEach((x,i)=>{
                    let otherInd = i===0 ? 1 : 0
                    tree[nodeIds[otherInd]]['leftChild'] = x['leftChild']
                    tree[nodeIds[otherInd]]['rightChild'] = x['rightChild']
                })
            }

            if(swapId === 1) root.reverse()
        }

    })

    let levels = [[],[]]

    root.forEach((x,i)=>{
        let queue = [x]
        levels[i].push(queue)

        do{
            let newQueue = []
            
            queue.forEach((id)=>{
                let node = tree[id]
                if(node.leftChild !== null) newQueue.push(node.leftChild);
                if(node.rightChild !== null) newQueue.push(node.rightChild);
            })
            
            levels[i].push(newQueue.map((x)=>x.match(/[!A-Z]/)));
            queue = newQueue;
        } while (queue.length>0)
    })

    return levels.map((x)=>x.sort((a,b)=>b.length-a.length)[0].join('')).join('')
}

console.log(solve(input1,1))
console.log(solve(input2,2))
console.log(solve(input3,3))
