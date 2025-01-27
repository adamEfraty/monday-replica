/* eslint-disable react/prop-types */
import { useState } from "react";
import { Popover } from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { GarbageRemove } from "./dynamicCmps/modals/GarbageRemove.jsx";
import { Priority } from "./dynamicCmps/Priority";
import { Status } from "./dynamicCmps/Status";
import { TaskTitle } from "./dynamicCmps/TaskTitle";
import { Date } from "./dynamicCmps/Date";
import { Members } from "./dynamicCmps/Members";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function TaskPreview({
    task,
    group,
    labels,
    loggedinUser,
    onTaskUpdate,
    removeTask,
    boardId,
    users,
    chatTempInfoUpdate,
    openChat,
    checkedBoxes,
    handleCheckBoxClick,
    id
}) {
    const [open, setOpen] = useState(false);

    const handlePopoverClick = (event) => {
        setOpen(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setOpen(false);
    };


    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,


    };

    return (
        <section
            ref={setNodeRef}
            className="group-grid"
            style={{ ...style, gridTemplateColumns: `10px 400px repeat(${labels.length}, 150px) 500px` }}
            key={`task-${task.id}`}
        >
            <div className="dots">
                <span onClick={handlePopoverClick}>
                    <MoreHorizIcon />
                </span>

                <Popover
                    id="task-popover"
                    open={Boolean(open)}
                    anchorEl={open}
                    onClose={handlePopoverClose}
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

            {labels.map(label => (
                <section

                    key={`task-${task.id}-label-${label.id}`}
                    style={label.type === 'taskTitle' ? { borderLeft: `5px solid ${group?.color}` } : {}}
                    className={`grid-item ${label.type} ${label.type === 'taskTitle' ? 'stick' : ''}`}
                >
                    <DynamicCmp
                        listeners={listeners}
                        attributes={attributes}

                        group={group}
                        task={task}
                        loggedinUser={loggedinUser}
                        label={label}
                        info={task[label.type]}
                        onTaskUpdate={onTaskUpdate}
                        chat={task.chat}
                        users={users}
                        chatTempInfoUpdate={chatTempInfoUpdate}
                        openChat={openChat}
                        checkedBoxes={checkedBoxes}
                        handleCheckBoxClick={handleCheckBoxClick}
                    />


                </section>
            ))
            }
        </section >
    );
}


function DynamicCmp({
    label,
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
    handleCheckBoxClick,
    listeners,
    attributes,
}) {
    switch (label.type) {
        case "priority":
            return (
                <Priority
                    cellId={task.id + label.id}
                    group={group}
                    task={task}
                    priority={info}
                    onTaskUpdate={onTaskUpdate}
                />
            );

        case "taskTitle":
            return (
                <TaskTitle
                    listeners={listeners}
                    attributes={attributes}
                    cellId={task.id + label.id}
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
            );

        case "status":
            return (
                <Status
                    cellId={task.id + label.id}
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
                    cellId={task.id + label.id}
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
                    cellId={task.id + label.id}
                    group={group}
                    task={task}
                    date={info}
                    onTaskUpdate={onTaskUpdate}
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