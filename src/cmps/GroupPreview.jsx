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
import Popover from '@mui/material/Popover';
import { GarbageRemove } from "./dynamicCmps/modals/GarbageRemove.jsx";
import { useState } from "react";
import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { ArrowRightIcon } from "@mui/x-date-pickers/icons";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useSelector } from "react-redux";
import { removeTask } from "../store/actions/boards.actions.js";


export const GroupPreview = ({
  labels,
  group,
  loggedinUser,
  cmpOrder,
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

  const id = open ? 'simple-popover' : undefined;
  const id2 = open2 ? 'simple-popover' : undefined;



  const style = {
    borderRight: '1px solid #e0dede',
    borderTop: '1px solid #e0dede',


  };
  const titleHead = { color: group.color };

  return (
    <>

      <div className="group-title-flex stick">
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
          <GarbageRemove someName={'Group'} someFunction={() => handleDelete(group.id, boardId)} />
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

      <section className="group-list">
        {/* Render group labels by labels array */}

        {expanded && (
          <div>
            <section
              className="labels-grid"
              style={{ ...style, borderTopLeftRadius: 5 }}
            >
              <section className="ghost "></section>

              {cmpOrder.map((cmp, index) => (
                labels[index] === 'item' ?
                  <div style={{ borderLeft: `5px solid ${group?.color}`, borderTopLeftRadius: 5 }} key={`label-${index}`} className="label-title stick">
                    <section className="main-checkbox">
                      <input
                        type="checkbox"
                        className="checkbox"
                        onChange={() => { }}
                        onClick={() => handleMasterCheckboxClick(group)}
                        checked={checkedGroups.includes(group.id)}

                      />
                    </section>
                    < section className="title-group" key={`label-${index}`}>{labels[index] || ""}</section>



                  </div >
                  :
                  < div style={{ textAlign: `${labels[index] === '+' ? 'start' : 'center'}` }} key={`label-${index}`}>{labels[index] || ""}</div>
              ))}
            </section>

            {/* Render tasks by cmp order */}

            {group.tasks.map((task) => (

              <section
                className="group grid"
                key={`task-${task.id}`}
              >


                <div className="dots">
                  <span onClick={handleClick}  > <MoreHorizIcon /> </span>

                  <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                  >
                    <GarbageRemove someName={'Task'} someFunction={() => removeTask(boardId, group.id, task.id)} />
                  </Popover>
                </div>


                {cmpOrder.map((cmp, idx) => (
                  <section
                    style={cmp === 'taskTitle' ? { borderLeft: `5px solid ${group?.color}` } : {}}
                    className={`grid-item ${cmp} ${cmp === 'taskTitle' ? 'stick' : ''}`}
                    key={`task-${task.id}-cmp-${idx}`}
                  >
                    <DynamicCmp
                      group={group}
                      task={task}
                      loggedinUser={loggedinUser}
                      cmpType={cmp}
                      info={task[cmp]}
                      onTaskUpdate={onTaskUpdate}
                      chat={task.chat} // temporary for demo data
                      users={users}
                      chatTempInfoUpdate={chatTempInfoUpdate}
                      openChat={openChat}
                      checkedBoxes={checkedBoxes}
                      handleCheckBoxClick={handleCheckBoxClick}
                    />
                  </section>
                ))}
              </section>
            ))}
            <AddTask group={group} handleAddTask={handleAddTask} />

            {/* Render progress by progress array */}
            <section
              className="progress-grid"
            >

              <div className="invisible stick"></div>

              {progress.map((prog, index) =>
                cmpOrder.includes(prog) ? (
                  <div className={`prog-box with-${prog}`} key={`progress-${index}`}>
                    <ProgressCmd
                      progressType={progress[index]}
                      tasks={group.tasks}

                    />
                  </div>
                ) : (
                  <div className={prog} key={`progress-${index} `}></div>
                )
              )}
            </section>
          </div >
        )}
      </section >
    </>
  );
};

const DynamicCmp = ({
  cmpType,
  info,
  onTaskUpdate,
  task,
  group,
  chat,
  loggedinUser,
  users,
  chatTempInfoUpdate,
  openChat,
  checkedBoxes,
  handleCheckBoxClick
}) => {
  // console.log("Rendering component:", cmpType, "with info:", info);

  switch (cmpType) {
    case "priority":
      return (
        <Priority
          cellId={task.id + 'priority'}
          group={group}
          task={task}
          priority={info}
          onTaskUpdate={onTaskUpdate}

        />
      )

    case "taskTitle":
      return (
        <TaskTitle
          cellId={task.id + 'title'}
          group={group}
          task={task}
          loggedinUser={loggedinUser}
          users={users}
          chat={chat}
          text={info}
          onTaskUpdate={onTaskUpdate}
          chatTempInfoUpdate={chatTempInfoUpdate}
          openChat={openChat}
          checkedBoxes={checkedBoxes}
          handleCheckBoxClick={handleCheckBoxClick}
        />
      )

    case "status":
      return (
        <Status
          cellId={task.id + 'status'}
          group={group}
          task={task}
          taskId={task.id}
          status={info}
          onTaskUpdate={onTaskUpdate}
        />
      )

    case "members":
      return (
        <Members
          cellId={task.id + 'members'}
          group={group}
          task={task}
          taskId={task.id}
          members={info}
          onTaskUpdate={onTaskUpdate}
          users={users}
        />
      )

    case "date":
      return (
        <Date
          cellId={task.id + 'date'}
          group={group}
          task={task}
          date={info}
          onTaskUpdate={onTaskUpdate}
        />
      )
    case "+":
      return (
        <div >

        </div>
      )

    default:
      console.error(`Unknown component type: ${cmpType}`)
      return <div>Unknown component: {cmpType}</div>
  }
}

const ProgressCmd = ({
  progressType,
  tasks,

}) => {

  switch (progressType) {
    case "priority":
      return (
        <P_Priority
          tasks={tasks}
        />
      )

    case "status":
      return (
        <P_Status
          tasks={tasks}
        />
      )

    case "date":
      return (
        <P_Date
          tasks={tasks}
        />
      )

    case "members":
      return (
        <P_Members
          tasks={tasks}
        />
      )

    default:
      console.error(`Unknown progress component type: ${progressType}`)
      return <div>Unknown component: {progressType}</div>
  }
}


