import { useEffect } from "react";
import BoardDetails from "./BoardDetails";
import { use } from "react";
import { useNavigate } from "react-router";
import { loadBoards } from "../store/actions/boards.actions.js";
import { addBoard } from "../store/actions/boards.actions.js";
export function MainInnerIndex({ user, isBoard, boards }) {
  const navigate = useNavigate();
  useEffect(() => {
    loadBoards()
  }, [])

  function handleAddBoard() {
    addBoard()
  }

  return !isBoard ? <div className="main-inner-index">
    <section className="welcome-section">
      <h3>Hello {user.fullName}!</h3>
      <h3>Quickly access your recent boards, Inbox and workspaces</h3>
    </section>
    <section className="recently-viewed-section">
      <h3>Recently viewed</h3>
      <button className="btn" onClick={handleAddBoard}>+Add a new board</button>
      <div className="boards-container">
        {boards.map(board => (
          <div className="board-card" key={board.id} onClick={() => navigate(`./boards/${board.id}`)}>
            <img
              src="https://cdn.monday.com/images/quick_search_recent_board2.svg"
              alt="Board Thumbnail"
            />
            <h4>{board.title}</h4>
          </div>
        ))}
      </div>
    </section>
  </div> : <BoardDetails />;
}
