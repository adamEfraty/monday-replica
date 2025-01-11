import { Date } from "./dynamicCmps/Date";
import { Members } from "./dynamicCmps/Members";
import { Status } from "./dynamicCmps/Status";
import { TaskTitle } from "./dynamicCmps/TaskTitle";
import { Priority } from "./dynamicCmps/Priority";
import { useState } from "react";

const GroupPreview = ({ labels, group, cmpOrder, progress, usersInBoard }) => {

    const [expanded, setExpanded] = useState(true)


    // summerize the updating data
    function onTaskUpdate(changeInfo) {
        const updateInfo = `inTaskId:${changeInfo.taskId},${changeInfo.type}: ${changeInfo.value}`
        console.log(updateInfo)
    }

    const style = { borderLeft: `0.3rem solid ${group.color}` }
    const titleHead = { color: group.color }
    const progressComponents = ["date", "priority", "status"];
    return (<>
        <h2 style={titleHead}>{group.title} <span className="arrow" 
            onClick={(() => setExpanded(prev => !prev))}>{expanded ? '👇🏻' : '👉🏻'}</span> </h2>

        <section className="group-list">
            {/* Render group labels by labels array */}

            {expanded && <> <section className="labels-grid" style={style}>
                {cmpOrder.map((cmp, index) => (
                    <div key={`label-${index}`}>{labels[index] || ""}</div>
                ))}
            </section>

                {/* Render tasks by cmp order */}
                {group.tasks.map((task) => (
                    <section className="group grid" key={`task-${task.id}`} style={style}>
                        {cmpOrder.map((cmp, idx) => (
                            <section
                                className={`grid-item ${cmp}`}
                                key={`task-${task.id}-cmp-${idx}`}
                            >
                                <DynamicCmp
                                    taskId={task.id}
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
                    {cmpOrder.map((cmp, index) =>
                        progressComponents.includes(cmp) ? (
                            <div className={`with-${cmp}`} key={`progress-${index}`}>
                                {progress[index]}
                            </div>
                        ) : (
                            <div className={cmp} key={`progress-${index} `}></div>
                        )
                    )}
                </section>
            </>
            }


        </section>
    </>
    );
};

const DynamicCmp = ({ cmpType, info, onTaskUpdate, taskId, usersInBoard, chat}) => {
    console.log("Rendering component:", cmpType, "with info:", info);

    switch (cmpType) {

        case "priority":
            return <Priority taskId={taskId} info={info} onTaskUpdate={onTaskUpdate} />;
        case "taskTitle":
            return <TaskTitle chat={chat} taskId={taskId} info={info} onTaskUpdate={onTaskUpdate} />;
        case "status":
            return <Status taskId={taskId} info={info} onTaskUpdate={onTaskUpdate} />;
        case "members":
            return <Members usersInBoard={usersInBoard} taskId={taskId} info={info} onTaskUpdate={onTaskUpdate} />;
        case "date":
            return <Date taskId={taskId} info={info} onTaskUpdate={onTaskUpdate} />;
        default:
            console.error(`Unknown component type: ${cmpType}`);
            return <div>Unknown component: {cmpType}</div>;
    }
};

export default GroupPreview;
