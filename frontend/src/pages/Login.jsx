import { useNavigate } from "react-router";
import { login } from "../store/actions/user.actions";
import { useState } from "react";
import { AppHeader } from "../cmps/AppHeader";
import { Link } from "react-router-dom";
import { utilService } from "../services/util.service";

export function Login() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  }
  async function handleSubmit(e) {
    e.preventDefault();

    if (!user.email || !user.password) {
      return;
    }
    await login(user)
      .then((returnedUser) => {
        navigate(`/${utilService.getNameFromEmail(returnedUser.email)}s-team.sunday.com`);
      })
      .catch((err) => {
        console.log("error: ", err);
      });
  }

  return (
    <>
      <AppHeader />
      <div className="container">
        <h1>Log into you account !</h1>
        <form className="login-form " onSubmit={handleSubmit}>
          <div className="form-section">
            <input
              type="text"
              name="email"
              onChange={handleChange}
              placeholder="Email-adress"
            />
          </div>
          <div className="form-section">
            <input
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Password"
            />
          </div>
          <button type="submit">Submit</button>
        </form>
        <div>
          <p>
            {" "}
            don't have an account ? <Link to={"/signup"}>sign up</Link>{" "}
          </p>
        </div>
      </div>
    </>
  );
}
