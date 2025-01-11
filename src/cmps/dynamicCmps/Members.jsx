import React, { useState, useEffect, useRef } from 'react'
import { MembersModal } from './modals/MembersModal.jsx'

export function Members({usersInBoard, taskId, info, onTaskUpdate}) {

    const [modal, setModal] = useState(false)
    const [members, setMembers] = useState(info)

    const modalRef = useRef(null)
    const membersCellRef = useRef(null)

    // defult image in case there is no members
    const defultImg = 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg'

    // clase and open modal as needed
    function modalToggle() {
        setModal(prev => !prev)
    }

    function onAddMember(member){
        setMembers([...members, member])
        modalToggle()
        onTaskUpdate({taskId, type:'members update', value: members})

    }

    function onRemoveMember(memberToRemove){
        const newMembers = members.filter(member=>
            memberToRemove.id !== member.id)
        setMembers(newMembers)
        onTaskUpdate({taskId, type:'members update', value: members})
    }

    //if user click outside modal close it
    function handleClickOutsideModal(event) {
        if (!modalRef.current.contains(event.target)
            && !membersCellRef.current.contains(event.target))
            modalToggle()
    }

    // open listener to handleClickOutsideModal only when modal open
    useEffect(() => {
        if (modal) document.addEventListener
            ('mousedown', handleClickOutsideModal)
         else document.removeEventListener
            ('mousedown', handleClickOutsideModal)
        return () => document.removeEventListener
            ('mousedown', handleClickOutsideModal)

    }, [modal])

    return (
        <section className="members">
            {/* members cell*/}
            <div 
            className="members-cell" 
            ref={membersCellRef}
            onClick={modalToggle}>
                {
                members.length ?
                members.map(member => 
                    <span key={member.id}>
                        <img src={member.image}/>
                    </span>
                    )
                
                : <img src={defultImg}/>
                }
            </div>

            {/* members modal*/}
            {modal && 
                <div ref={modalRef}>
                    <MembersModal 
                    ParticipateMembers={members}
                    onAddMember={onAddMember}
                    onRemoveMember={onRemoveMember}
                    usersInBoard={usersInBoard}/>
                </div>
            }
        </section>
    )
}