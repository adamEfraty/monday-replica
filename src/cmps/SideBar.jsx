import HomeIcon from "@mui/icons-material/HomeOutlined";
import MyWorkIcon from "@mui/icons-material/EventAvailableOutlined";
import FavoritesIcon from "@mui/icons-material/StarBorderRounded";
import WorkspacesIcon from "@mui/icons-material/GridViewOutlined";
import { useNavigate, useLocation } from "react-router";
import { addBoard } from "../store/actions/boards.actions";

export function SideBar({ boards, user, onRemoveBoard }) {
  const location = useLocation();
  const navigate = useNavigate();

  function convertAddressToURL(address) {
    return encodeURIComponent(address);
  }

  function onChangeAdressOnce(fullAddress) {
    const targetURL = `/${convertAddressToURL(fullAddress)}`;
    if (location.pathname !== targetURL) {
      navigate(targetURL);
    }
  }


  function handleAddBoard() {
    addBoard();

  }

  return (
    <nav className="side-bar">
      {/* Home Section */}
      <section onClick={() => onChangeAdressOnce(`${user.fullName}'s-team`)}>
        <HomeIcon />
        <h4>Home</h4>
      </section>

      {/* My Work Section */}
      <section>
        <MyWorkIcon />
        <h4>My Work</h4>
      </section>

      <hr />

      {/* Favorites Section */}
      <section>
        <FavoritesIcon />
        <h4>Favorites</h4>
      </section>

      <hr />

      {/* Workspaces Section */}
      <section>
        <WorkspacesIcon />
        <h4>Workspaces</h4>
      </section>

      <button className="add-board" onClick={handleAddBoard}>
        +Add a new board
      </button>

      {/* Board List */}
      <ul className="sidebar-boardlist">
        {boards.map((board) => (
          <li key={board.id}>
            <div className="sidebar-board">
              {/* Board Title Navigation */}
              <p
                onClick={() =>
                  navigate(`/${user.fullName}'s-team/boards/${board.id}`)
                }
              >
                {board.title}
              </p>

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
