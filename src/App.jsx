import { HashRouter as Router, Routes, Route } from "react-router-dom";

import "./styles/mainStyles.scss";
import { UserMsg } from "./cmps/Usermsg";
import { Login } from "./pages/Login";
import { HomePage } from "./pages/HomePage";
import { SignUp } from "./pages/SignUp";
import { MondayIndex } from "./pages/MondayIndex";
import { useSelector } from "react-redux";

function App() {
  const loggedInUser = useSelector((state) => state.userModule.user);

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
            <Route path={`/${loggedInUser.fullName}'s-team/boards/:boardId`} element={<MondayIndex />} />
            <Route path={`/${loggedInUser.fullName}'s-team/board`} element={<MondayIndex isBoard={true} />} />
          </Routes>
        )}
      </Router>
      <UserMsg />
    </div>
  );
}

export default App;
