import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { openModal, closeModal } from '../store/actions/boards.actions.js'
import { useSelector } from "react-redux";
import { useState, useRef, useEffect, useCallback } from "react";
import { deleteLable, onChangeLabelName, onUpdateReduxLabelWidth, onUpdateLocalLabelWidth } from "../store/actions/boards.actions.js";
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

    const [isDragging, setIsDragging] = useState(false)
    const labelRef = useRef(null)
    // so no every width change there will be call to storage
    const board = useSelector((state) => 
        state.boardModule.boards.find(board=>board.id === boardId));


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

    // Ensure `handleMouseMove` is stable
    const handleMouseMove = useCallback((event) => {
        if (!isDragging || !labelRef.current) return
        const labelBoundaries = labelRef.current.getBoundingClientRect()
        const newWidth = event.clientX - labelBoundaries.x
        const MIN_WIDTH = 100
        onUpdateReduxLabelWidth(board, boardId, label.id, Math.max(newWidth, MIN_WIDTH))
    }, [isDragging, board, boardId, label.id])

    // Ensure `handleMouseUp` is stable
    const handleMouseUp = useCallback(() => {
        if (!isDragging) return;
        setIsDragging(false)
        onUpdateLocalLabelWidth(boardId, label.id, label.width)
    }, [isDragging, boardId, label.id, label.width])

    useEffect(() => {
        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove)
            document.addEventListener("mouseup", handleMouseUp)
        } else {
            document.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mouseup", handleMouseUp)
        }
        return () => {
            document.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mouseup", handleMouseUp)
        };
    }, [isDragging, handleMouseMove, handleMouseUp])

    // Handle mouse down correctly
    const handleMouseDown = () => {
        setIsDragging(true)
    }

    return (
        <div ref={el => { // Assign both refs
            setNodeRef(el);  
            labelRef.current = el;
        }}
        {...listeners} 
        {...attributes}  
        style={{transform: CSS.Transform.toString(transform), transition}}
        // key={labelId} is it neccery?
        className="label"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}>
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

            <div className="drag-label"
            onPointerDown={e => e.stopPropagation()}
            onMouseDown={handleMouseDown}>
                

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