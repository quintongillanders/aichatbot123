import { useState, useRef, useEffect } from "react";
import "./Chat.css";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false); // 🤖 NEW

  const messagesEndRef = useRef(null);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userText = input;

    const userMessage = {
      id: Date.now(),
      text: userText,
      role: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // 🤖 SHOW TYPING INDICATOR (NEW)
    setIsTyping(true);

    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        text: getFakeReply(userText),
        role: "bot",
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false); // stop typing
    }, 1000);
  };

  // 🤖 FAKE AI BRAIN
  const getFakeReply = (message) => {
    const msg = message.toLowerCase();

    if (msg.includes("hello")) return "Hey! 👋 How can I help you?";
    if (msg.includes("how are you")) return "I'm doing great 😄 running inside React!";
    if (msg.includes("name")) return "I'm your simple AI chatbot 🤖";
    if (msg.includes("bye")) return "Goodbye! 👋";

    return "Hmm 🤔 I'm still learning!";
  };

  // auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="chat">
      <div className="chat-box">

        <div className="messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.role}`}>
              {msg.text}
            </div>
          ))}

          {/* 🤖 TYPING INDICATOR (NEW) */}
          {isTyping && (
            <div className="message bot typing">
              AI is typing...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

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