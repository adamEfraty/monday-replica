import { useEffect, useRef } from 'react'
import { PriorityModal } from './modals/PriorityModal.jsx'
import { openModal } from '../../store/actions/boards.actions.js'
import { useSelector } from "react-redux";

export function Priority({cellId, group, task, priority, onTaskUpdate }) {
    const openModalId = useSelector(state => state.boardModule.openModal)
    const modal = (openModalId === cellId)

    const modalRef = useRef(null)
    const priorityCellRef = useRef(null)

    // close and open modal as needed
    function modalToggle() {
        modal
        ? openModal(null)
        : openModal(cellId)
    }

    function onPriorityChange(priority){
        onTaskUpdate({group, task, type:'priority', value: priority})
        modalToggle()
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