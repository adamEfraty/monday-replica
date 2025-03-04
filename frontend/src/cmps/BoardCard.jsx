import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { SvgCmp } from "../services/svg.service";
import { useSelector } from "react-redux";

export function BoardCard({ board, onUpdateBoardName, handleFavorite }) {
  const favorites = useSelector((state) => state.boardModule.favorites);
  const [boardName, setBoardName] = useState(board.title);
  const navigate = useNavigate();
  return (
    <div className="board-card" key={board._id}>
      <img
        onClick={() => navigate(`./boards/${board._id}`)}
        src="https://cdn.monday.com/images/quick_search_recent_board2.svg"
        alt="Board Thumbnail"
      />
      <section style={{display: "flex", alignItems: "center", width: "90%"}}>
        <input
          onBlur={() => onUpdateBoardName(board._id, boardName)}
          type="text"
          className="board-input"
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
        />
        <div onClick={() => handleFavorite(board._id)}>
          <SvgCmp
            type={`${
              favorites.includes(board._id) ? "full" : "empty"
            }-rating-icon`}
          />
        </div>
      </section>
    </div>
  );
}
