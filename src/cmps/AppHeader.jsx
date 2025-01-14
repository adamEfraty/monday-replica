import { useNavigate } from "react-router";
import AppsIcon from "@mui/icons-material/Apps";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import SearchIcon from "@mui/icons-material/Search";
import ExtensionIcon from "@mui/icons-material/Extension";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import InboxIcon from "@mui/icons-material/Inbox";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

export function AppHeader({ userData = null }) {
  const navigate = useNavigate();

  return userData ? (
    <div className="header-flex">
      <section className="header-sentance">
        <h4>Monday </h4>
        <h4>work management</h4>
      </section>
      <section className="icons-section">
        <NotificationsNoneIcon />
        <InboxIcon />
        <PersonAddAltIcon />
        <ExtensionIcon />
        <SearchIcon />
        <div className="vertical-line"></div> {/* Vertical line separator */}
        <QuestionMarkIcon />
        <div className="vertical-line"></div> {/* Vertical line separator */}
        <AppsIcon />
        <img onClick={() => navigate('/users')} src="https://agenda.agami-network.com/static/media/agenda-logo-color.cb0ce09dcc5b97c18eb5755c559acc2a.svg" alt="Main Workspace" />
      </section>
    </div>
  ) : (
    <div className="header-flex">
      <div>
        <img
          onClick={() => navigate("/")}
          src="https://agenda.agami-network.com/static/media/agenda-logo-color.cb0ce09dcc5b97c18eb5755c559acc2a.svg"
          alt="logo"
        />
        <h2>Friday</h2>
      </div>
      <div>
        <button onClick={() => navigate("/login")}>Log in</button>
        <button>Start Demo</button>
      </div>
    </div>
  );
}
