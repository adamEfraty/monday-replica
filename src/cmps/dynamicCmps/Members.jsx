import React, { useEffect, useRef } from 'react'
import { MembersModal } from './modals/MembersModal.jsx'
import { openModal, closeModal } from '../../store/actions/boards.actions.js'
import { useSelector } from "react-redux";

export function Members({cellInfo, onTaskUpdate, users, labelWidth }) {
    const openModals = useSelector(state => state.boardModule.openModals)
    const modal = openModals.some(modalId => modalId === (cellInfo.taskId + cellInfo.labelId))

    const modalRef = useRef(null)
    const membersCellRef = useRef(null)

    const defultImg = 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg'

    // close and open modal as needed
    function modalToggle() {
        modal
        ? closeModal(cellInfo.taskId + cellInfo.labelId)
        : openModal(cellInfo.taskId + cellInfo.labelId)
    }

    function onAddMember(member) {
        modalToggle()
        onTaskUpdate({...cellInfo, value: [...cellInfo.value, member]})
    }

    function onRemoveMember(memberToRemove) {
        const newMembers = cellInfo.value.filter(member =>
            memberToRemove.id !== member.id)
        onTaskUpdate({...cellInfo, value: newMembers})
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

    const displayedMembers = cellInfo.value.slice(0, 3);
    const extraMembersCount = cellInfo.value.length - 3;
    return (
        <section className="members">
            <div
                className="members-cell"
                ref={membersCellRef}
                onClick={modalToggle}>
                {
                    cellInfo.value.length ?
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
                        ParticipateMembers={cellInfo.value}
                        onAddMember={onAddMember}
                        onRemoveMember={onRemoveMember}
                        users={users} 
                        labelWidth={labelWidth}/>

                </div>
            }
        </section>
    )
}