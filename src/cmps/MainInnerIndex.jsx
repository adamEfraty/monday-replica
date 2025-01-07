import React from "react";
import BoardDetails from "./BoardDetails";
import { use } from "react";
import { useNavigate } from "react-router";

export function MainInnerIndex({ user, isBoard, boards }) {
    const navigate = useNavigate();
  return !isBoard ? <div className="main-inner-index">
      <section className="welcome-section">
        <h3>Hello {user.fullName}!</h3>
        <h3>Quickly access your recent boards, Inbox and workspaces</h3>
      </section>
      <section className="recently-viewed-section">
        <h3>Recently viewed</h3>
        <button onClick={() => navigate("board")}>
            Temporary shortcut to demy board display
        </button>
        <div className="boards-container">
          {boards.map((board) => (
            <div className="board-card" key={board._id}>
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
