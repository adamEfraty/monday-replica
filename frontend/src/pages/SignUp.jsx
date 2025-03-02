import { useNavigate } from "react-router";
import { signup } from "../store/actions/user.actions";
import { useState } from "react";
import { AppHeader } from "../cmps/AppHeader";
import { Link } from "react-router-dom";
import { ImgUploader } from "../cmps/ImageUploader";
import { utilService } from "../services/util.service";

export function SignUp() {
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

    try {
      await signup(user);
      navigate(`/${utilService.getNameFromEmail(user.email)}s-team.sunday.com`);
    } catch (err) {
      console.log(err);
    }
  }

  function onUploaded(imgUrl) {
    setUser((prevCredentials) => ({ ...prevCredentials, imgUrl }));
  }

  return (
    <>
      <AppHeader />
      <div className="container">
        <h1>Sign Up Now!</h1>
        <form className="login-form " onSubmit={handleSubmit}>
          <div className="form-section">
            <input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="Email-adress"
            />
          </div>
          <div className="form-section">
            <input
              type="text"
              name="fullName"
              onChange={handleChange}
              placeholder="Full Name"
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
          <ImgUploader onUploaded={onUploaded} />
        </form>
        <div>
          <p>
            {" "}
            have an account ? <Link to={"/login"}>Log In</Link>{" "}
          </p>
        </div>
      </div>
    </>
  );
}
