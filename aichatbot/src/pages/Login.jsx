import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    setUser({ email });
    navigate("/");
  };

  const handleGoogleLogin = () => {
    // placeholder for now (Firebase later)
    setUser({ email: "googleuser@gmail.com", name: "Google User" });
    navigate("/");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Log In</button>

        {/* 👇 Google login button */}
        <button className="google-btn" onClick={handleGoogleLogin}>
          Sign in with Google
        </button>

        <p>
          No account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}