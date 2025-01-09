import React, { useState, useEffect, useRef } from 'react'
import { PriorityModal } from './modals/PriorityModal.jsx'

export function Priority({taskId, info, onTaskUpdate }) {

    const [modal, setModal] = useState(false)
    const [priority, setPriority] = useState({text: info, color: '#cdcdcd'})

    const modalRef = useRef(null)
    const priorityCellRef = useRef(null)

    // clase and open modal as needed
    function modalToggle() {
        setModal(prev => !prev)
    }

    function onPriorityChange(priority){
        setPriority(priority)
        modalToggle()
        onTaskUpdate({taskId, type:'priority update', value: priority.text})
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
