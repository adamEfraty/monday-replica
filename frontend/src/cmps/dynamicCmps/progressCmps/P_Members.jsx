

export function P_Members({tasks, labelId, labelWidth}){
    // tasks: [{taskId: xxx, cells: [{memberCell}, ...]}, ...]
    const defultImg = 'https://cdn.monday.com/icons/dapulse-person-column.svg'
    const allMembers = allActiveMembers(tasks)

    function allActiveMembers(tasks){
        const result = []
        for (const task of tasks){
            const membersCell = task.cells.find(cell=>
                cell.labelId === labelId)
            for(let member of membersCell.value){
                const alreadyIn = result.some(memb=> 
                    member._id === memb._id)
                if (!alreadyIn) result.push(member)
            }
        }
        return result
    }

    const numberOfMembersThatFits = Math.floor(labelWidth / 35) //this will changes base on images width
    const displayedMembers = allMembers.slice(0, numberOfMembersThatFits);
    const extraMembersCount = allMembers.length - numberOfMembersThatFits;

    return(
        <div className="progress-members">
            {
                
                allMembers.length
                ? displayedMembers.map(member=>
                    <img key={member.id} src={member.imgUrl}/>)
                : <img className="defult-img" src={defultImg}/>
            }
            {
                extraMembersCount > 0 && 
                    <div className="extra-members">+{extraMembersCount}</div>
                
            }
        </div>
    )
}