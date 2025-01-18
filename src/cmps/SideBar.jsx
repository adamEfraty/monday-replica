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
export function SideBar({ boards, user, onRemoveBoard }) {
  const location = useLocation();
  const navigate = useNavigate();

  function onChangeAdressOnce(fullAddress) {
    if (location.pathname !== fullAddress) {
      navigate(fullAddress);
    }
  }

  function handleAddBoard() {
    addBoard();
  }

  const iconStyle = { width: 18, height: 16 };

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
        <h4>Home</h4>
      </section>
      {/* My Work Section */}
      <section>
        <MyWorkIcon className="side-bar-icon myWork" style={iconStyle} />
        <h4>My Work</h4>
      </section>

      <hr />

      {/* Favorites Section */}
      <section>
        <FavoritesIcon className="side-bar-icon favorites" style={iconStyle} />
        <h4>Favorites</h4>
      </section>

      <hr />

      {/* Workspaces Section */}
      <section>
        <WorkspacesIcon className="side-bar-icon work" style={iconStyle} />
        <h4>Workspaces</h4>
      </section>

      <div className="add-board">
        <div>
          <h3>Main Workspace</h3>
          <ArrowDownIcon style={iconStyle} />
        </div>
        <button className="add-board-button" onClick={handleAddBoard}>
          <PlusIcon style={{ height: 20, width: 22 }} />
        </button>
      </div>

      {/* Board List */}
      <ul className="sidebar-boardlist">
        {boards.map((board) => (
          <li key={board.id}>
            <div
              className="sidebar-board"
              onClick={() =>
                onChangeAdressOnce(
                  `/${utilService.getNameFromEmail(
                    user.email
                  )}s-team.sunday.com/boards/${board.id}`
                )
              }
            >
              <BoardIcon style={{ width: 16, height: 16 }} />
              {/* Board Title Navigation */}
              <h3>{board.title}</h3>

              <button
                className="remove"
                onClick={() => onRemoveBoard(board.id)}
              >
                X
              </button>
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
}
