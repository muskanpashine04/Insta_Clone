import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./users.css";

export default function Users() {
  const [users, setUsers] = useState([]);
  const nav = useNavigate();

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
        } else {
          setUsers([]);
        }
      });
  }, []);

  const logout = () => {
    localStorage.clear();
    nav("/login");
  };

  return (
    <div className="users-page">
      {/* header */}
      <div className="users-header">
        <h2>Chats</h2>
        <button onClick={logout}>Logout</button>
      </div>

      {/* list */}
      <div className="users-list">
        {users.map((u) => (
          <div
            key={u._id}
            className="user-item"
            onClick={() => nav(`/chat/${u.username}`)}
          >
            <div className="avatar">
              {u.username.charAt(0).toUpperCase()}
            </div>

            <div>
              <div className="name">{u.username}</div>
              <div className="status">Click to chat</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
