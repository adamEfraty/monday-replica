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
    onSetHoveredTask, 
    isHover,
}) {


    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    // dlete modal
    const openModals = useSelector((state) => state.boardModule.openModals)
    const deleteTaskModal = openModals.some((modalId) => modalId === 'delete-' + id)
    const deleteTaskModalRef = useRef(null)
    const dotsRef = useRef(null)

    const [isSelect, setIsSelect] = useState(false)


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
        onMouseOver={()=>onSetHoveredTask(task.id)} 
        onMouseLeave={()=>onSetHoveredTask(null)}>

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
                                isHover={isHover}
                                removeTask={removeTask}
                                boardId={boardId}
                                deleteModalToggle={deleteModalToggle}
                                dotsRef={dotsRef}
                                isDraggingTask={isDraggingTask}
                                setIsSelect={setIsSelect}
                                isSelect={isSelect}
                            />
                        </section>
                    )
                })}

                <div className="empty-space" 
                style={{backgroundColor: isSelect ? '#CCE5FF' : (isHover ? '#F4F5F8' : 'white')}}/>
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
    hoveredTask,
    removeTask,
    boardId,
    deleteModalToggle,
    dotsRef,
    isHover,
    isDraggingTask,
    setIsSelect,
    isSelect,
}) {
    switch (label.type) {
        case "priority":
            return (
                <Priority
                    cellInfo={cellInfo}
                    onTaskUpdate={onTaskUpdate}
                    labelWidth={label.width}
                    isHover={isHover}
                    setIsSelect={setIsSelect}
                    isSelect={isSelect}
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
                    isHover={isHover}
                    removeTask={removeTask}
                    boardId={boardId}
                    deleteModalToggle={deleteModalToggle}
                    dotsRef={dotsRef}
                    isDraggingTask={isDraggingTask}
                    setIsSelect={setIsSelect}
                    isSelect={isSelect}
                />
            );

        case "status":
            return (
                <Status
                    cellInfo={cellInfo}
                    onTaskUpdate={onTaskUpdate}
                    labelWidth={label.width}
                    isHover={isHover}
                    setIsSelect={setIsSelect}
                    isSelect={isSelect}
                />
            );

        case "members":
            return (
                <Members
                    cellInfo={cellInfo}
                    onTaskUpdate={onTaskUpdate}
                    users={users}
                    labelWidth={label.width}
                    isHover={isHover}
                    setIsSelect={setIsSelect}
                    isSelect={isSelect}
                />
            );

        case "date":
            return (
                <DateCell
                    cellInfo={cellInfo}
                    onTaskUpdate={onTaskUpdate}
                    labelWidth={label.width}
                    isHover={isHover}
                    setIsSelect={setIsSelect}
                    isSelect={isSelect}
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