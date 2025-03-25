import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./styles/mainStyles.scss";
import { UserMsg } from "./cmps/UserMsg";
import { Login } from "./pages/Login";
import { HomePage } from "./pages/HomePage";
import { SignUp } from "./pages/SignUp";
import { SomedayIndex } from "./pages/SomedayIndex";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { utilService } from "./services/util.service";
import { UserInfo } from "./cmps/dynamicCmps/modals/UserInfo";

function App() {
  const loggedInUser = useSelector((state) => state.userModule.user) || null;

  let name = null;
  if (loggedInUser) {
    name = utilService.getNameFromEmail(loggedInUser?.email);
  }

  return (
    <div>
      <Router>
        <UserMsg />
        {!loggedInUser ? (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Navigate to={`/${name}s-team.someday.com`} />} />
            <Route path={`/${name}s-team.someday.com`} element={<SomedayIndex />} />
            <Route path={`/${name}s-team.someday.com/boards/:boardId`} element={<SomedayIndex isBoard={true} />} />
            <Route path={`/${name}s-team.someday.com/board`} element={<SomedayIndex />} />
            <Route path={`/${name}s-team.someday.com/board/kanban/:boardId`} element={<SomedayIndex isBoard={true} isKanban={true} />} />
            <Route path={`/${name}s-team.someday.com/boards/:boardId/views`} element={<SomedayIndex isBoard={true} isKanban={true} />} />
            <Route path="/abc" element={<UserInfo userInfo={loggedInUser} />} />
          </Routes>
        )}
      </Router>
    </div>
  );
}

export default App;
