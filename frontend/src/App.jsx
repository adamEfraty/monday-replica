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

function App() {
  const loggedInUser = useSelector((state) => state.userModule.user) || null;

  useEffect(() => {
    console.log(loggedInUser);
  }, [loggedInUser]);

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
            <Route path={`/${name}s-team.someday.com`} element={<MondayIndex />} />
            <Route path={`/${name}s-team.someday.com/boards/:boardId`} element={<MondayIndex isBoard={true} />} />
            <Route path={`/${name}s-team.someday.com/board`} element={<MondayIndex />} />
          </Routes>
        )}
      </Router>
    </div>
  );
}

export default App;
