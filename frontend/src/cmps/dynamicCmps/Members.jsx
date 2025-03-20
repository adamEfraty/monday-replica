import React, { useEffect, useRef, useState } from 'react'
import { MembersModal } from './modals/MembersModal.jsx'
import { openModal, closeModal } from '../../store/actions/boards.actions.js'
import { useSelector } from "react-redux";
import { getSvg } from '../../services/svg.service.jsx';

export function Members({ cellInfo, onTaskUpdate, users, labelWidth, isHover, setIsSelect, isSelect }) {
    const openModals = useSelector(state => state.boardModule.openModals)
    const modal = openModals.some(modalId => modalId === (cellInfo.taskId + cellInfo.labelId))

    const modalRef = useRef(null)
    const membersCellRef = useRef(null)

    const defultImg = 'https://cdn.monday.com/icons/dapulse-person-column.svg'

    const [isHovered, setIsHovered] = useState(false);
    
    useEffect(()=>{
        setIsSelect(modal)
    }, [modal])

    function modalToggle() {
        modal
            ? closeModal(cellInfo.taskId + cellInfo.labelId)
            : openModal(cellInfo.taskId + cellInfo.labelId)
    }

    function onAddMember(member) {
        onTaskUpdate({ ...cellInfo, value: [...cellInfo.value, member] })
    }

    function onRemoveMember(memberToRemove) {
        const newMembers = cellInfo.value.filter(member =>
            memberToRemove._id !== member._id)
        onTaskUpdate({ ...cellInfo, value: newMembers })
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

    const numberOfMembersThatFits = Math.floor(labelWidth / 35)
    const displayedMembers = cellInfo?.value?.slice(0, numberOfMembersThatFits);
    const extraMembersCount = cellInfo?.value?.length - numberOfMembersThatFits;
    return (
        <section className="members" 
        style={{backgroundColor: isSelect ? '#CCE5FF' : (isHover ? '#F4F5F8' : 'white'),
            outline: modal? 'solid 1px #0073EA' : 'none',
            outlineOffset: modal ? '-1px' : ''
        }}>
            <div
                className="members-cell"
                ref={membersCellRef}
                onClick={modalToggle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                >
                {
                    cellInfo.value.length ?
                        displayedMembers.map(member =>
                            <img key={member.id} src={member.imgUrl} />
                        )

                        : <img className="defult-img" src={defultImg} />
                }
                {extraMembersCount > 0 && (
                    <div className="extra-members">+{extraMembersCount}</div>
                )}
                {isHovered && getSvg('plus-circle-icon')}
            </div>

            {/* members modal*/}
            {modal &&
                <div ref={modalRef}>
                    <MembersModal
                        ParticipateMembers={cellInfo.value}
                        onAddMember={onAddMember}
                        onRemoveMember={onRemoveMember}
                        users={users}
                        labelWidth={labelWidth} />

                </div>
            }
        </section>
    )
}