import { useSelector } from "react-redux"

export function MembersModal({ParticipateMembers, onAddMember, onRemoveMember}){
    const users = useSelector((state) => state.userModule.users)

    const nonParticipateMembers = users.filter(member=> 
        !ParticipateMembers.find(cMember=> cMember.id === member.id))


    return (
        <section className="members-modal">

            {/* list of members you can remove from task*/}
            <ul className="participate-list">
                {
                    ParticipateMembers.map(member=>
                        <li key={member.id}>
                            <img src={member.imgUrl}/>
                            <p>{member.fullName}</p>
                            <button onClick={()=>onRemoveMember(member)}>
                                <i className="fa-solid fa-x"></i>
                            </button>
                        </li>
                    )
                }
            </ul>

            {/* list of members you can add to task*/}

            <p className="suggested-people">Suggested people</p>

            <div className="non-participate-list">
                <ul>
                    {
                        nonParticipateMembers.map(member=>
                            <li key={member.id}
                            onClick={()=>onAddMember(member)}>
                                <img src={member.imgUrl}/>
                                <p>{member.fullName}</p>
                            </li>
                        )
                    }
                </ul>
            </div>

        </section>
    )
}

