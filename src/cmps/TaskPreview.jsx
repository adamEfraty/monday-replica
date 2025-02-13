/* eslint-disable react/prop-types */
import { Priority } from "./dynamicCmps/Priority";
import { Status } from "./dynamicCmps/Status";
import { TaskTitle } from "./dynamicCmps/TaskTitle";
import { Date } from "./dynamicCmps/Date";
import { Members } from "./dynamicCmps/Members";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

export function TaskPreview({
    task,
    group,
    labels,
    loggedinUser,
    onTaskUpdate,
    users,
    chatTempInfoUpdate,
    openChat,
    checkedBoxes,
    handleCheckBoxClick,
    id
}) {


    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const [taskHovering, setTaskHovering] = useState(null)

    return (
        <section className="task-preview" 
        onMouseOver={()=>setTaskHovering(task.id)} 
        onMouseLeave={()=>setTaskHovering(null)}>
            <section
                ref={setNodeRef}
                className="group-grid"
                style={{ ...style, gridTemplateColumns: `${labels.map(label => `${label.width}px`).join(' ')} 500px` }}
                key={`task-${task.id}`}
            >

                {labels.map(label => {
                    const cell = task.cells.find(cell => cell.labelId === label.id)
                    return (

                        <section
                            key={`task-${task.id}-label-${label.id}`}
                            style={label.type === 'taskTitle' ? { borderLeft: `5px solid ${group?.color}` } : {}}
                            className={`grid-item ${label.type} ${label.type === 'taskTitle' ? 'stick-task' : ''}`}
                        >
                            <DynamicCmp
                                listeners={listeners}
                                attributes={attributes}
                                cellInfo={cell}
                                group={group}
                                loggedinUser={loggedinUser}
                                label={label}
                                onTaskUpdate={onTaskUpdate}
                                users={users}
                                chatTempInfoUpdate={chatTempInfoUpdate}
                                openChat={openChat}
                                checkedBoxes={checkedBoxes}
                                handleCheckBoxClick={handleCheckBoxClick}
                                taskHovering={taskHovering}
                            />
                        </section>
                    )
                })}
            </section >
        </section>
        
        
    );
}


function DynamicCmp({
    cellInfo,
    label,
    onTaskUpdate,
    group,
    loggedinUser,
    users,
    chatTempInfoUpdate,
    openChat,
    checkedBoxes,
    handleCheckBoxClick,
    listeners,
    attributes,
    taskHovering,
}) {
    switch (label.type) {
        case "priority":
            return (
                <Priority
                    cellInfo={cellInfo}
                    onTaskUpdate={onTaskUpdate}
                    labelWidth={label.width}
                />
            );

        case "taskTitle":
            return (
                <TaskTitle
                    cellInfo={cellInfo}
                    listeners={listeners}
                    attributes={attributes}
                    group={group}
                    loggedinUser={loggedinUser}
                    users={users}
                    onTaskUpdate={onTaskUpdate}
                    chatTempInfoUpdate={chatTempInfoUpdate}
                    openChat={openChat}
                    checkedBoxes={checkedBoxes}
                    handleCheckBoxClick={handleCheckBoxClick}
                    labelWidth={label.width}
                    taskHovering={taskHovering}
                />
            );

        case "status":
            return (
                <Status
                    cellInfo={cellInfo}
                    onTaskUpdate={onTaskUpdate}
                    labelWidth={label.width}
                />
            );

        case "members":
            return (
                <Members
                    cellInfo={cellInfo}
                    onTaskUpdate={onTaskUpdate}
                    users={users}
                    labelWidth={label.width}
                />
            );

        case "date":
            return (
                <Date
                    cellInfo={cellInfo}
                    onTaskUpdate={onTaskUpdate}
                    labelWidth={label.width}
                />
            );

        case "+":
            return (
                <div />
            );

        default:
            console.error(`Unknown component type: ${label.type}`);
            return <div>Unknown component: {label.type}</div>;
    }
}