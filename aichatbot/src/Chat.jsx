import { useState, useRef, useEffect } from "react";
import "./Chat.css";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const messagesEndRef = useRef(null);

  // ✅ SEND MESSAGE + FAKE AI RESPONSE
  const sendMessage = () => {
    if (!input.trim()) return;

    const userText = input; // store before clearing

    const userMessage = {
      id: Date.now(),
      text: userText,
      role: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // 🤖 FAKE AI RESPONSE (NEW PART)
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        text: getFakeReply(userText),
        role: "bot",
      };

      setMessages((prev) => [...prev, botMessage]);
    }, 800);
  };

  // 🤖 FAKE AI BRAIN (NEW PART)
  const getFakeReply = (message) => {
    const msg = message.toLowerCase();

    if (msg.includes("hello")) return "Hey! 👋 How can I help you?";
    if (msg.includes("how are you")) return "I'm good 😄 just running in React!";
    if (msg.includes("name")) return "I'm your simple AI chatbot 🤖";
    if (msg.includes("bye")) return "Goodbye! 👋";

    return "Hmm 🤔 I'm still learning. Try something else!";
  };

  // 🔽 AUTO SCROLL (KEEP THIS)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat">
      <div className="chat-box">

        {/* MESSAGES */}
        <div className="messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.role}`}>
              {msg.text}
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div className="inputBar">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />

          <button onClick={sendMessage}>Send</button>
        </div>

      </div>
    </div>
  );
}