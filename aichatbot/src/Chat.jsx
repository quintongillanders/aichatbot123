import { useState, useRef, useEffect } from "react";
import "./Chat.css";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [thinkingText, setThinkingText] = useState("");

  const messagesEndRef = useRef(null);

  const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

      const randomDelay = (min, max) =>
        Math.floor(Math.random() * (max - min + 1)) + min;

      const getThinkingSteps = (message) => {
        const text = message.toLowerCase().trim();

        // Greetings
        if (
          ["hi", "hello", "hey", "yo", "sup", "good morning", "good afternoon"].includes(text)
        ) {
          return [
            "✓ Detecting greeting...",
            "✓ Choosing friendly response...",
            "✓ Writing reply...",
            "✓ Done"
          ];
        }

        // Programming
        if (
          text.includes("code") ||
          text.includes("react") ||
          text.includes("javascript") ||
          text.includes("html") ||
          text.includes("css") ||
          text.includes("bug")
        ) {
          return [
            "✓ Reading code...",
            "✓ Looking for issues...",
            "✓ Generating solution...",
            "✓ Writing explanation...",
            "✓ Done"
          ];
        }

        // AI
        if (
          text.includes("ai") ||
          text.includes("chatbot") ||
          text.includes("llm")
        ) {
          return [
            "✓ Understanding AI topic...",
            "✓ Reviewing available knowledge...",
            "✓ Formulating response...",
            "✓ Done"
          ];
        }

        // Jokes
        if (
          text.includes("joke") ||
          text.includes("funny")
        ) {
          return [
            "✓ Understanding request...",
            "✓ Finding suitable joke...",
            "✓ Preparing response...",
            "✓ Done"
          ];
        }

        // Who / What
        if (
          text.startsWith("who is") ||
          text.startsWith("what is")
        ) {
          return [
            "✓ Identifying topic...",
            "✓ Gathering information...",
            "✓ Preparing explanation...",
            "✓ Done"
          ];
        }

        // Default
        return [
          "✓ Thinking about how to respond...",
          "✓ Writing Reply...",
          "✓ Done"
        ];
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
              content:
                "You are a helpful AI assistant. Use web info when provided and explain things clearly in a natural, friendly way. Respond to questions accordingly and keep things short and relaxed.",
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
            const steps = getThinkingSteps(input);

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
            onChange={(e) =>
              setInput(e.target.value)
            }
            placeholder="Type a message..."
            onKeyDown={(e) =>
              e.key === "Enter" &&
              sendMessage()
            }
          />

          <button onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}