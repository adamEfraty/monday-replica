import { AppHeader } from "../cmps/AppHeader";
import { Footer } from "../cmps/Footer";
import { useNavigate } from "react-router";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <AppHeader />
      <div className="hero-layout">
        <div className="hero">
          <h1>A platform for company tasks managment</h1>
        </div>
        <div>
          <button className="hero-btn" onClick={() => 
            navigate("/login")}>Login</button>
        </div>
        <p>Free use, no limit Start your own Someday!</p>
      </div>
      <Footer />
    </div>
  );
}
