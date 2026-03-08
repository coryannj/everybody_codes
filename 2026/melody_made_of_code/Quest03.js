const { channel } = require('diagnostics_channel');
const fs = require('fs');
const input1 = fs.readFileSync('../../inputs/everybody_codes/2026/melody_made_of_code/quest3_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../../inputs/everybody_codes/2026/melody_made_of_code/quest3_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../../inputs/everybody_codes/2026/melody_made_of_code/quest3_3.txt',{ encoding: 'utf8', flag: 'r' });

const solve = (input,partNo) => {
    let lines = input.split(/[\r\n]/).map((x)=>x.split(/,\s+/).map((y)=>y.split('=')))

    let tree = {}, root=1, len = lines.length, thisNode

    lines.forEach((x,i)=>{
        tree[x[0][1]] = Object.fromEntries(x)
        tree[x[0][1]].parent = null
        tree[x[0][1]].leftChild = null
        tree[x[0][1]].rightChild = null
    })

    const checkBond = (socketNode,side,partNo) => {
        let plug = thisNode.plug
        let plugSplit = plug.split(' ')
        let socket = socketNode[`${side}Socket`]
        let socketSplit = socket.split(' ')

        if(socketNode[`${side}Child`] === null){
            if(plug === socket) return 1 // Strong

            if(partNo>1 && (socketSplit[0] === plugSplit[0] || socketSplit[1] === plugSplit[1])) return 2 // Weak
        } else {
            if(partNo === 3 && socketNode[`${side}Socket`] !== tree[socketNode[`${side}Child`]]['plug'] && plug === socket) return 3 // Strong - need to replace weak
        }
        
        return 0 // No match
    }

    const switchNodes = (currNode,side) => {
        let oldNode = currNode[`${side}Child`]

        // Replace weak bond with strong
        tree[currNode.id][`${side}Child`] = thisNode.id
        tree[thisNode.id]['parent'] = currNode.id

        // Insert detached node to recursive function
        thisNode = tree[oldNode]
    }

    const findParent = (currNode,partNo) => {
        // Check left side
        let lCheck = checkBond(currNode,'left',partNo)

        if(!!lCheck){
            if(lCheck<3){
                return [currNode,'left']
            } else {
                switchNodes(currNode,'left')
            }
        } else {
            if(currNode.leftChild !== null){
                let leftTraverse = findParent(tree[currNode.leftChild],partNo)
                if(leftTraverse !== null) return leftTraverse
            }
        }

        // Check right side
        let rCheck = checkBond(currNode,'right',partNo)

        if(!!rCheck){
            if(rCheck<3){
                return [currNode,'right']
            } else {
                switchNodes(currNode,'right')
            }
        } else {
            if(currNode.rightChild !== null){
                let rightTraverse = findParent(tree[currNode.rightChild],partNo)
                if (rightTraverse !== null) return rightTraverse
            }
        }
        
        return null
    }

    // Build tree
    for(i=root+1;i<=len;i++){
        thisNode = tree[i]
        let pNode = null

        while(pNode === null){ // For part 3 if need to loop round
            pNode = findParent(tree[1],partNo) 
        }

        let [parent,side] = pNode

        tree[thisNode.id]['parent'] = parent.id
        tree[parent.id][`${side}Child`] = thisNode.id
    }

    // Make checksum
    let seen = []
    let ans = []
    let currId = '1'

    while(ans.length<len){
        let thisNode = tree[currId]

        if(!seen.includes(currId)){
            seen.push(currId)
            if(thisNode.leftChild === null){
                ans.push(currId)
                currId = thisNode.rightChild ?? thisNode.parent       
            } else {
                currId = thisNode.leftChild   
            }
            continue;  
        }
        
        if(!ans.includes(currId)) ans.push(currId)

        currId = thisNode.rightChild ?? thisNode.parent

        while(ans.includes(currId)){
            currId = tree[currId].parent
        }
    }
    
    //ans.forEach((x)=>console.log(tree[x]['data'])) // To print melodies for the music box
        
    return ans.map((x,i)=>(i+1)*(+x)).reduce((a,c)=>a+c)
}

console.log(solve(input1,1))
console.log(solve(input2,2))
console.log(solve(input3,3))