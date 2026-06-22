import { useState, useRef, useEffect } from "react";
import "./Chat.css";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [thinkingText, setThinkingText] = useState("");
  const [personality, setPersonality] = useState("friendly");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const messagesEndRef = useRef(null);

  const addSystemMessage = (text) => {
  const msg = {
    id: Date.now(),
    role: "system",
    content: text,
  };

  setMessages((prev) => [...prev, msg]);
};

  const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

      const randomDelay = (min, max) =>
        Math.floor(Math.random() * (max - min + 1)) + min;

      const getThinkingSteps = (message, personality) => {
        const text = message.toLowerCase().trim();

        // ===== GREETINGS =====
        if (
          ["hi", "hello", "hey", "yo", "sup", "good morning", "good afternoon"].includes(text)
        ) {
          return getBaseSteps(personality, "greeting");
        }

        // ===== PROGRAMMING =====
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

        // ===== AI TOPIC =====
        if (
          text.includes("ai") ||
          text.includes("chatbot") ||
          text.includes("llm")
        ) {
          return getBaseSteps(personality, "ai");
        }

        // ===== JOKES =====
        if (text.includes("joke") || text.includes("funny")) {
          return getBaseSteps(personality, "joke");
        }

        // ===== WHO / WHAT =====
        if (text.startsWith("who is") || text.startsWith("what is")) {
          return getBaseSteps(personality, "info");
        }

        // ===== DEFAULT (same for ALL modes) =====
        return [
          "✓ Thinking about how to respond...",
          "✓ Writing response...",
          "✓ Done"
        ];
      };

      const getBaseSteps = (personality, type) => {
          const base = {
            greeting: [
              "✓ Detecting greeting...",
              "✓ Choosing response...",
              "✓ Writing reply...",
              "✓ Done"
            ],

            code: [
              "✓ Reading code...",
              "✓ Looking for issues...",
              "✓ Generating solution...",
              "✓ Writing explanation...",
              "✓ Done"
            ],

            ai: [
              "✓ Understanding AI topic...",
              "✓ Reviewing knowledge...",
              "✓ Formulating response...",
              "✓ Done"
            ],

            joke: [
              "✓ Understanding request...",
              "✓ Finding suitable joke...",
              "✓ Preparing response...",
              "✓ Done"
            ],

            info: [
              "✓ Identifying topic...",
              "✓ Gathering information...",
              "✓ Preparing explanation...",
              "✓ Done"
            ],
          };

            const steps = base[type];

            // ONLY personality “flavouring”
            if (personality === "roast") {
              return steps.map((s, i) => {
                if (i === steps.length - 1) return "✓ Done (try not to regret asking this)";
                if (s.includes("Writing")) return "✓ Writing reply";
                return s;
              });
            }

            if (personality === "professional") {
              return steps;
            }

            // friendly = unchanged
            return steps;
          };


      // GET SYSTEM PROMPT
      const getSystemPrompt = (personality) => {
        switch (personality) {
          case "roast":
            return "You are a witty AI assistant that lightly roasts the user in a playful, non-offensive way. Keep it funny and short.";

          case "professional":
            return "You are a clear, professional AI assistant. Keep responses structured, helpful, and concise.";

          default:
            return "You are a friendly, helpful AI assistant. Keep responses natural, warm, and easy to read.";
        }
      };


  // 🤖 AI CHAT (GROQ + web knowledge)
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

    return (
      data?.choices?.[0]?.message?.content ||
      "No response"
    );
  };


  // SEARCH WEB
    const searchWeb = async (query) => {
    try {
      const res = await fetch(
        `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`
      );

      const data = await res.json();

      return (
        data?.AbstractText ||
        data?.RelatedTopics?.[0]?.Text ||
        ""
      );
    } catch (err) {
      return "";
    }
  };

  // 💬 SEND MESSAGE
          const sendMessage = async () => {
          if (!input.trim()) return;

          const userMessage = {
            id: Date.now(),
            role: "user",
            content: input,
          };

          const updatedMessages = [...messages, userMessage];

          setMessages(updatedMessages);
          setInput("");
          setIsTyping(true);

          try {
            const steps = getThinkingSteps(input, personality);

            let currentText = "";

            for (const step of steps) {
              currentText +=
                (currentText ? "\n" : "") + step;

              setThinkingText(currentText);

              await delay(
                randomDelay(600, 1800)
              );
            }

            await delay(
              randomDelay(500, 1500)
            );

            const botReply = await getAIResponse(
              updatedMessages
            );

            const botMessage = {
              id: Date.now() + 1,
              role: "assistant",
              content: botReply,
            };

            setMessages((prev) => [
              ...prev,
              botMessage,
            ]);
          } catch (err) {
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now() + 1,
                role: "assistant",
                content:
                  "Error connecting to AI 😢",
              },
            ]);
          }

          setThinkingText("");
          setIsTyping(false);
        };

  // 🔽 AUTO SCROLL
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
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
            
              <div className="bubble">
                {msg.content}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="message bot">
              <div
                className="bubble"
                style={{
                  whiteSpace: "pre-line",
                }}
              >
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
            onKeyDown={(e) =>
              e.key === "Enter" && sendMessage()
            }
          />

          {/* Personality dropdown */}
          <div className="personalityDropdown">
            <button
              className="dropbtn"
              onClick={() => setDropdownOpen((prev) => !prev)}
              title="Change personality"
            >
              ☰
            </button>

            {dropdownOpen && (
              <div className="dropdownContent">
                <button
                  className={personality === "friendly" ? "active" : ""}
                  onClick={() => {
                    setPersonality("friendly");
                    setDropdownOpen(false);

                    addSystemMessage("Switched to Friendly mode!")
                  }}
                >
                  Friendly
                </button>

                <button
                  className={personality === "roast" ? "active" : ""}
                  onClick={() => {
                    setPersonality("roast");
                    setDropdownOpen(false);

                    addSystemMessage("Switched to Roast mode!")
                  }}
                >
                  Roast
                </button>

                <button
                  className={personality === "professional" ? "active" : ""}
                  onClick={() => {
                    setPersonality("professional");
                    setDropdownOpen(false);

                    addSystemMessage("Switched to Professional Mode!")
                  }}
                >
                  Professional
                </button>
              </div>
            )}
            </div>

          <button onClick={sendMessage}>
            Send
          </button>

        </div>
      </div>
    </div>
  );
}