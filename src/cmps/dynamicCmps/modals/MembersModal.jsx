
export function MembersModal({ParticipateMembers, onAddMember, onRemoveMember}){

    //temporary all exsist members * Later will take from Board's shared users

    const imageLinks = [
        "https://images.pexels.com/photos/30061809/pexels-photo-30061809/free-photo-of-fashionable-woman-posing-with-colorful-headscarf.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/30007901/pexels-photo-30007901/free-photo-of-thoughtful-man-in-grey-coat-outdoors.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/28773362/pexels-photo-28773362/free-photo-of-dynamic-black-and-white-portrait-of-young-man-on-phone.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/30071289/pexels-photo-30071289/free-photo-of-portrait-of-a-bearded-man-outdoors.jpeg?auto=compress&cs=tinysrgb&w=600",
    ];

    const membersInBoard = [{id: 'userid0', name: "tal", color: "red", image: imageLinks[0]},
        {id: 'userid1', name: "shal", color: "green", image: imageLinks[1] },
        {id: 'userid2', name: "bal", color: "black", image: imageLinks[2] },
        {id: 'userid3', name: "shal", color: "green", image: imageLinks[3] }]

    // the code starts from here

    const nonParticipateMembers = membersInBoard.filter(member=> 
        !ParticipateMembers.find(cMember=> cMember.id === member.id))


    return (
        <section className="members-modal">

            {/* list of members you can remove from task*/}
            <ul className="participate-list">
                {
                    ParticipateMembers.map(member=>
                        <li key={member.id}>
                            <img src={member.image}/>
                            <p>{member.name}</p>
                            <button onClick={()=>onRemoveMember(member)}>x</button>
                        </li>
                    )
                }
            </ul>

            {/* list of members you can add to task*/}

            <div className="non-participate-part">

                <p>Suggested people</p>

                <ul className="non-participate-list">
                    {
                        nonParticipateMembers.map(member=>
                            <li key={member.id}
                            onClick={()=>onAddMember(member)}>
                                <img src={member.image}/>
                                <p>{member.name}</p>
                            </li>
                        )
                    }
                </ul>

            </div>
            

        </section>
    )
}

