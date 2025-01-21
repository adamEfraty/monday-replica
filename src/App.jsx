import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import "./styles/mainStyles.scss";
import { UserMsg } from "./cmps/Usermsg";
import { Login } from "./pages/Login";
import { HomePage } from "./pages/HomePage";
import { SignUp } from "./pages/SignUp";
import { MondayIndex } from "./pages/MondayIndex";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { utilService } from "./services/util.service";
import { useNavigate } from "react-router-dom";

function App() {
  const loggedInUser = useSelector((state) => state.userModule.user);
  useEffect(() => {
    console.log('loggedInUser', loggedInUser)
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
            <Route path="/" element={<Navigate to={`/${utilService.getNameFromEmail(loggedInUser.email)}s-team.sunday.com`} />} />
            <Route path={`/${utilService.getNameFromEmail(loggedInUser.email)}s-team.sunday.com`} element={<MondayIndex />} />
            <Route path={`/${utilService.getNameFromEmail(loggedInUser.email)}s-team.sunday.com/boards/:boardId`} element={<MondayIndex isBoard={true} />} />
            <Route path={`/${utilService.getNameFromEmail(loggedInUser.email)}s-team.sunday.com/board`} element={<MondayIndex isBoard={true} />} />
          </Routes>
        )}
      </Router>
      <UserMsg />
    </div>
  );
}

export default App;
