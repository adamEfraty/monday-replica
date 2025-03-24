import { useEffect } from "react";
import BoardDetails from "./BoardDetails.jsx";
import { useNavigate } from "react-router";
import { updateBoardName } from "../store/actions/boards.actions.js";
import { BoardCard } from "./BoardCard.jsx";
import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useSelector } from "react-redux";
import { loadBoardsAndUsers } from "../services/socket.service.js";

export function MainInnerIndex({ user, isBoard, boards }) {
  const filteredColumns = useSelector((state) => state.boardModule.filteredColumns);
  const navigate = useNavigate();

  useEffect(() => {
    loadBoardsAndUsers()
  }, []);

  const iconStyle = { width: 22, height: 22 };

  function onUpdateBoardName(id, title) {
    updateBoardName(id, title);
  }

  return !isBoard ? (
    <div className="main-inner-index">
      <section className="welcome-section">
        <small>Good afternoon, {user?.fullName}!</small>
        <small className="small-bold">
          Quickly access your recent boards, Inbox and workspaces
        </small>
      </section>
      <section>
        <section className="recently-visited-section">
          <div className="recently-visited-header">
            <ArrowDownIcon style={iconStyle} />
            <h4>Recently visited</h4>
          </div>
          {
            boards.length ?
            <div className="boards-container">
            {boards.map((board) => (
              <BoardCard
                key={board._id}
                board={board}
                onUpdateBoardName={onUpdateBoardName}
              />
            ))}
            </div>
            :
            <section className="boards-empty-container">
              <h2>No Boards</h2>
            </section>
          }

        </section>
      </section>
    </div>
  ) : (
    <BoardDetails />
  );
}
