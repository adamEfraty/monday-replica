import { useEffect } from "react";
import BoardDetails from "./BoardDetails.jsx";
import { updateBoardName } from "../store/actions/boards.actions.js";
import { BoardCard } from "./BoardCard.jsx";
import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { loadBoardsAndUsers } from "../services/socket.service.js";
import { addBoard } from "../store/actions/boards.actions.js";
import { utilService } from "../services/util.service.js";
import { AddBoardModal } from "./dynamicCmps/modals/AddBoardModal.jsx";



export function MainInnerIndex({ user, isBoard, isKanban, boards, addBoardModalToggle, addBoardModal}) {

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
        <small>Good {utilService.getStrTime()}, {user?.fullName}!</small>
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
              <div className="text-part">
                <h4>You have 0 boards in your workspace</h4>
                <h2>Get started with a new board</h2>
                <button onClick={addBoardModalToggle}>+ Add a board</button>
              </div>
              <img class="board-example-img" src="https://cdn.monday.com/images/homepage-desktop/recent-entities-empty-boards.svg"></img>
            </section>
          }
        </section>
      </section>
      {
        addBoardModal &&
        <AddBoardModal 
        addBoardModalToggle={addBoardModalToggle} 
        addBoard={addBoard}
        userEmail={utilService.getNameFromEmail(user.email)}/>
      }
    </div>
  ) : (
    <BoardDetails isKanban={isKanban} />
  );
}
