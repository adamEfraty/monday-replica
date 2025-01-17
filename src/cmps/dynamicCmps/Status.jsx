import { useEffect, useRef } from 'react'
import { StatusModal } from './modals/StatusModal.jsx'
import { openModal } from '../../store/actions/boards.actions.js'
import { useSelector } from "react-redux";

export function Status({ cellId, group, task, status, onTaskUpdate }) {
    const openModalId = useSelector(state => state.boardModule.openModal)
    const modal = (openModalId === cellId)

    const modalRef = useRef(null)
    const statusCellRef = useRef(null)

    // close and open modal as needed
    function modalToggle() {
        modal
        ? openModal(null)
        : openModal(cellId)
    }

    function onStatusChange(status) {
        onTaskUpdate({ group, task, type: 'status', value: status })
        modalToggle()
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
                        onStatusChange={onStatusChange} />
                </div>
            }
        </section>
    )
}
