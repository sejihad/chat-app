import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://chat-app-api-dusky.vercel.app");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const name = prompt("Enter your name:");
    setUsername(name);
    socket.emit("join", name);

    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("chatMessage", message);
      setMessage("");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Real-Time Chat</h2>
      <div
        className="border rounded p-3 mb-3"
        style={{ height: "300px", overflowY: "scroll" }}
      >
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="d-flex">
        <input
          className="form-control me-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
        />
        <button className="btn btn-primary" type="submit">
          Send
        </button>
      </form>
    </div>
  );
}

export default App;
