import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { boardService } from "../../services/board";
import { AppHeader } from "../AppHeader.jsx";
import { SideBar } from "../SideBar.jsx";
import { loadUsers } from "../../store/actions/user.actions.js";
import { KanbanGroups } from "./KanbanGroups.jsx";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { updateTaskStatus, getStatusColor } from "../../store/actions/boards.actions.js";
import { getSvg } from "../../services/svg.service.jsx";
import { BoardDetailsHeader } from "../BoardDetailsHeader.jsx";
import { addItem } from "../../store/actions/boards.actions.js";
import { updateTaskTitle } from "../../store/actions/boards.actions.js";
import { removeTask } from "../../store/actions/boards.actions.js";
import { P_Status } from "../dynamicCmps/progressCmps/P_Status.jsx";
import { replaceGroups } from "../../store/actions/boards.actions.js";

const STORAGE_KEY = "kanbanStatuses";

export function MondayKanbanIndex() {
    const { boardId } = useParams();
    const boards = useSelector((state) => state.boardModule.boards);
    const loggedInUser = useSelector((state) => state.userModule.user);
    const [currentBoard, setCurrentBoard] = useState({});
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const fetchBoard = async () => {
            const board = await getBoardById();
            await loadUsers();
            setCurrentBoard(board);
            setGroups(board.groups)




        };
        fetchBoard();
    }, [boardId, boards]);

    async function getBoardById() {
        return await boardService.getById(boardId);
    }


    function addTask(groupId) {
        addItem(boardId, groupId, 'new item', null, loggedInUser._id)
    }

    function onUpdateTaskTitle(newTitle, task, groupId) {
        updateTaskTitle(boardId, groupId, task.id, newTitle)
    }


    function onDeleteTask(task, groupId) {
        removeTask(boardId, groupId, task.id)
    }

    const handleDragEnd = async (result) => {
        const { source, destination, draggableId, type } = result;

        if (!destination) return;

        if (type === "group") {
            const newGroups = Array.from(groups);
            const [movedGroup] = newGroups.splice(source.index, 1);
            newGroups.splice(destination.index, 0, movedGroup);
            setGroups(newGroups);
            await replaceGroups(boardId, newGroups);
            return;
        }

        if (type === "task") {
            const sourceGroupIndex = groups.findIndex(group => group.id === source.droppableId);
            const destGroupIndex = groups.findIndex(group => group.id === destination.droppableId);

            const sourceGroup = groups[sourceGroupIndex];
            const destGroup = groups[destGroupIndex];

            const newSourceTasks = Array.from(sourceGroup.tasks);
            const [movedTask] = newSourceTasks.splice(source.index, 1);

            if (sourceGroupIndex === destGroupIndex) {
                newSourceTasks.splice(destination.index, 0, movedTask);
                const newGroups = [...groups];
                newGroups[sourceGroupIndex].tasks = newSourceTasks;
                setGroups(newGroups);
                await replaceGroups(boardId, newGroups);
            } else {
                const newDestTasks = Array.from(destGroup.tasks);
                newDestTasks.splice(destination.index, 0, movedTask);

                const newGroups = [...groups];
                newGroups[sourceGroupIndex].tasks = newSourceTasks;
                newGroups[destGroupIndex].tasks = newDestTasks;
                setGroups(newGroups);
                await replaceGroups(boardId, newGroups);
            }
        }
    };


    return (
        <>

            <AppHeader userData={loggedInUser} />

            <section className="content">
                <SideBar boards={boards} user={loggedInUser} />
                <div className="board-details2">
                    <BoardDetailsHeader handleAddTask={addTask}
                        boardTitle={currentBoard.title}
                        boardId={currentBoard._id}
                    />

                    <DragDropContext onDragEnd={handleDragEnd}>

                        <Droppable droppableId="groups-container" direction="horizontal" type="group">
                            {(provided) => (
                                <div className="kanban-container" ref={provided.innerRef} {...provided.droppableProps}>
                                    {groups.map((group, index) => (
                                        <Draggable key={group.id || `group-${index}`} draggableId={group.id || `group-${index}`} index={index}>
                                            {(provided) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    <KanbanGroups group={group} addItem={addTask} color={group.color} tasks={group.tasks} onUpdateTaskTitle={onUpdateTaskTitle} onRemove={onDeleteTask} />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>

            </section>

        </>
    );
}
