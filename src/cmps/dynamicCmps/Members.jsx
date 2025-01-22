import React, { useEffect, useRef } from 'react'
import { MembersModal } from './modals/MembersModal.jsx'
import { openModal, closeModal } from '../../store/actions/boards.actions.js'
import { useSelector } from "react-redux";

export function Members({ cellId, group, task, members, onTaskUpdate, users }) {
    const openModals = useSelector(state => state.boardModule.openModals)
    const modal = openModals.some(modalId => modalId === cellId)

    const modalRef = useRef(null)
    const membersCellRef = useRef(null)

    const defultImg = 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg'

    // close and open modal as needed
    function modalToggle() {
        modal
        ? closeModal(cellId)
        : openModal(cellId)
    }

    function onAddMember(member) {
        modalToggle()
        onTaskUpdate({ group, task, type: 'members', value: [...members, member] })
    }

    function onRemoveMember(memberToRemove) {
        const newMembers = members.filter(member =>
            memberToRemove.id !== member.id)
        onTaskUpdate({ group, task, type: 'members', value: newMembers })
    }

    function handleClickOutsideModal(event) {
        if (!modalRef.current.contains(event.target)
            && !membersCellRef.current.contains(event.target))
            modalToggle()
    }

    useEffect(() => {
        if (modal) document.addEventListener
            ('mousedown', handleClickOutsideModal)
        else document.removeEventListener
            ('mousedown', handleClickOutsideModal)
        return () => document.removeEventListener
            ('mousedown', handleClickOutsideModal)

    }, [modal])

    const displayedMembers = members.slice(0, 3);
    const extraMembersCount = members.length - 3;
    return (
        <section className="members">
            <div
                className="members-cell"
                ref={membersCellRef}
                onClick={modalToggle}>
                {
                    members.length ?
                        displayedMembers.map(member =>
                            <span key={member.id}>
                                <img src={member.imgUrl} />
                            </span>
                        )

                        : <img src={defultImg} />
                }
                {extraMembersCount > 0 && (
                    <div className="extra-members" style={{ color: 'black' }}>+{extraMembersCount}</div>
                )}
            </div>

            {/* members modal*/}
            {modal &&
                <div ref={modalRef}>
                    <MembersModal
                        ParticipateMembers={members}
                        onAddMember={onAddMember}
                        onRemoveMember={onRemoveMember}
                        users={users} />

                </div>
            }
        </section>
    )
}