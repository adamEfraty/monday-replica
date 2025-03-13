import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { openModal, closeModal } from '../store/actions/boards.actions.js'
import { useSelector } from "react-redux";
import { useState, useRef, useEffect, useCallback } from "react";
import { deleteLable, onChangeLabelName, onUpdateReduxLabelWidth, onUpdateLocalLabelWidth } from "../store/actions/boards.actions.js";
import { getSvg } from "../services/svg.service.jsx";
import { DeleteLabelConfirmation } from "./dynamicCmps/modals/DeleteLabelConfirmation.jsx"
import { utilService } from "../services/util.service.js";
import ReactDOM from 'react-dom'


export function Label({ label, id, boardId, groupId, isFixed}) {

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

    const modalId = `${label.id}${groupId}${isFixed?'fix':''}`
    const openModals = useSelector(state => state.boardModule.openModals)
    const modal = openModals.some(modId => modId === modalId)
    const modalRef = useRef(null)
    const buttonRef = useRef(null)

    const [onEditMode, setOnEditMode] = useState(false)
    const [textToEdit, setTextToEdit] = useState(label.name)

    const [isDragging, setIsDragging] = useState(false)
    const labelRef = useRef(null)
    // so no every width change there will be call to storage
    const board = useSelector((state) => 
        state.boardModule.boards.find(board=>board._id === boardId));

    const [hoverLable, setHoverLabel] = useState(false)

    const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false)
    const confirmationRef = useRef(null)
    const [animationActive, setAnimationActive] = useState(false)


    // controls hoverlabel state
    useEffect(() => {
        const handleHoverLabel = (event) => {
            if (labelRef.current) 
                labelRef.current.contains(event.target) 
                ? setHoverLabel(true)
                : setHoverLabel(false)
        }

        document.addEventListener("mouseover", handleHoverLabel);
        return () => document.removeEventListener("mouseout", handleHoverLabel)
    }, [])


    // close and open modal as needed
    function modalToggle() {
        modal
        ? closeModal(modalId)
        : openModal(modalId)
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
        toggleConfirnationModal()
        setTimeout(()=>deleteLable(boardId, label.id), 50)
    }

    function toggleEditMode() {
        if (onEditMode) {
            if (textToEdit === '') {
                setTextToEdit(label.name)
            }
            else 
                onChangeLabelName(boardId, label.id, textToEdit) 
        }
        setOnEditMode(prev => !prev)
    }

    // if user press enter go to spectate mode.
    // have to manualy using space button, 
    // otherwise dnd gets activate when clicking it.
    function handleKeyDown(event) {
        if (event.key === "Enter") 
            toggleEditMode()
        else if (event.key === " ") { 
            event.preventDefault() // Prevent default spacebar scrolling behavior
            
            // creating space at the focus place
            const { selectionStart, selectionEnd } = event.target
            const newText = textToEdit.slice(0, selectionStart) + " " + 
                textToEdit.slice(selectionEnd)
            setTextToEdit(newText)
    
            // Move cursor forward after space is inserted
            requestAnimationFrame(() => {
                event.target.setSelectionRange(selectionStart + 1, selectionStart + 1)
            })
        }
    }
    

    function onRenameLable(){
        setOnEditMode(true)
        modalToggle()
    }

    function handleLongText(text) { 
        const maxLetters = Math.max(Math.floor(label.width / 9) -
            (hoverLable || isDragging  ? 5 : 0), 0) 
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
        const newWidth = event.clientX - labelBoundaries.x -5
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

    function toggleConfirnationModal(){

        const animationDuration = 0.2
        closeModal(modalId)

        if(deleteConfirmationModal){
            confirmationAnimation(false, animationDuration)
            setTimeout(()=>setDeleteConfirmationModal(prev=>!prev), animationDuration * 500)

        } 
        else{
            setAnimationActive(true)
            setDeleteConfirmationModal(prev=>!prev)
            setTimeout(()=>{
                confirmationAnimation(true, animationDuration)
                setAnimationActive(false)
            }, 10)
            
        }
    }

    function confirmationAnimation(isEnter, duration) {
        if (!confirmationRef.current) return
        const animation = isEnter ? 'fadeInDown' : 'fadeOutUp'
        utilService.animateCSS(confirmationRef.current, animation, duration)
      }

    return (
        <div ref={el => { // Assign both refs
            setNodeRef(el);  
            labelRef.current = el;
        }}
        {...listeners} 
        {...attributes}  
        style={{transform: CSS.Transform.toString(transform), transition, 
            backgroundColor: hoverLable || modal || isDragging || onEditMode ? '#F5F6F8' : 'white'}}
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
                    style={{
                        opacity: hoverLable || modal || isDragging ? "1" : "0",
                        backgroundColor: modal && "#CBE4FE"
                    }}>
                    </i>

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
            onMouseDown={handleMouseDown}
            style={{
                opacity: hoverLable || modal || isDragging ? "1" : "0",
                backgroundColor: isDragging && '#0073EA'
                }}>
                

            </div>


            {
                modal &&
                <section 
                className="label-modal" 
                ref={modalRef}
                onPointerDown={e => e.stopPropagation()}>
                    
                    <button onClick={toggleConfirnationModal}>
                        {getSvg('trash2')}
                        Delete
                    </button>
                    <button onClick={onRenameLable}>
                        {getSvg('pencil')}
                        Rename
                    </button>

                </section>
            }

            {
                deleteConfirmationModal &&
                ReactDOM.createPortal(
                    <DeleteLabelConfirmation
                    onDeleteLable={onDeleteLable}
                    toggleConfirnationModal={toggleConfirnationModal}
                    confirmationRef={confirmationRef}
                    animationActive={animationActive}
                    labelName={label.name}/>

                    ,document.body // Appends the modal properly
                )
            }
        </div>
    )
}