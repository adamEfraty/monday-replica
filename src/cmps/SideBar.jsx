import HomeIcon from "@mui/icons-material/HomeOutlined";
import MyWorkIcon from "@mui/icons-material/EventAvailableOutlined";
import FavoritesIcon from "@mui/icons-material/StarBorderRounded";
import WorkspacesIcon from "@mui/icons-material/GridViewOutlined";
import { useNavigate, useLocation } from "react-router";
import { useSelector } from "react-redux";



export function SideBar() {
  const user = useSelector(state => state.userModule.user)
  const boards = useSelector(state => state.boardModule.boards)
  const location = useLocation();
  const navigate = useNavigate();

  function convertAddressToURL(address) {
    return address.split(' ').join('%20');
  }

  function onChangeAdressOnce(fullAdress){
    (location.pathname === convertAddressToURL(fullAdress)) 
    ? null
    : navigate(fullAdress)}

  return (
    <nav className="side-bar">
      <section onClick={()=>onChangeAdressOnce(`/${user.fullName}'s-team`)}>
        <HomeIcon />
        <h4>Home</h4>
      </section>
      <section>
        <MyWorkIcon />
        <h4>My Work</h4>
      </section>
      <hr />
      <section>
        <FavoritesIcon />
        <h4>Favorites</h4>
      </section>
      <hr />
      <section>
        <WorkspacesIcon />
        <h4>Workspaces</h4>
      </section>
      <ul className="sidebar-boardlist">
        {
          boards.map(board=> <li key={board.id}>
            <div 
            className="sidebar-board"
            onClick={()=>onChangeAdressOnce
              (`/${user.fullName}'s-team/boards/${board.id}`)}>
              <p>{board.title}</p>
            </div>
          </li>)
        }
      </ul>
    </nav>
  );
}
