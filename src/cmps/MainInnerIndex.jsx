import { useEffect } from "react";
import BoardDetails from "./BoardDetails";
import { useNavigate } from "react-router";
import { loadBoards } from "../store/actions/boards.actions.js";
import { addBoard, updateBoardName } from "../store/actions/boards.actions.js";
import { loadUsers, logout } from "../store/actions/user.actions.js";
import { BoardCard } from "./BoardCard.jsx";

export function MainInnerIndex({ user, isBoard, boards }) {
  const navigate = useNavigate();
  useEffect(() => {
    loadBoardsAndUsers()
  }, []);


  function loadBoardsAndUsers() {
    loadBoards()
    loadUsers()
  }


  function onUpdateBoardName(id, title) {
    updateBoardName(id, title)
  }

  return !isBoard ? (
    <div className="main-inner-index">
      <section className="welcome-section">
        <h3>Hello {user.fullName}!</h3>
        <h3>Quickly access your recent boards, Inbox and workspaces</h3>
      </section>
      <section className="recently-viewed-section">
        <h3>Recently viewed</h3>

        <div className="boards-container">
          {boards.map((board) => (
            <BoardCard key={board.id} board={board} onUpdateBoardName={onUpdateBoardName} />
          ))}
        </div>
      </section>
    </div>
  ) : (
    <BoardDetails />
  );
}
