import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Chat.css";

export default function Chat({ user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [thinkingText, setThinkingText] = useState("");
  const [personality, setPersonality] = useState("friendly");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
  if (!user) {
    setMessages([]);
    setMessageCount(0);
    setInput("");
    setIsTyping(false);
    setThinkingText("");
    setShowAuthPrompt(false);
  }
}, [user]);

  const addSystemMessage = (text) => {
    const msg = {
      id: Date.now(),
      role: "system",
      content: text,
    };

    setMessages((prev) => [...prev, msg]);
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const randomDelay = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const getThinkingSteps = (message, personality) => {
    const text = message.toLowerCase().trim();

    if (["hi", "hello", "hey", "yo", "sup", "good morning", "good afternoon"].includes(text)) {
      return getBaseSteps(personality, "greeting");
    }

    if (
      text.includes("code") ||
      text.includes("react") ||
      text.includes("javascript") ||
      text.includes("html") ||
      text.includes("css") ||
      text.includes("bug")
    ) {
      return getBaseSteps(personality, "code");
    }

    if (text.includes("ai") || text.includes("chatbot") || text.includes("llm")) {
      return getBaseSteps(personality, "ai");
    }

    if (text.includes("joke") || text.includes("funny")) {
      return getBaseSteps(personality, "joke");
    }

    if (text.startsWith("who is") || text.startsWith("what is")) {
      return getBaseSteps(personality, "info");
    }

    return [
      "✓ Thinking about how to respond...",
      "✓ Writing response...",
      "✓ Done",
    ];
  };

  const getBaseSteps = (personality, type) => {
    const base = {
      greeting: [
        "✓ Detecting greeting...",
        "✓ Choosing response...",
        "✓ Writing reply...",
        "✓ Done",
      ],
      code: [
        "✓ Reading code...",
        "✓ Looking for issues...",
        "✓ Generating solution...",
        "✓ Writing explanation...",
        "✓ Done",
      ],
      ai: [
        "✓ Understanding AI topic...",
        "✓ Reviewing knowledge...",
        "✓ Formulating response...",
        "✓ Done",
      ],
      joke: [
        "✓ Understanding request...",
        "✓ Finding suitable joke...",
        "✓ Preparing response...",
        "✓ Done",
      ],
      info: [
        "✓ Identifying topic...",
        "✓ Gathering information...",
        "✓ Preparing explanation...",
        "✓ Done",
      ],
    };

    const steps = base[type];

    if (personality === "roast") {
      return steps.map((s, i) => {
        if (i === steps.length - 1)
          return "✓ Done (try not to regret asking this)";
        if (s.includes("Writing")) return "✓ Writing reply";
        return s;
      });
    }

    return steps;
  };

  const getSystemPrompt = (personality) => {
    switch (personality) {
      case "roast":
        return "You are a witty AI assistant who roasts lightly. Keep responses short (2–5 sentences), fun, and human-like.";

      case "professional":
        return "You are a professional AI assistant. Be concise, structured, and keep responses under 5 sentences unless asked for detail.";

      default:
        return "You are a friendly AI assistant. Keep responses short, clear, and conversational. Use 2–5 sentences max unless the user asks for detail.";
    }
  };

  const getAIResponse = async (chatMessages) => {
    const lastMessage =
      chatMessages[chatMessages.length - 1]?.content || "";

    const webInfo = await searchWeb(lastMessage);

    const res = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          max_tokens: 180,
          temperature: 0.7,
          messages: [
            {
              role: "system",
              content: getSystemPrompt(personality),
            },
            {
              role: "system",
              content: `Web context (use if helpful): ${
                webInfo || "No web info found"
              }`,
            },
            ...chatMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          ],
        }),
      }
    );

    const data = await res.json();

    return data?.choices?.[0]?.message?.content || "No response";
  };

  const searchWeb = async (query) => {
    try {
      const res = await fetch(
        `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`
      );

      const data = await res.json();

      return data?.AbstractText || data?.RelatedTopics?.[0]?.Text || "";
    } catch (err) {
      return "";
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    // ✅ FIXED FIREBASE AUTH STATE HANDLING
    const isAuthLoading = user === undefined;
    const isLoggedIn = !!user?.uid;
    const isGuest = !isAuthLoading && !isLoggedIn;

    // 🚫 only apply limit when auth is fully known AND user is guest
    if (!isAuthLoading && isGuest && messageCount >= 3) {
      setShowAuthPrompt(true);
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // only count guest messages AFTER auth is confirmed
    if (!isAuthLoading && isGuest) {
      setMessageCount((prev) => prev + 1);
    }

    try {
      const steps = getThinkingSteps(input, personality);

      let currentText = "";

      for (const step of steps) {
        currentText += (currentText ? "\n" : "") + step;
        setThinkingText(currentText);
        await delay(randomDelay(600, 1800));
      }

      await delay(randomDelay(500, 1500));

      const botReply = await getAIResponse([...messages, userMessage]);

      const botMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: botReply,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: "Error connecting to AI 😢",
        },
      ]);
    }

    setThinkingText("");
    setIsTyping(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="chat">
      <div className="chat-box">
        <div className="messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${
                msg.role === "user"
                  ? "user"
                  : msg.role === "system"
                  ? "system"
                  : "bot"
              }`}
            >
              <div className="bubble">{msg.content}</div>
            </div>
          ))}

          {isTyping && (
            <div className="message bot">
              <div className="bubble" style={{ whiteSpace: "pre-line" }}>
                {thinkingText}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="inputBar">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button onClick={sendMessage}>Send</button>

          <div className="personalityDropdown">
            <button
              className="dropbtn"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              Personality Type
            </button>

            {dropdownOpen && (
              <div className="dropdownContent">
                <button
                  onClick={() => {
                    setPersonality("friendly");
                    setDropdownOpen(false);
                    addSystemMessage("Switched to Friendly mode!");
                  }}
                >
                  Friendly
                </button>

                <button
                  onClick={() => {
                    setPersonality("roast");
                    setDropdownOpen(false);
                    addSystemMessage("Switched to Roast mode!");
                  }}
                >
                  Roast
                </button>

                <button
                  onClick={() => {
                    setPersonality("professional");
                    setDropdownOpen(false);
                    addSystemMessage("Switched to Professional Mode!");
                  }}
                >
                  Professional
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAuthPrompt && (
        <div className="auth-popup">
          <div className="auth-box">
            <h3>Free limit reached</h3>
            <p>Sign up or log in to continue chatting</p>

            <button onClick={() => navigate("/login")}>Log In</button>
            <button onClick={() => navigate("/signup")}>Sign Up</button>
            <button onClick={() => setShowAuthPrompt(false)}>
              Continue browsing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}