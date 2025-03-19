import { useEffect, useRef } from 'react'
import { PriorityModal } from './modals/PriorityModal.jsx'
import { openModal, closeModal } from '../../store/actions/boards.actions.js'
import { useSelector } from "react-redux";
import { Opacity } from '@mui/icons-material';

export function Priority({ cellInfo, onTaskUpdate, labelWidth, isHover, setIsSelect, isSelect }) {
    const openModals = useSelector(state => state.boardModule.openModals)
    const modal = openModals.some(modalId => modalId === (cellInfo.taskId + cellInfo.labelId))

    const modalRef = useRef(null)
    const priorityCellRef = useRef(null)

    useEffect(()=>{
        setIsSelect(modal)
    }, [modal])

    // close and open modal as needed
    function modalToggle() {
        modal
            ? closeModal(cellInfo.taskId + cellInfo.labelId)
            : openModal(cellInfo.taskId + cellInfo.labelId)
    }

    function onPriorityChange(priority) {

        onTaskUpdate({ ...cellInfo, value: priority })
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
                style={{ backgroundColor: cellInfo.value.color,
                    opacity: isHover ? '0.8' : '1'
                }}>
                {cellInfo.value.text}
            </div>

            {/* priority modal*/}
            {modal &&
                <div ref={modalRef}>
                    <PriorityModal
                        onPriorityChange={onPriorityChange}
                        labelWidth={labelWidth} />
                </div>
            }
        </section>
    )
}