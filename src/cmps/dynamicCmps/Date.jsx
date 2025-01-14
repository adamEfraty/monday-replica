import React, { useState, useEffect, useRef } from 'react'
import { DateModal } from './modals/DateModal.jsx'

export function Date({group, task, date, onTaskUpdate }) {

    const [modal, setModal] = useState(false)

    const modalRef = useRef(null)
    const dateCellRef = useRef(null)

    // clase and open modal as needed
    function modalToggle() {
        setModal(prev => !prev)
    }

    function onDateChange(date){
        modalToggle()
        onTaskUpdate({group, task, type:'date', value: date})
    }

    //if user click outside modal close it
    function handleClickOutsideModal(event) {
        if (!modalRef.current.contains(event.target)
            && !dateCellRef.current.contains(event.target))
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
        <section className="date">
            {/* date cell*/}
            <div 
            className="date-cell" 
            ref={dateCellRef}
            onClick={modalToggle}>
                {date}
            </div>

            {/* date modal*/}
            {modal && 
                <div ref={modalRef}>
                    <DateModal 
                    currentDate={date}
                    onDateChange={onDateChange}/>
                </div>
            }
        </section>
    )
}
