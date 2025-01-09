
export function MembersModal(){

    //temporary all excist members selection
    const allMembers = [{text:'Low', color:'#86B6FB'},{text:'Medium', color:'#5559DF'},
        {text:'High', color:'#401694'},{text:'Critical ⚠️', color:'#333333'}]


    return (
        <section className="priority-modal">
            {/* list of quick access members */}
            <ul>
                {
                    priorities.map(priority =>
                        <li key={priority.text}
                            onClick={()=>onPriorityChange(priority)}
                            style={{backgroundColor: priority.color}}>
                            {priority.text}
                        </li>
                    )
                }
            </ul>

            <button>Edit Labels</button>
        </section>
    )
}

