import { HashRouter as Router, Routes, Route } from "react-router-dom";

import "./styles/mainStyles.scss";
import { UserMsg } from "./cmps/Usermsg";
import { Login } from "./pages/Login";
import { HomePage } from "./pages/HomePage";
import { SignUp } from "./pages/SignUp";
import { MondayIndex } from "./pages/MondayIndex";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function App() {
  const loggedInUser = useSelector((state) => state.userModule.user);
  useEffect(() => {
    console.log(loggedInUser)
  }, [])

  return (
    <div>
      <Router>
        {!loggedInUser ? (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        ) : (
          <Routes>
            <Route path={`/${loggedInUser.fullName}'s-team`} element={<MondayIndex />} />
            <Route path={`/${loggedInUser.fullName}'s-team/boards/:boardId`} element={<MondayIndex isBoard={true} />} />
            <Route path={`/${loggedInUser.fullName}'s-team/board`} element={<MondayIndex isBoard={true} />} />
          </Routes>
        )}
      </Router>
      <UserMsg />
    </div>
  );
}

export default App;
