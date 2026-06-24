import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Chat from "./Chat";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      {/* Navbar is always visible */}
      <Navbar user={user} setUser={setUser} />

      <Routes>
        {/* HOME / CHAT */}
        <Route
          path="/"
          element={
            <div className="app">
              <div className="chat-wrapper" id="chat">
                <Chat />
              </div>

              <footer className="footer">
                <p>
                  Built by Quinton Gillanders - QuinC AI All Rights Reserved 2026
                </p>
              </footer>
            </div>
          }
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login setUser={setUser} />}
        />

        {/* SIGNUP */}
        <Route
          path="/signup"
          element={<Signup setUser={setUser} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;