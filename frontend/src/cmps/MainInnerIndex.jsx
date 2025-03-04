import { useEffect } from "react";
import BoardDetails from "./BoardDetails.jsx";
import { useNavigate } from "react-router";
import { loadBoards, setFavories } from "../store/actions/boards.actions.js";
import { addBoard, updateBoardName } from "../store/actions/boards.actions.js";
import { loadUsers, logout } from "../store/actions/user.actions.js";
import { BoardCard } from "./BoardCard.jsx";
import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useSelector } from "react-redux";
import { CreateBoard } from "./dynamicCmps/modals/CreateBoard.jsx";

export function MainInnerIndex({ user, isBoard, boards }) {
  const filteredColumns = useSelector((state) => state.boardModule.filteredColumns);
  const navigate = useNavigate();

  useEffect(() => {
    loadBoardsAndUsers()
  }, []);

  const iconStyle = { width: 22, height: 22 };


  function loadBoardsAndUsers() {
    loadBoards()
    loadUsers()
  }

  function onUpdateBoardName(id, title) {
    updateBoardName(id, title);
  }

  async function handleFavorite(boardId) {
    await setFavories(boardId);
  }

  return !isBoard ? (
    <div className="main-inner-index">
      <section className="welcome-section">
        <small>Hello {user?.fullName}!</small>
        <small id="bold">
          Quickly access your recent boards, Inbox and workspaces
        </small>
      </section>
      <section>
        <section className="recently-visited-section">
          <div className="recently-visited-header">
            <ArrowDownIcon style={iconStyle} />
            <h4>Recently visited</h4>
          </div>
          <div className="boards-container">
            {boards.map((board) => (
              <BoardCard
                key={board._id}
                board={board}
                onUpdateBoardName={onUpdateBoardName}
                handleFavorite={handleFavorite}
              />
            ))}
          </div>
        </section>
      </section>
    </div>
  ) : (
    <BoardDetails />
  );
}
