import { useNavigate } from "react-router";
import AppsIcon from "@mui/icons-material/Apps";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import SearchIcon from "@mui/icons-material/Search";
import ExtensionIcon from "@mui/icons-material/Extension";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import InboxIcon from "@mui/icons-material/Inbox";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { logout } from "../store/actions/user.actions";
import { useSelector } from "react-redux";
import { getSvg } from "../services/svg.service";

export function AppHeader() {
  const user = useSelector((state) => state.userModule.user);
  const iconStyle = { width: 22, height: 22 };
  const navigate = useNavigate();

  async function onLogOut() {
    await logout();
    navigate("/");



  }

  return user ? (
    <div className="header-flex">
      <section onClick={() => navigate("/")} className="header-sentance">
        <div>
          {getSvg("main-star")}
          <h5>SomeDay</h5>
          <h5 className="lighter">work management</h5>
        </div>
      </section>
      <section className="icons-section">
        <NotificationsNoneIcon style={iconStyle} />
        <InboxIcon style={iconStyle} />
        <PersonAddAltIcon style={iconStyle} />
        <ExtensionIcon style={iconStyle} />
        <div className="vertical-line"></div> {/* Vertical line separator */}
        <SearchIcon style={iconStyle} />
        <QuestionMarkIcon style={iconStyle} />
        <div className="account-logo" onClick={onLogOut}>
          <img
            sizes="10px"
            className="account-logo-img"
            src="https://cdn.monday.com/images/logos/monday_logo_icon.png"
          ></img>
          {/* <h4>{user.email[0].toUpperCase()}</h4> */}
        </div>
      </section>
    </div>
  ) : (
    <div
      className="header-flex"
      style={{ backgroundColor: "#fff", padding: "1rem" }}
    >
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
