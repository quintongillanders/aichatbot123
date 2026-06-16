import { useState } from "react";
import "./Chat.css";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: input,
      role: "user"
    };

    setMessages([...messages, newMessage]);
    setInput("");
  };

  return (
  <div className="chat">
    <div className="chat-box">

      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.role}`}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="inputBar">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />

        <button onClick={sendMessage}>Send</button>
      </div>

    </div>
  </div>

);

}