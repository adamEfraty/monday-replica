import { useEffect } from "react";
import BoardDetails from "./BoardDetails";
import { useNavigate } from "react-router";
import { loadBoards } from "../store/actions/boards.actions.js";
import { addBoard, updateBoardName } from "../store/actions/boards.actions.js";
import { loadUsers, logout } from "../store/actions/user.actions.js";
import { BoardCard } from "./BoardCard.jsx";
import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";


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
        <small>Hello {user.fullName}!</small>
        <br />
        <small id="bold">Quickly access your recent boards, Inbox and workspaces</small>
      </section>
      <hr />
      <br />
      <section className="recently-viewed-section">
        <div className="recently-viewed-header">
          <ArrowDownIcon />
          <h5>Recently viewed</h5>
        </div>

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
