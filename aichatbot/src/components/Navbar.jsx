export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <h2 className="logo">PenPals AI</h2>
      </div>

      <div className="nav-right">
        <button className="login-btn">Log In</button>
        <button className="signup-btn">Sign Up</button>
      </div>
    </nav>
  );
}