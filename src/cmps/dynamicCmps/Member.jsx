import React, { useState, useEffect, useRef } from 'react'
import { MembersModal } from './modals/membersModal.jsx'

export function Member({taskId, info, onTaskUpdate}) {

    const [modal, setModal] = useState(false)
    const [members, setMembers] = useState(info)

    const modalRef = useRef(null)
    const membersCellRef = useRef(null)

    useEffect(()=>{
        if(!members.length) 
            setMembers([{ image: '' }]) // add defualt image later ****************
    },[members])

    // clase and open modal as needed
    function modalToggle() {
        setModal(prev => !prev)
    }

    function onMembersChange(members){
        setMembers(members)
        modalToggle()
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
                members.map(member => 
                    <span key={member}>
                        <img src={member.image}/>
                    </span>
                    )
                }
            </div>

            {/* members modal*/}
            {modal && 
                <div ref={modalRef}>
                    {/* <MembersModal 
                    onMembersChange={onMembersChange}/> */}
                </div>
            }
        </section>
    )
}