import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSocket } from "../socket";
import "./chat.css";

export default function Chat() {
  const nav = useNavigate();
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const me = localStorage.getItem("me");
  useEffect(() => {
    fetch("http://localhost:3000/api/users", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data.filter((u) => u.username !== me));
        }
      });
  }, []);

  // socket
  useEffect(() => {
    const s = createSocket();
    setSocket(s);

    s.on("receive_private_message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => s.disconnect();
  }, []);

  const send = () => {
    if (!message || !selectedUser) return;

    socket.emit("private_message", {
      to: selectedUser,
      message,
    });

    setChat((prev) => [...prev, { from: me, message }]);
    setMessage("");
  };

  const logout = () => {
    localStorage.clear();
    nav("/login");
  };

  return (
    <div className="chat-layout">

   
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>{me}</h3>
          <button onClick={logout}>Logout</button>
        </div>

        <div className="user-list">
          {users.map((u) => (
            <div
              key={u._id}
              className={`user ${u.username === selectedUser ? "active" : ""}`}
              onClick={() => {
                setSelectedUser(u.username);
                setChat([]);
              }}
            >
              <div className="avatar">
                {u.username.charAt(0).toUpperCase()}
              </div>
              <span>{u.username}</span>
            </div>
          ))}
        </div>
      </div>

   
      <div className="chat-window">
        <div className="chat-header">
          {selectedUser ? `Chat with ${selectedUser}` : "Select a user"}
        </div>

        <div className="messages">
          {chat.map((m, i) => (
            <div
              key={i}
              className={`msg ${m.from === me ? "me" : "other"}`}
            >
              {m.message}
            </div>
          ))}
        </div>

        {selectedUser && (
          <div className="input-area">
            <input
              value={message}
              placeholder="Type message..."
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button onClick={send}>Send</button>
          </div>
        )}
      </div>
    </div>
  );
}
