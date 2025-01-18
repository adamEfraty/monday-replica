import { Date } from "./dynamicCmps/Date";
import { Members } from "./dynamicCmps/Members";
import { Status } from "./dynamicCmps/Status";
import { TaskTitle } from "./dynamicCmps/TaskTitle";
import { Priority } from "./dynamicCmps/Priority";
import { AddTask } from "./AddTask.jsx";
import { useState } from "react";
import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { ArrowRightIcon } from "@mui/x-date-pickers/icons";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';


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
  users
}) => {
  const [expanded, setExpanded] = useState(true);
  const [groupTitle, setGroupTitle] = useState(group.title);

  const style = {
    borderRight: '1px solid #e0dede',
    borderLeft: `0.3rem solid ${group.color}`,
    borderTop: '1px solid #e0dede',


  };
  const titleHead = { color: group.color };

  return (
    <>

      <div className="group-title-flex">
        <button className="remove" onClick={() => handleDelete(group.id, boardId)}><MoreHorizIcon /></button>

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
              <input
                type="checkbox"
                className="checkbox"
                onChange={() => { }}
                onClick={() => handleMasterCheckboxClick(group)}
                checked={checkedGroups.includes(group.id)}

              />
              {cmpOrder.map((cmp, index) => (
                <div style={{ textAlign: `${labels[index] === '+' ? 'start' : 'center'}` }} key={`label-${index}`}>{labels[index] || ""}</div>
              ))}
            </section>

            {/* Render tasks by cmp order */}

            {group.tasks.map((task) => (

              <section
                className="group grid"
                key={`task-${task.id}`}
                style={style}
              >

                <input
                  type="checkbox"
                  checked={checkedBoxes.some((subArr) => subArr[1] == task.id)}
                  onChange={() => handleCheckBoxClick(group.id, task.id)}
                />
                {cmpOrder.map((cmp, idx) => (
                  <section
                    className={`grid-item ${cmp}`}
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
              {progress.map((prog, index) =>
                cmpOrder.includes(prog) ? (
                  <div className={`prog-box with-${prog}`} key={`progress-${index}`}>
                    {progress[index]}
                  </div>
                ) : (
                  <div className={prog} key={`progress-${index} `}></div>
                )
              )}
            </section>
          </div>
        )}
      </section>
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
      );

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
        />
      );

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
      );

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
      );

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
      console.error(`Unknown component type: ${cmpType}`);
      return <div>Unknown component: {cmpType}</div>;
  }
};


