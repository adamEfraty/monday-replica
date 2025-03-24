import { useNavigate } from "react-router";
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
        <div className="account-logo" onClick={onLogOut}>
          <img
            sizes="10px"
            className="account-logo-img"
            src="https://cdn.monday.com/images/logos/monday_logo_icon.png"
          ></img>
          <h4 className="username-wrapper">{user.email[0].toUpperCase()}</h4>
        </div>
      </section>
    </div>
  ) : (
    <div
      className="header-flex"
      style={{ backgroundColor: "#F7F7F7", padding: "14px", borderBottom: 'solid #E0E0E0 1px'}}
    >
      <div>
        <img
          onClick={() => navigate("/")}
          src="https://agenda.agami-network.com/static/media/agenda-logo-color.cb0ce09dcc5b97c18eb5755c559acc2a.svg"
          alt="logo"
        />
        <h2>SomeDay</h2>
      </div>
      <div>
        <button onClick={() => navigate("/login")}>Log in</button>
      </div>
    </div>
  );
}
