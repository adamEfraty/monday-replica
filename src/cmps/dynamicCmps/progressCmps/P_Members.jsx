

export function P_Members({tasks}){

    const defultImg = 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg'
    const allMembers = allActiveMembers(tasks)

    function allActiveMembers(tasks){
        const result = []
        for (const task of tasks){
            for(const member of task.members){
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
                ? allMembers.map(member=><span key={member.id}>
                    <img src={member.imgUrl}/>
                </span>)
                : <img src={defultImg}/>


            }
        </div>
    )
}