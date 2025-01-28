import { useEffect, useRef } from 'react'
import { StatusModal } from './modals/StatusModal.jsx'
import { openModal, closeModal } from '../../store/actions/boards.actions.js'
import { useSelector } from "react-redux";

export function Status({cellInfo, onTaskUpdate}) {
    const openModals = useSelector(state => state.boardModule.openModals)
    const modal = openModals.some(modalId => modalId === (cellInfo.taskId + cellInfo.labelId))

    const modalRef = useRef(null)
    const statusCellRef = useRef(null)

    // close and open modal as needed
    function modalToggle() {
        modal
        ? closeModal(cellInfo.taskId + cellInfo.labelId)
        : openModal(cellInfo.taskId + cellInfo.labelId)
    }

    function onStatusChange(status) {
        onTaskUpdate({...cellInfo, value: status})
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
                style={{ backgroundColor: cellInfo.value.color }}>
                {cellInfo.value.text}
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
