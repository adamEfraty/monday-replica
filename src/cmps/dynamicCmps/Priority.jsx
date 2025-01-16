import React, { useState, useEffect, useRef } from 'react'
import { PriorityModal } from './modals/PriorityModal.jsx'
import { openModal } from '../../store/actions/boards.actions.js'
import { useSelector } from 'react-redux'

export function Priority({group, task, priority, onTaskUpdate }) {

    const openModalId = useSelector(state => state.boardModule.openModal)
    const toOpenModalAfterRender = (openModalId === task.id)

    const [modal, setModal] = useState(toOpenModalAfterRender)

    const modalRef = useRef(null)
    const priorityCellRef = useRef(null)

    // clase and open modal as needed
    function modalToggle() {
        setModal(prev => {
            !prev
            ? openModal(task.id)
            : openModal(null)
            return !prev
        })
    }

    function onPriorityChange(priority){
        modalToggle()
        onTaskUpdate({group, task, type:'priority', value: priority})
    }

    //if user click outside modal close it
    function handleClickOutsideModal(event) {
        if (!modalRef.current.contains(event.target)
            && !priorityCellRef.current.contains(event.target))
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
        <section className="priority">
            {/* priority cell*/}
            <div 
            className="priority-cell" 
            ref={priorityCellRef}
            onClick={modalToggle}
            style={{ backgroundColor: priority.color }}>
                {priority.text}
            </div>

            {/* priority modal*/}
            {modal && 
                <div ref={modalRef}>
                    <PriorityModal 
                    onPriorityChange={onPriorityChange}/>
                </div>
            }
        </section>
    )
}
