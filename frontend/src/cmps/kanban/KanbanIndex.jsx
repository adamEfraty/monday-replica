import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { boardService } from "../../services/board/board.service.js";
import { KanbanGroup } from "./KanbanGroup.jsx";
import { updateTask } from "../../store/actions/boards.actions.js";

export function KanbanIndex() {
    const { boardId } = useParams();
    const boards = useSelector((state) => state.boardModule.boards);
    const [currentBoard, setCurrentBoard] = useState({});
    const groups = currentBoard.groups;
    const loggedInUser = useSelector((state) => state.userModule.user);
    const users = useSelector((state) => state.userModule.users);

    useEffect(() => {
        const fetchBoard = async () => {
            const board = await getBoardById();
            setCurrentBoard(board);
        };
        fetchBoard();
    }, [boards, boardId]);

    async function getBoardById() {
        return await boardService.getById(boardId);
    }

    const onTaskUpdate = async (newCell) => {
        await updateTask(currentBoard._id, loggedInUser._id, newCell);
    };

    return (
        <div className="kanban-container">
            <div className="kanban-groups-container">
                {groups?.map((group) => (
                    <KanbanGroup key={group.id} group={group} onTaskUpdate={onTaskUpdate} users={users} />
                ))}
            </div>
        </div>
    );
}
