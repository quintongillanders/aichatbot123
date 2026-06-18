import Chat from "./Chat";
import "./App.css";

import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LanguageIcon from "@mui/icons-material/Language";

function App() {
  return (
    <div className="app">
      <h1>My first AI Chatbot</h1>

      <div className="chat-wrapper">
        <Chat />
      </div>

      <footer className="footer">
        <p>Built by Quinton Gillanders</p>

        <div className="socials">
          <a
            href="https://github.com/quintongillanders"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon fontSize="large" />
          </a>

          <a
            href="https://www.linkedin.com/in/quinton-gillanders-335985297/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedInIcon fontSize="large" />
          </a>

          <a
            href="https://quinton-portfolio-nine.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Portfolio"
          >
            <LanguageIcon fontSize="large" />
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;