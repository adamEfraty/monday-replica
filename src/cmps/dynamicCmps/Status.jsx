import React, { useState, useEffect, useRef } from 'react'
import { StatusModal } from './modals/StatusModal.jsx'

export function Status({group, task, status, onTaskUpdate }) {

    const [modal, setModal] = useState(false)

    const modalRef = useRef(null)
    const statusCellRef = useRef(null)

    // clase and open modal as needed
    function modalToggle() {
        setModal(prev => !prev)
    }

    function onStatusChange(status){
        modalToggle()
        onTaskUpdate({group, task, type:'status', value: status})
    }

    //if user click outside modal close it
    function handleClickOutsideModal(event) {
        if (!modalRef.current.contains(event.target)
            && !statusCellRef.current.contains(event.target))
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
        <section className="status">
            {/* status cell*/}
            <div 
                className="status-cell" 
                ref={statusCellRef}
                onClick={modalToggle}
                style={{ backgroundColor: status.color }}>
                {status.text}
            </div>

            {/* status modal*/}
            {modal && 
                <div ref={modalRef}>
                    <StatusModal 
                    onStatusChange={onStatusChange}/>
                </div>
            }
        </section>
    )
}
