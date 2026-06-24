import Chat from "./Chat";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Navbar />

      <div className="chat-wrapper" id="chat">
        <Chat />
      </div>

      <footer className="footer">
        <p>
          Built by Quinton Gillanders - QuinC AI All Rights Reserved 2026
        </p>
      </footer>
    </div>
  );
}

export default App;