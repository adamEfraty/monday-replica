import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { ArrowRightIcon } from "@mui/x-date-pickers/icons";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { getSvg } from "../services/svg.service";
import { useState, useRef, useEffect } from "react"
import { openModal, closeModal } from '../store/actions/boards.actions.js'
import { useSelector } from "react-redux";
import { GroupTitleColorModal } from "./dynamicCmps/modals/GroupTitleColorModal.jsx";
import { updateGroup } from '../store/actions/boards.actions.js';




import Popover from '@mui/material/Popover';
import { GarbageRemove } from "./dynamicCmps/modals/GarbageRemove.jsx";
import { Color } from "./dynamicCmps/modals/Color.jsx";

export function GroupTitle({ 
  titleRef,
  boardId,
  group,
  groupTitle,
  expanded,
  handleClick2, //
  id2, //
  open2, // 
  anchorE2, // 
  handleClose2, //
  handleGroupNameChange,
  handelExpandedChange,
  handelGroupTitleChange,
  attributes,
  listeners,
  handleDelete,
  isMiniGroup,
  isFixed,

}) 


{

  const [isHovered, setIsHovered] = useState(false)
  const [onEditMode, setOnEditMode] = useState(false)
  const inputRef = useRef(null)

  const openModals = useSelector(state => state.boardModule.openModals)
  const colorModalId = `${group.id}-color-modal${isFixed && '-fixed'}`
  const colorModal = openModals.some(modalId => modalId === colorModalId)
  const squreColorRef = useRef(null)
  const colorModalRef = useRef(null)

  useEffect(() => {
    if (onEditMode) document.addEventListener
        ('mousedown', handleClickOutsideInput)
    else document.removeEventListener
        ('mousedown', handleClickOutsideInput)
    return () => document.removeEventListener
        ('mousedown', handleClickOutsideInput)

  }, [onEditMode])


  function handleClickOutsideInput(event) {
    if (!inputRef.current.contains(event.target) && 
      !squreColorRef.current.contains(event.target) &&
      !colorModalRef.current.contains(event.target))
      handelCloseInput()
  }


  function handelCloseInput(){
    handleGroupNameChange(groupTitle, group)
    setOnEditMode(false)
    closeModal(colorModalId)
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") handelCloseInput()
  }


  function colorModalToggle() {
    colorModal
    ? closeModal(colorModalId)
    : openModal(colorModalId)
  }

  async function onUpdateGroup(newColor){
    await updateGroup(boardId, group.id, { color: newColor })
    handelCloseInput()
  }

  return (
    <div className="group-title" 
    ref={titleRef}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}>
      
        <button 
        className="modal-button" 
        onClick={handleClick2}
        style={{visibility: isHovered ? 'visible' : 'hidden'}}>
          {getSvg('horizontal-dots')}
        </button>
{/* 
        <Popover
          id={id2}
          open={open2}
          anchorEl={anchorE2}
          onClose={handleClose2}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <div className="flex-for-modal">
            <Color 
              closeAll={handleClose2} 
              color={group.color} 
              boardId={boardId} 
              groupId={group.id} />

            <GarbageRemove 
            someName={'Group'} 
            someFunction={() => handleDelete(group.id, boardId)} />
          </div>
        </Popover> */}



        <span className="group-title-arrow" 
        onClick={() => handelExpandedChange((prev) => !prev)}
        style={{transform: (!isMiniGroup && expanded) ?  'rotate(90deg)' : 'rotate(0deg)',
          color: group.color
        }}>
          {getSvg('group-title-arrow')}
        </span>

        {
          onEditMode ?
          <input
          ref={inputRef}
          className="group-title-input"
            autoFocus={true}            
            style={{color: group.color}}
            type="text"
            value={groupTitle}
            onChange={(e) => handelGroupTitleChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          : <p 
          className="group-title-p" 
          onClick={()=>setOnEditMode(true)}
          style={{color: group.color}}>
            {groupTitle}
          </p>
        }

      <p className="tasks-amount"
      style={{
        opacity: (!onEditMode && isHovered) ? 1 : 0,
        transition: "opacity 0.1s ease-in-out"}}>
        {`${group.tasks.length} Tasks`}
      </p>

      {
        onEditMode &&
        <div 
        ref={squreColorRef}
        className="squre-color"
        style={{backgroundColor: group.color}}
        onClick={colorModalToggle}/>
      }


      <GroupTitleColorModal 
        colorModal={colorModal}
        colorModalRef={colorModalRef}
        groupColor={group.color}
        onUpdateGroup={onUpdateGroup}/>


      

        

      {/* <div  {...listeners} {...attributes} style={{ cursor: "grab", width: '100%', padding: '1rem' }}>
      </div> */}
    </div>
  )
}
// (!isMiniGroup && expanded)