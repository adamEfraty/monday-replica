import { useNavigate } from "react-router";
import { signup } from "../store/actions/user.actions";
import { useState } from "react";
import { AppHeader } from "../cmps/AppHeader";
import { Link } from "react-router-dom";
import { ImgUploader } from "../cmps/ImageUploader";
import { utilService } from "../services/util.service";
import { boardService } from '../services/board'

export function SignUp() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const sideImg = 'https://dapulse-res.cloudinary.com/image/upload/monday_platform/signup/signup-right-side-assets-new-flow/welcome-to-monday.png'

  function handleChange(event) {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  }
  async function handleSubmit(e) {
    e.preventDefault();
    user.color = await utilService.getRandomFromArray(boardService.getGroupsColors())

    try {
      await signup(user);
      navigate(
        `/${utilService.getNameFromEmail(user.email)}s-team.someday.com`
      );
    } catch (err) {
      console.log(err);
    }
  }

  function onUploaded(imgUrl) {
    console.log('imgUrl', imgUrl)
    setUser((prevCredentials) => ({ ...prevCredentials, imgUrl }));
  }

  return (
    <>
      <section className="signup">
        <section className="signup-part">
          <h1>Welcome to someday.com</h1>
          <h2>Get started - it's free. No credit card needed.</h2>
          <form className="signup-form " onSubmit={handleSubmit}>
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
            <ImgUploader onUploaded={onUploaded} />
            <button type="submit">Submit</button>
          </form>
          <hr className="signup-line"/>
          <p>
            have an account ? <Link to={"/login"}>Log In</Link>{" "}
          </p>

        </section>
        <div className="img-part">
          <img className='side-image' src={sideImg}/>
        </div>
      </section>
    </>
  );
}
