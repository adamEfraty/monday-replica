import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { openModal, closeModal } from '../store/actions/boards.actions.js'
import { useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { deleteLable, onChangeLabelName } from "../store/actions/boards.actions.js";
import { showErrorMsg } from '../services/event-bus.service.js'
import { getSvg } from "../services/svg.service.jsx";





export function Label({ label, id, boardId, groupId }) {

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

    const openModals = useSelector(state => state.boardModule.openModals)
    const modal = openModals.some(modalId => modalId === (label.id+groupId))
    const modalRef = useRef(null)
    const buttonRef = useRef(null)

    const [onEditMode, setOnEditMode] = useState(false)
    const [textToEdit, setTextToEdit] = useState(label.name)

    // close and open modal as needed
    function modalToggle() {
        modal
        ? closeModal(label.id+groupId)
        : openModal(label.id+groupId)
    }

    //if user click outside modal, close it
    function handleClickOutsideModal(event) {
        if (!modalRef.current.contains(event.target)
            && !buttonRef.current.contains(event.target))
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

    function onDeleteLable(){
        deleteLable(boardId, label.id)
        modalToggle()
    }

    function toggleEditMode() {
        if (onEditMode) {
            if (textToEdit === '') {
                setTextToEdit(label.name)
                showErrorMsg("Name can't be empty")
            }
            else 
                onChangeLabelName(boardId, label.id, textToEdit) 
        }
        setOnEditMode(prev => !prev)
    }

    // if user press enter go to spectate mode
    function handleKeyDown(event) {
        if (event.key === "Enter")
          toggleEditMode()
    }

    function onRenameLable(){
        setOnEditMode(true)
        modalToggle()
    }

    function handleLongText(text, maxLetters = 8) { // going to be spence of column width
        if (text.length < maxLetters) return text
        else {
          const shortenText = `${text.slice(0, maxLetters)}...`
          return shortenText
        }
      }



    return (
        <div ref={setNodeRef} {...listeners} {...attributes}  
        style={{transform: CSS.Transform.toString(transform), transition}}
        // key={labelId} is it neccery?
        className="label">
            {
              !onEditMode
                ? 
                <section>
                    <i ref={buttonRef} 
                    className="fa-solid fa-ellipsis"
                    onClick={modalToggle}
                    onPointerDown={e => e.stopPropagation()} // Stops DnD from activating on mouse down
                    > </i>

                    <p onClick={toggleEditMode}
                    onPointerDown={e => e.stopPropagation()}
                    >{handleLongText(label.name)}</p>
                </section>
                

                : <input
                  autoFocus={true}
                  value={textToEdit}
                  onChange={event => setTextToEdit(event.target.value)}
                  onBlur={toggleEditMode}
                  onKeyDown={handleKeyDown}
                  type="text"
                  onPointerDown={e => e.stopPropagation()}
                />
            }

            <div className="drag-label">
                

            </div>


            {
                modal
                ? <section 
                className="label-modal" 
                ref={modalRef}
                onPointerDown={e => e.stopPropagation()}>
                    
                    <button onClick={onDeleteLable}>
                        {getSvg('trash2')}
                        Delete
                    </button>
                    <button onClick={onRenameLable}>
                        {getSvg('pencil')}
                        Rename
                    </button>

                </section>
                : null
            }
        </div>
    )
}