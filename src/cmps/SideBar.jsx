import HomeIcon from "@mui/icons-material/HomeOutlined";
import MyWorkIcon from "@mui/icons-material/EventAvailableOutlined";
import FavoritesIcon from "@mui/icons-material/StarBorderRounded";
import WorkspacesIcon from "@mui/icons-material/GridViewOutlined";
import { useNavigate } from "react-router";

export function SideBar() {
    const navigate = useNavigate();
  return (
    <nav className="side-bar">
      <section>
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
      <section>
        <div>
          <img src="" alt="Main Workspace" />
          <h4>Main Workspace</h4>
        </div>
        <i></i>
      </section>
    </nav>
  );
}
