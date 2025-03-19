import { useEffect, useRef, useState } from 'react';
import { DateModal } from './modals/DateModal.jsx';
import { openModal, closeModal } from '../../store/actions/boards.actions.js'
import { useSelector } from "react-redux";
import { utilService } from '../../services/util.service.js';
import { getSvg } from '../../services/svg.service.jsx';

export function DateCell({ cellInfo, onTaskUpdate, labelWidth, isHover, setIsSelect, isSelect }) {
    const openModals = useSelector(state => state.boardModule.openModals)
    const modal = openModals.some(modalId => modalId === (cellInfo.taskId + cellInfo.labelId))

    const modalRef = useRef(null);
    const dateCellRef = useRef(null);

    const today = utilService.formatDateToStr(new Date());

    const [isHovered, setIsHovered] = useState(false);

    
    useEffect(()=>{
        setIsSelect(modal)
    }, [modal])

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
        <section className="date" 
        style={{backgroundColor: isSelect ? '#CCE5FF' : (isHover ? '#F4F5F8' : 'white')}}>
            {/* Date cell */}
            <div
            className="date-cell"
            ref={dateCellRef}
            onClick={modalToggle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{outline: modal? 'solid 1px #0073EA' : 'none',
            outlineOffset: modal ? '-1px' : '',
            }}

            >

                { isHovered && <div className='frame'/>}
                {
                    cellInfo.value ?
                    <p>{utilService.formatDateStrToPerfectStr(cellInfo.value)}</p>
                    :
                    isHovered && <div className='icons'>
                        {getSvg('plus-circle-icon')}
                        {getSvg('calendar-icon')}
                    </div>

                }
                {
                    isHovered && cellInfo.value  &&
                    <button className='remove-button'
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={()=>onTaskUpdate({...cellInfo, value: null})}>
                            <i className="fa-solid fa-x"></i>
                    </button>
                }
            </div>


            {/* Date modal */}
            {modal && (
                <div ref={modalRef}>
                    <DateModal
                        currentDate={cellInfo.value ? cellInfo.value : today}
                        onDateChange={onDateChange} 
                        labelWidth={labelWidth}/>
                </div>
            )}
        </section>
    );
}
