import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { ArrowRightIcon } from "@mui/x-date-pickers/icons";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { getSvg } from "../services/svg.service";
import { useState, useRef, useEffect } from "react"



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

}) 


{

  const [isHovered, setIsHovered] = useState(false);
  const [onEditMode, setOnEditMode] = useState(false);

  function handelCloseInput(){
    handleGroupNameChange(groupTitle, group)
    setOnEditMode(false)
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") handelCloseInput()
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
        </Popover>



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
          className="group-title-input"
            autoFocus={true}
            onBlur={handelCloseInput}
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
        <div className="squre-color"
        style={{backgroundColor: group.color}}/>
      }


      

        

      {/* <div  {...listeners} {...attributes} style={{ cursor: "grab", width: '100%', padding: '1rem' }}>
      </div> */}
    </div>
  )
}
// (!isMiniGroup && expanded)