import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { ArrowRightIcon } from "@mui/x-date-pickers/icons";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Popover from '@mui/material/Popover';
import { GarbageRemove } from "./dynamicCmps/modals/GarbageRemove.jsx";
import { Color } from "./dynamicCmps/modals/Color.jsx";

export function GroupTitle({ titleRef,
  boardId,
  group,
  groupTitle,
  expanded,
  handleClick2,
  id2,
  open2,
  anchorE2,
  handleClose2,
  titleHead,
  handleGroupNameChange,
  handelExpandedChange,
  handelGroupTitleChange,
  attributes,
  listeners,
  handleDelete,
  isMiniGroup,

}) {

  return (
    <div className="group-title" ref={titleRef}>

      <div className="change-location">
        <span className="remove" onClick={handleClick2}><MoreHorizIcon />
        </span>

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
            <Color closeAll={handleClose2} color={group.color} boardId={boardId} groupId={group.id} />
            <GarbageRemove someName={'Group'} someFunction={() => handleDelete(group.id, boardId)} />
          </div>
        </Popover>



        <span className="arrow" onClick={() => handelExpandedChange((prev) => !prev)}>
          {!isMiniGroup && expanded ? <ArrowDownIcon /> : <ArrowRightIcon />}
        </span>
        <input
          onBlur={() => handleGroupNameChange(groupTitle, group)}
          style={titleHead}
          className="task-input hov"
          type="text"
          value={groupTitle}
          onChange={(e) => handelGroupTitleChange(e.target.value)}
        />



      </div>
      <div  {...listeners} {...attributes} style={{ cursor: "grab", width: '100%', padding: '1rem' }}>
      </div>
    </div>
  )
}