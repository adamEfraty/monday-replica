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

            {labels.map(label => {
                const cell = task.cells.find(cell=>cell.labelId===label.id)
                return (

                <section
                    key={`task-${task.id}-label-${label.id}`}
                    style={label.type === 'taskTitle' ? { borderLeft: `5px solid ${group?.color}` } : {}}
                    className={`grid-item ${label.type} ${label.type === 'taskTitle' ? 'stick' : ''}`}
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
                    />


                </section>
            )})
            }
        </section >
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
}) {
    switch (label.type) {
        case "priority":
            return (
                <Priority
                    cellInfo={cellInfo}
                    onTaskUpdate={onTaskUpdate}
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
                />
            );

        case "status":
            return (
                <Status
                    cellInfo={cellInfo} 
                    onTaskUpdate={onTaskUpdate}
                />
            );

        case "members":
            return (
                <Members
                    cellInfo={cellInfo}
                    onTaskUpdate={onTaskUpdate}
                    users={users}
                />
            );

        case "date":
            return (
                <Date
                    cellInfo={cellInfo}
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