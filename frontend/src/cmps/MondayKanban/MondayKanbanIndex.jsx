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

export function MondayKanbanIndex() {
    const { boardId } = useParams();
    const boards = useSelector((state) => state.boardModule.boards);
    const loggedInUser = useSelector((state) => state.userModule.user);
    const users = useSelector((state) => state.userModule.users);
    const [currentBoard, setCurrentBoard] = useState({});
    const [groups, setGroups] = useState([]);
    const [tasks, setTasks] = useState([]);

    const statusArray = [
        { text: "Done", color: "#00C875" },
        { text: "Working on it", color: "#FDAB3D" },
        { text: "Stuck", color: "#DF2F4A" },
        { text: "Blank", color: "#C4C4C4" }
    ];

    useEffect(() => {
        const fetchBoard = async () => {
            const board = await getBoardById();
            await loadUsers();
            setCurrentBoard(board);
            setGroups(statusArray);
            setTasks(getAllTasks(board));
        };
        fetchBoard();
    }, [boardId, boards]);

    async function getBoardById() {
        return await boardService.getById(boardId);
    }

    function getAllTasks(board) {
        if (!board || !board.groups || !Array.isArray(board.groups)) {
            return [];
        }
        return board.groups.flatMap(group =>
            (group.tasks || []).map(task => ({
                ...task,
                groupId: group.id
            }))
        );
    }

    const onDragEnd = (result) => {
        const { source, destination, type } = result;
        if (!destination) return;

        if (type === "group") {
            const updatedGroups = [...groups];
            const [movedGroup] = updatedGroups.splice(source.index, 1);
            updatedGroups.splice(destination.index, 0, movedGroup);
            setGroups(updatedGroups);
        } else if (type === "task") {
            const sourceGroupId = source.droppableId;
            const destinationGroupId = destination.droppableId;

            let movedTask = tasks.find(task => task.id === result.draggableId);
            if (!movedTask) return;

            const newStatus = destinationGroupId === "BlankGroup" ? "" : destinationGroupId;
            movedTask = {
                ...movedTask,
                cells: movedTask.cells.map(cell =>
                    cell.type === "status" ? { ...cell, value: { ...cell.value, text: newStatus, color: getStatusColor(newStatus) } } : cell
                )
            };

            const updatedTasks = tasks.filter(task => task.id !== movedTask.id);
            updatedTasks.push(movedTask);

            setTasks(updatedTasks);
            updateTaskStatus(boardId, movedTask.groupId, movedTask.id, newStatus);
        }
    };

    return (
        <>
            <AppHeader userData={loggedInUser} />

            <section className="content">
                <SideBar boards={boards} user={loggedInUser} />

                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="groups-container" direction="horizontal" type="group">
                        {(provided) => (
                            <div className="kanban-container" ref={provided.innerRef} {...provided.droppableProps}>
                                {groups.map((status, index) => (
                                    <Draggable key={status.text || `group-${index}`} draggableId={status.text || `group-${index}`} index={index}>
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <KanbanGroups title={status.text} color={status.color} tasks={tasks} />
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
