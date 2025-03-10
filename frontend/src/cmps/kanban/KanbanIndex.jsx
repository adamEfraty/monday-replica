import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { boardService } from "../../services/board/board.service.js";
import { KanbanGroup } from "./KanbanGroup.jsx";
import { updateTask, replaceGroups } from "../../store/actions/boards.actions.js";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { AppHeader } from "../AppHeader.jsx";
import { SideBar } from "../SideBar.jsx";

export function KanbanIndex() {
    const { boardId } = useParams();
    const boards = useSelector((state) => state.boardModule.boards);
    const [currentBoard, setCurrentBoard] = useState({});
    const [groups, setGroups] = useState([]);
    const loggedInUser = useSelector((state) => state.userModule.user);
    const users = useSelector((state) => state.userModule.users);

    useEffect(() => {
        const fetchBoard = async () => {
            const board = await getBoardById();
            setCurrentBoard(board);
            setGroups(board.groups);
        };
        fetchBoard();
    }, [boards, boardId]);

    async function getBoardById() {
        return await boardService.getById(boardId);
    }

    const onTaskUpdate = async (newCell) => {
        await updateTask(currentBoard._id, loggedInUser._id, newCell);
    };

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

                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="all-groups" direction="horizontal" type="group">
                        {(provided) => (
                            <div
                                className="kanban-container"
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {groups.map((group, index) => (
                                    <Draggable key={group.id} draggableId={group.id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <KanbanGroup
                                                    group={group}
                                                    onTaskUpdate={onTaskUpdate}
                                                    users={users}
                                                    boardId={boardId}
                                                    user={loggedInUser}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </section>

        </>
    );
}
