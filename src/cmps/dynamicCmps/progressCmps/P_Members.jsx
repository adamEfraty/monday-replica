

export function P_Members({tasks, labelId}){
    // tasks: [{taskId: xxx, cells: [{memberCell}, ...]}, ...]
    const defultImg = 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg'
    const allMembers = allActiveMembers(tasks)

    function allActiveMembers(tasks){
        const result = []
        for (const task of tasks){
            const membersCell = task.cells.find(cell=>
                cell.labelId === labelId)
            for(let member of membersCell.value){
                const alreadyIn = result.some(memb=> 
                    member.id === memb.id)
                if (!alreadyIn) result.push(member)
            }
        }
        return result
    }

    return(
        <div className="progress-members">
            {
                allMembers.length
                ? allMembers.map(member=>
                    <img key={member.id} src={member.imgUrl}/>)
                : <img src={defultImg}/>
            }
        </div>
    )
}