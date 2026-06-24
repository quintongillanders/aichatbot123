import { useNavigate } from "react-router-dom";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h2 className="logo" onClick={() => navigate("/")}>
          PenPals AI
        </h2>
      </div>

      <div className="nav-right">
        {!user ? (
          <>
            <button className="login-btn" onClick={handleLogin}>
              Log In
            </button>

            <button className="signup-btn" onClick={handleSignup}>
              Sign Up
            </button>
          </>
        ) : (
          <button className="logout-btn" onClick={handleLogout}>
            Log Out
          </button>
        )}
      </div>
    </nav>
  );
}