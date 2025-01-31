import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { SvgCmp } from "../services/svg.service";
import { useSelector } from "react-redux";

export function BoardCard({ board, onUpdateBoardName, handleFavorite }) {
  const favorites = useSelector((state) => state.boardModule.favorites);
  const [boardName, setBoardName] = useState(board.title);
  const navigate = useNavigate();
  return (
    <div className="board-card" key={board.id}>
      <img
        onClick={() => navigate(`./boards/${board.id}`)}
        src="https://cdn.monday.com/images/quick_search_recent_board2.svg"
        alt="Board Thumbnail"
      />
      <input
        onBlur={() => onUpdateBoardName(board.id, boardName)}
        type="text"
        className="board-input"
        value={boardName}
        onChange={(e) => setBoardName(e.target.value)}
      />
      <div onClick={() => handleFavorite(board.id)}>
        <SvgCmp
          type={`${
            favorites.includes(board.id) ? "full" : "empty"
          }-rating-icon`}
        />
      </div>
    </div>
  );
}
