/* eslint-disable react/prop-types */
import { Priority } from "./dynamicCmps/Priority";
import { Status } from "./dynamicCmps/Status";
import { TaskTitle } from "./dynamicCmps/TaskTitle";
import { DateCell } from "./dynamicCmps/DateCell";
import { Members } from "./dynamicCmps/Members";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState, useEffect, useRef } from "react";
import { DeleteTaskModal } from "./dynamicCmps/modals/DeleteTaskModal";
import { useSelector } from "react-redux"
import { openModal, closeModal } from "../store/actions/boards.actions";


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
    id,
    removeTask,
    boardId,
    boardScroll,
    isDragging,
    isDraggingTask,
    labelsLength,
}) {


    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const [taskHovering, setTaskHovering] = useState(null)

    // dlete modal
    const openModals = useSelector((state) => state.boardModule.openModals)
    const deleteTaskModal = openModals.some((modalId) => modalId === 'delete-' + id)
    const deleteTaskModalRef = useRef(null)
    const dotsRef = useRef(null)

    function deleteModalToggle() {
        deleteTaskModal
            ? closeModal('delete-' + id)
            : openModal('delete-' + id)
    }

    // if user click outside delete modal close it
    function handleClickOutsideModal(event) {
        if (!deleteTaskModalRef.current.contains(event.target)
            && !dotsRef.current.contains(event.target))
            deleteModalToggle()
    }

    // // open listener to handleClickOutsideModal only when modal open
    useEffect(() => {
        if (deleteTaskModal) document.addEventListener
            ('mousedown', handleClickOutsideModal)
        else document.removeEventListener
            ('mousedown', handleClickOutsideModal)
        return () => document.removeEventListener
            ('mousedown', handleClickOutsideModal)

    }, [deleteTaskModal])

    return (
        <section className="task-preview"
        onMouseOver={()=>setTaskHovering(task.id)} 
        onMouseLeave={()=>setTaskHovering(null)}>

            {deleteTaskModal &&
                <div ref={deleteTaskModalRef}>
                    <DeleteTaskModal
                        removeTask={removeTask}
                        boardId={boardId}
                        groupId={group.id}
                        taskId={id}
                        dotsRef={dotsRef}
                        boardScroll={boardScroll}
                    />

                </div>
            }

            <section
                ref={setNodeRef}
                className="task-grid"
                style={{ ...style, gridTemplateColumns: `${labels.map(label => `${label.width}px`).join(' ')} auto` }}
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
                                removeTask={removeTask}
                                boardId={boardId}
                                deleteModalToggle={deleteModalToggle}
                                dotsRef={dotsRef}
                                isDraggingTask={isDraggingTask}
                            />
                        </section>
                    )
                })}

                <div className="empty-space"
                style={{width: Math.max(90, window.innerWidth - labelsLength - 325)}}/>
            </section >
        </section>


    );
}
// style={{width: Math.max(90, 1210 - labelsLength)}}
// {width: Math.max(90, window.innerWidth - labelsLength - 350)}


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
    removeTask,
    boardId,
    deleteModalToggle,
    dotsRef,
    isDraggin,
    isDraggingTask
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
                    removeTask={removeTask}
                    boardId={boardId}
                    deleteModalToggle={deleteModalToggle}
                    dotsRef={dotsRef}
                    isDraggingTask={isDraggingTask}
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
                <DateCell
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