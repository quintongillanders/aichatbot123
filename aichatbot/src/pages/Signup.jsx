import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = () => {
    // fake signup auth
    setUser({ email });
    navigate("/");
  };

  const handleGoogleSignup = () => {
    // placeholder for Google auth (Firebase later)
    setUser({ email: "googleuser@gmail.com", name: "Google User" });
    navigate("/");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Sign Up</h2>

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

        <button onClick={handleSignup}>Create Account</button>

        {/* 👇 Google signup button */}
        <button className="google-btn" onClick={handleGoogleSignup}>
          Sign up with Google
        </button>

        <p>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}