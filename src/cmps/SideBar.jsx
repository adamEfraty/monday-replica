import HomeIcon from "@mui/icons-material/HomeOutlined";
import MyWorkIcon from "@mui/icons-material/EventAvailableOutlined";
import FavoritesIcon from "@mui/icons-material/StarBorderRounded";
import WorkspacesIcon from "@mui/icons-material/GridViewOutlined";
import { useNavigate, useLocation } from "react-router";
import { addBoard } from "../store/actions/boards.actions";
import { utilService } from "../services/util.service";
import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PlusIcon from "@mui/icons-material/AddOutlined";
import BoardIcon from "@mui/icons-material/SpaceDashboardOutlined";
import HorizDotsIcon from "@mui/icons-material/MoreHorizOutlined";
import { MenuModal } from "./dynamicCmps/modals/menu/MenuModal";
import { useState } from "react";

export function SideBar({ boards, user, onRemoveBoard }) {
  const [menuDisplay, setMenuDisplay] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  function onChangeAdressOnce(fullAddress) {
    if (location.pathname !== fullAddress) {
      navigate(`${fullAddress}`);
    }
  }

  function handleAddBoard() {
    addBoard();
  }

  function handleDotsClick(event, boardId) {
    event.stopPropagation();
    console.log(boardId);
    onRemoveBoard(boardId);
  }

  const iconStyle = { width: 22, height: 22 };

  return (
    <nav className="side-bar">
      {/* Home Section */}
      <section
        onClick={() =>
          onChangeAdressOnce(
            `/${utilService.getNameFromEmail(user.email)}s-team.sunday.com`
          )
        }
      >
        <HomeIcon className="side-bar-icon home" style={iconStyle} />
        <p>Home</p>
      </section>
      {/* My Work Section */}
      <section>
        <MyWorkIcon className="side-bar-icon myWork" style={iconStyle} />
        <p>My Work</p>
      </section>

      <hr />

      {/* Favorites Section */}
      <section className="favorites">
        <div>
          <FavoritesIcon
            className="side-bar-icon favorites"
            style={iconStyle}
          />
          <p>Favorites</p>
        </div>
        {<ArrowDownIcon />}
      </section>

      <hr />

      {/* Workspaces Section */}
      <div className="workspaces">
        <section>
          <WorkspacesIcon className="side-bar-icon work" style={iconStyle} />
          <p>Workspaces</p>
        </section>
        <div className="add-board">
          <div>
            <h3>Main Workspace</h3>
            <ArrowDownIcon style={iconStyle} />
          </div>
          <button className="add-board-button" onClick={() => setMenuDisplay(!menuDisplay)}>
            <PlusIcon style={{ width: 28, height: 26 }} />
          </button>
          
          {menuDisplay && <MenuModal type="addItem" handleAddBoard={handleAddBoard} />}
        </div>
      </div>

      {/* Board List */}
      <ul className="sidebar-boardlist">
        {boards.map((board) => (
          <li key={board.id}>
            <div
              className="sidebar-board"
              onClick={() => {
                console.log(board.id);
                onChangeAdressOnce(
                  `/${utilService.getNameFromEmail(
                    user.email
                  )}s-team.sunday.com/boards/${board.id}`
                );
              }}
            >
              <section>
                <BoardIcon style={iconStyle} />
                {/* Board Title Navigation */}
                <h3>{board.title}</h3>
              </section>

              {/* <button
                className="options-menu"
                onClick={() => onRemoveBoard(board.id)}
              >
                X
              </button> */}
              <HorizDotsIcon
                onClick={(event) => handleDotsClick(event, board.id)}
                className="horizontal-dots-icon"
                style={iconStyle}
              />
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
}
