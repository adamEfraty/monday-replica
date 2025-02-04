import { addLable } from "../store/actions/boards.actions";
import { useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { openModal, closeModal } from '../store/actions/boards.actions.js'
import { getSvg } from "../services/svg.service.jsx";
import { blue } from "@mui/material/colors";



export function AddLabel({groupId, boardId}){
    const openModals = useSelector(state => state.boardModule.openModals)
    const modal = openModals.some(modalId => modalId === (`addlabel-${groupId}`))
    const modalRef = useRef(null)
    const buttonRef = useRef(null)

    const newLabels = [
        {type: "status", name:"status", svg: getSvg('status-icon')},
        {type: "priority", name:"priority", svg: getSvg('priority-icon')},
        {type: "members", name:"members", svg: getSvg('members-icon')},
        {type: "date", name:"date", svg: getSvg('date-icon')},
    ]

    // close and open modal as needed
    function modalToggle() {
        modal
        ? closeModal(`addlabel-${groupId}`)
        : openModal(`addlabel-${groupId}`)
    }

    //if user click outside modal close it
    function handleClickOutsideModal(event) {
        if (!modalRef.current.contains(event.target)
            && !buttonRef.current.contains(event.target))
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

    function onAddLabel(boardId, labelInfo){
        addLable(boardId, labelInfo)
        modalToggle()
    }
    

    return (
        <section className="add-label">
            <button ref={buttonRef}
            className="add-column-button" 
            onClick={modalToggle}
            style={ modal ? {backgroundColor: '#EBEBEC'} : {}}
            >
                <div className={modal ? 'plus-open' : 'plus'}>
                    {
                        getSvg('thin-plus')
                    }
                </div>
            </button>
            {
                modal
                ? <section className="add-label-modal" ref={modalRef}>

                    <ul>
                        {
                            newLabels.map(labelInfo=>
                                <li key={labelInfo.type}
                                    onClick={()=>onAddLabel(boardId, labelInfo)}
                                    className="label-option">
                                    {labelInfo.svg}
                                    {labelInfo.type}
                                </li>
                            )
                        }
                    </ul>
                    
                </section>
                : null
            }
        </section>
    )
}