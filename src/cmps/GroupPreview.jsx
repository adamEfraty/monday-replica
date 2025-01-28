import { Date } from "./dynamicCmps/Date";
import { Members } from "./dynamicCmps/Members";
import { Status } from "./dynamicCmps/Status";
import { TaskTitle } from "./dynamicCmps/TaskTitle";
import { Priority } from "./dynamicCmps/Priority";
import { AddTask } from "./AddTask.jsx";
import { P_Priority } from "./dynamicCmps/progressCmps/P_Priority.jsx";
import { P_Status } from "./dynamicCmps/progressCmps/P_Status.jsx";
import { P_Date } from "./dynamicCmps/progressCmps/P_Date.jsx";
import { P_Members } from "./dynamicCmps/progressCmps/P_Members.jsx";
import { AddLabel } from "./AddLabel.jsx";
import Popover from '@mui/material/Popover';
import { GarbageRemove } from "./dynamicCmps/modals/GarbageRemove.jsx";
import { useState } from "react";
import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { ArrowRightIcon } from "@mui/x-date-pickers/icons";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useSelector } from "react-redux";
import { removeTask } from "../store/actions/boards.actions.js";
import { horizontalListSortingStrategy, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskPreview } from "./TaskPreview.jsx";
import { Label } from "./Label.jsx";
import { Color } from "./dynamicCmps/modals/Color.jsx";

export const GroupPreview = ({
  labels,
  group,
  loggedinUser,
  progress,
  onTaskUpdate,
  checkedBoxes,
  checkedGroups,
  handleCheckBoxClick,
  handleMasterCheckboxClick,
  handleAddTask,
  handleGroupNameChange,
  handleDelete,
  boardId,
  users,
  chatTempInfoUpdate,
  openChat,
  id,

}) => {
  const [expanded, setExpanded] = useState(true);
  const [groupTitle, setGroupTitle] = useState(group.title);
  const filterBy = useSelector((state) => state.boardModule.filterBy);


  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorE2, setAnchorE2] = useState(null);



  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClick2 = (event) => {
    setAnchorE2(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClose2 = () => {
    setAnchorE2(null);
  };


  const open = Boolean(anchorEl);
  const open2 = Boolean(anchorE2);

  const id1 = open ? 'simple-popover' : undefined;
  const id2 = open2 ? 'simple-popover' : undefined;




  const titleHead = { color: group.color };

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,

  };




  return (
    <div style={style} ref={setNodeRef} className="group-list-dnd" >


      <div className="group-title-flex">

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



          <span className="arrow" onClick={() => setExpanded((prev) => !prev)}>
            {expanded ? <ArrowDownIcon /> : <ArrowRightIcon />}
          </span>
          <input
            onBlur={() => handleGroupNameChange(groupTitle, group)}
            style={titleHead}
            className="task-input hov"
            type="text"
            value={groupTitle}
            onChange={(e) => setGroupTitle(e.target.value)}
          />



        </div>
        <div {...listeners} {...attributes} style={{ cursor: "grab", width: '100%', padding: '1rem' }}>

        </div>
      </div>

      <section className="group-list">
        {/* Render group labels by labels array */}

        {expanded && (
          <div>
            <section
              className="labels-grid"
              style={{
                borderTopLeftRadius: 5,
                gridTemplateColumns: `10px 400px repeat(${labels.length}, 150px) 500px`
              }}
            >
              <section className="ghost "></section>

              <SortableContext items={labels.map(label => label.id)} strategy={horizontalListSortingStrategy}>
                {labels.map(label => (
                  label.type === 'taskTitle' ?
                    <div style={{ borderLeft: `5px solid ${group?.color}`, borderTopLeftRadius: 5 }} key={`label-${label.id}`} className="label-title">
                      <section className="main-checkbox">
                        <input
                          type="checkbox"
                          className="checkbox"
                          onChange={() => { }}
                          onClick={() => handleMasterCheckboxClick(group)}
                          checked={checkedGroups.includes(group.id)}

                        />
                      </section>
                      < section className="title-group" key={`label-${label.id}`}>{label.name}</section>
                    </div >
                    :
                    <Label key={label.id} id={label.id} label={label} />
                ))}
              </SortableContext >

              <AddLabel groupId={group.id} boardId={boardId}/>
            </section>

            {/* Render tasks by cmp order */}

            <SortableContext items={group.tasks.map(task => task.id)} strategy={verticalListSortingStrategy}> {/* for dnd Radwan */}
              {group.tasks.map((task) => (

                <TaskPreview
                  id={task.id}
                  key={task.id}
                  task={task}
                  group={group}
                  labels={labels}
                  loggedinUser={loggedinUser}
                  onTaskUpdate={onTaskUpdate}
                  removeTask={removeTask}
                  boardId={boardId}
                  users={users}
                  chatTempInfoUpdate={chatTempInfoUpdate}
                  openChat={openChat}
                  checkedBoxes={checkedBoxes}
                  handleCheckBoxClick={handleCheckBoxClick}
                />
              ))}
            </SortableContext>
            <AddTask group={group} handleAddTask={handleAddTask} />

            {/* Render progress by progress array */}
            <section
              className="progress-grid"
              style={{

                gridTemplateColumns: `10px 400px repeat(${labels.length}, 150px) 500px`
              }}
            >

              <div className="invisible"></div>

              {labels.map((lable, index) =>
                progress.includes(lable.type) ? (
                  <div className={`prog-box with-${lable.type}`} key={`progress-${lable.id}`}>
                    <ProgressCmd
                      label={lable}
                      tasks={group.tasks}

                    />
                  </div>
                ) : (
                  <div className={lable.type} key={`progress-${index} `}></div>
                )
              )}
            </section>
          </div >
        )}
      </section >
    </div >
  );
};



const ProgressCmd = ({
  label,
  tasks,

}) => {

  switch (label.type) {
    case "priority":
      return (
        <P_Priority
          tasks={tasks}
          labelId={label.id}
        />
      )

    case "status":
      return (
        <P_Status
          tasks={tasks}
          labelId={label.id}
        />
      )

    case "date":
      return (
        <P_Date
          tasks={tasks}
          labelId={label.id}
        />
      )

    case "members":
      return (
        <P_Members
          tasks={tasks}
          labelId={label.id}
        />
      )

    default:
      console.error(`Unknown progress component type: ${progressType}`)
      return <div>Unknown component: {progressType}</div>
  }
}


