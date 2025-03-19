import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { ArrowRightIcon } from "@mui/x-date-pickers/icons";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { getSvg } from "../services/svg.service";
import { useState, useRef, useEffect } from "react"
import { openModal, closeModal } from '../store/actions/boards.actions.js'
import { useSelector } from "react-redux";
import { GroupTitleColorModal } from "./dynamicCmps/modals/GroupTitleColorModal.jsx";
import { updateGroup } from '../store/actions/boards.actions.js';
import { EditGroupTitleModal } from "./dynamicCmps/modals/EditGroupTitleModal.jsx";




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
  dragHandleProps,

}) {

  const [isHovered, setIsHovered] = useState(false)
  const [onEditMode, setOnEditMode] = useState(false)
  const inputRef = useRef(null)

  const openModals = useSelector(state => state.boardModule.openModals)

  const colorModalId = `${group.id}-color-modal${isFixed && '-fixed'}`
  const colorModal = openModals.some(modalId => modalId === colorModalId)
  const squreColorRef = useRef(null)
  const colorModalRef = useRef(null)

  const editModalId = `${group.id}-edit-modal${isFixed && '-fixed'}`
  const editModal = openModals.some(modalId => modalId === editModalId)
  const editModalButtonRef = useRef(null)
  const editModalRef = useRef(null)


  // color modal eventListener
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

  function handelCloseInput() {
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

  async function onUpdateGroup(newColor) {
    await updateGroup(boardId, group.id, { color: newColor })
    handelCloseInput()
  }

  // edit modal eventListener
  useEffect(() => {
    if (editModal) document.addEventListener
      ('mousedown', handleClickOutsideEditModal)
    else document.removeEventListener
      ('mousedown', handleClickOutsideEditModal)
    return () => document.removeEventListener
      ('mousedown', handleClickOutsideEditModal)

  }, [editModal])


  function handleClickOutsideEditModal(event) {
    if (!editModalRef.current.contains(event.target) &&
      !editModalButtonRef.current.contains(event.target))
      closeModal(editModalId)
  }

  function editModalToggle() {
    editModal
      ? closeModal(editModalId)
      : openModal(editModalId)
  }

  function onDelete() {
    handleDelete(group.id, boardId)
    closeModal(editModalId)
  }

  function onOpenColorModal() {
    setOnEditMode(true)
    openModal(colorModalId)
    closeModal(editModalId)
  }

  function onRenameGroup() {
    setOnEditMode(true)
    closeModal(editModalId)
  }

  return (
    <div className="group-title"
      ref={titleRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>

      <button
        ref={editModalButtonRef}
        className="modal-button"
        onClick={editModalToggle}
        style={{ visibility: (isHovered || editModal) ? 'visible' : 'hidden' ,
          backgroundColor: editModal ? '#C6DFF8' : ''
        }}>
        {getSvg('horizontal-dots')}
      </button>


      <span className="group-title-arrow"
        onClick={() => handelExpandedChange((prev) => !prev)}
        style={{
          transform: (!isMiniGroup && expanded) ? 'rotate(90deg)' : 'rotate(0deg)',
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
            style={{ color: group.color }}
            type="text"
            value={groupTitle}
            onChange={(e) => handelGroupTitleChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          : <p
            className="group-title-p"
            onClick={() => setOnEditMode(true)}
            style={{ color: group.color }}>
            {groupTitle}
          </p>
      }

      <p className="tasks-amount"
        style={{
          opacity: (!onEditMode && isHovered) ? 1 : 0,
          transition: "opacity 0.1s ease-in-out"
        }}>
        {`${group.tasks.length} Tasks`}
      </p>

      {
        onEditMode &&
        <div
          ref={squreColorRef}
          className="squre-color"
          style={{ backgroundColor: group.color }}
          onClick={colorModalToggle} />
      }


      <GroupTitleColorModal
        colorModal={colorModal}
        colorModalRef={colorModalRef}
        groupColor={group.color}
        onUpdateGroup={onUpdateGroup} />

      <EditGroupTitleModal
        editModal={editModal}
        editModalRef={editModalRef}
        onDelete={onDelete}
        onOpenColorModal={onOpenColorModal}
        onRenameGroup={onRenameGroup}
      />

      {!onEditMode && <div {...dragHandleProps} style={{ width: '60%', padding: '.5rem' }}></div>}


    </div>
  )
}
