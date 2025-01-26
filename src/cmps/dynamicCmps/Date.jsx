import { useEffect, useRef } from 'react';
import { DateModal } from './modals/DateModal.jsx';
import { openModal, closeModal } from '../../store/actions/boards.actions.js'
import { useSelector } from "react-redux";

export function Date({ cellInfo, onTaskUpdate }) {
    const openModals = useSelector(state => state.boardModule.openModals)
    const modal = openModals.some(modalId => modalId === (cellInfo.taskId + cellInfo.labelId))

    const modalRef = useRef(null);
    const dateCellRef = useRef(null);

    // close and open modal as needed
    function modalToggle() {
        modal
        ? closeModal(cellInfo.taskId + cellInfo.labelId)
        : openModal(cellInfo.taskId + cellInfo.labelId) 
    }

    function onDateChange(date) {
        onTaskUpdate({...cellInfo, value: date})
        modalToggle()
    }

    function handleClickOutsideModal(event) {
        if (modalRef.current &&
            !modalRef.current.contains(event.target) &&
            !dateCellRef.current.contains(event.target)
        ) modalToggle()
    }



    useEffect(() => {
        if (modal) {
            document.addEventListener('mousedown', handleClickOutsideModal);
        } else {
            document.removeEventListener('mousedown', handleClickOutsideModal);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideModal);
        };
    }, [modal]);



    return (
        <section className="date">
            {/* Date cell */}
            <div
                className="date-cell"
                ref={dateCellRef}
                onClick={modalToggle}>

                {date}
            </div>

            {/* Date modal */}
            {modal && (
                <div ref={modalRef}>
                    <DateModal
                        currentDate={date}
                        onDateChange={onDateChange} />
                </div>
            )}
        </section>
    );
}
