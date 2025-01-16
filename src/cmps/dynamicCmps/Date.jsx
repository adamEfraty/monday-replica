import { useState, useEffect, useRef } from 'react';
import { DateModal } from './modals/DateModal.jsx';

export function Date({ group, task, date, onTaskUpdate }) {

    const [modal, setModal] = useState(false);
    const modalRef = useRef(null);
    const dateCellRef = useRef(null);

    function modalToggle() {
        setModal(prev => !prev);
    }

    function onDateChange(date) {
        onTaskUpdate({ group, task, type: 'date', value: date });
    }

    function handleClickOutsideModal(event) {
        if (
            modalRef.current &&
            !modalRef.current.contains(event.target) &&
            !dateCellRef.current.contains(event.target)
        ) {
            modalToggle();
        }
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
