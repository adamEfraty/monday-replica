import { Date } from "./dynamicCmps/Date";
import { Members } from "./dynamicCmps/Members";
import { Status } from "./dynamicCmps/Status";
import { TaskTitle } from "./dynamicCmps/TaskTitle";
import { Priority } from "./dynamicCmps/Priority";
import { useState } from "react";

const GroupPreview = ({
  labels,
  group,
  loggedinUser,
  cmpOrder,
  progress,
  usersInBoard,
  onTaskUpdate,
  checkedBoxes,
  checkedGroups,
  handleCheckBoxClick,
  handleMasterCheckboxClick
}) => {
  const [expanded, setExpanded] = useState(true);

  const style = { borderLeft: `0.3rem solid ${group.color}` };
  const titleHead = { color: group.color };
  const progressComponents = ["date", "priority", "status"];

  return (
    <>
      <h2 style={titleHead}>
        {group.title}{" "}
        <span className="arrow" onClick={() => setExpanded((prev) => !prev)}>
          {expanded ? "👇🏻" : "👉🏻"}
        </span>{" "}
      </h2>

      <section className="group-list">
        {/* Render group labels by labels array */}

        {expanded && (
          <>
            <section className="labels-grid" style={style}>
              <input
                type="checkbox"
                onChange={() =>{}}
                onClick={() => handleMasterCheckboxClick(group)}
                checked={checkedGroups.includes(group.id)}
              />
              {cmpOrder.map((cmp, index) => (
                <div key={`label-${index}`}>{labels[index] || ""}</div>
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
                  checked={checkedBoxes.some(subArr => subArr[1] == task.id)}
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
                      usersInBoard={usersInBoard} // temporary for demo data
                      chat={task.chat} // temporary for demo data
                    />
                  </section>
                ))}
              </section>
            ))}

            {/* Render progress by progress array */}
            <section className="progress-grid" style={style}>
              {progress.map((prog, index) =>
                cmpOrder.includes(prog) ? (
                  <div className={`with-${prog}`} key={`progress-${index}`}>
                    {progress[index]}
                  </div>
                ) : (
                  <div className={prog} key={`progress-${index} `}></div>
                )
              )}
            </section>
          </>
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
  usersInBoard,
  chat,
  loggedinUser
}) => {
  // console.log("Rendering component:", cmpType, "with info:", info);

  switch (cmpType) {
    case "priority":
      return (
        <Priority
          group={group}
          task={task}
          priority={info}
          onTaskUpdate={onTaskUpdate}
        />
      );

    case "taskTitle":
      return (
        <TaskTitle
          group={group}
          task={task}
          loggedinUser={loggedinUser}
          usersInBoard={usersInBoard}
          chat={chat}
          text={info}
          onTaskUpdate={onTaskUpdate}
        />
      );

    case "status":
      return (
        <Status
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
          group={group}
          task={task}
          usersInBoard={usersInBoard}
          taskId={task.id}
          members={info}
          onTaskUpdate={onTaskUpdate}
        />
      );

    case "date":
      return (
        <Date
          group={group}
          task={task}
          date={info}
          onTaskUpdate={onTaskUpdate}
        />
      );

    default:
      console.error(`Unknown component type: ${cmpType}`);
      return <div>Unknown component: {cmpType}</div>;
  }
};

export default GroupPreview;
