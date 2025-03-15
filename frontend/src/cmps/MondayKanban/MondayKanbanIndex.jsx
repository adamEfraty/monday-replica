import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { boardService } from "../../services/board";
import { AppHeader } from "../AppHeader.jsx";
import { SideBar } from "../SideBar.jsx";
import { loadUsers } from "../../store/actions/user.actions.js";
import { KanbanGroups } from "./KanbanGroups.jsx";

export function MondayKanbanIndex() {
    const { boardId } = useParams();
    const boards = useSelector((state) => state.boardModule.boards);
    const [currentBoard, setCurrentBoard] = useState({});
    const [groups, setGroups] = useState([]);
    const loggedInUser = useSelector((state) => state.userModule.user);
    const users = useSelector((state) => state.userModule.users);
    const [tasks, setTasks] = useState([]);

    const statusArray = [
        { text: 'Done', color: '#00C875' },
        { text: 'Working on it', color: '#FDAB3D' },
        { text: 'Stuck', color: '#DF2F4A' },
        { text: 'Blank', color: '#C4C4C4' }
    ];

    useEffect(() => {
        const fetchBoard = async () => {
            const board = await getBoardById();
            await loadUsers();
            setCurrentBoard(board);
            setGroups(board.groups);
            setTasks(getAllTasks(board));
        };
        fetchBoard();
    }, [boards, boardId]);

    async function getBoardById() {
        return await boardService.getById(boardId);
    }

    function getAllTasks(board) {
        if (!board || !board.groups || !Array.isArray(board.groups)) {
            return [];
        }
        return board.groups.flatMap(group => group.tasks || []);
    }

    return (
        <>
            <AppHeader userData={loggedInUser} />

            <section className="content">
                <SideBar boards={boards} user={loggedInUser} />

                <div className="kanban-container">
                    {statusArray.map((status, index) => (
                        <KanbanGroups key={index} title={status.text} color={status.color} tasks={tasks} />
                    ))}
                </div>
            </section>

        </>
    );
}
