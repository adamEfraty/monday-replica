
export function MembersModal({ ParticipateMembers, onAddMember, onRemoveMember, usersInBoard, users }) {

    //temporary taking from demo data
    const membersInBoard = [...users]

    const nonParticipateMembers = membersInBoard.filter(member =>
        !ParticipateMembers.find(cMember => cMember.id === member.id))


    return (
        <section className="members-modal">

            {/* list of members you can remove from task*/}
            <ul className="participate-list">
                {
                    ParticipateMembers.map(member =>
                        <li key={member.id}>
                            <img src={member.imgUrl} />
                            <p>{member.fullName}</p>
                            <button onClick={() => onRemoveMember(member)}>x</button>
                        </li>
                    )
                }
            </ul>

            {/* list of members you can add to task*/}

            <div className="non-participate-part">

                <p>Suggested people</p>

                <ul className="non-participate-list">
                    {
                        nonParticipateMembers.map(member =>
                            <li key={member.id}
                                onClick={() => onAddMember(member)}>
                                <img src={member.imgUrl} />
                                <p>{member.fullName}</p>
                            </li>
                        )
                    }
                </ul>

            </div>


        </section>
    )
}

