import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:4000";

const CloseFriends = () => {
  const token = localStorage.getItem("token");
  const [followers, setFollowers] = useState([]);
  const [closeFriends, setCloseFriends] = useState(new Set());

  // 🔹 fetch followers
  useEffect(() => {
    axios
      .get(`${API}/me`, {
        headers: { Authorization: token },
      })
      .then((res) => {
        setFollowers(res.data.followers || []);
        setCloseFriends(new Set(res.data.closeFriends || []));
      });
  }, []);

  // ⭐ add/remove close friend
  const toggleCloseFriend = async (userId) => {
    const isClose = closeFriends.has(userId);

    if (isClose) {
      await axios.delete(`${API}/close-friend/${userId}`, {
        headers: { Authorization: token },
      });
      closeFriends.delete(userId);
    } else {
      await axios.post(
        `${API}/close-friend/${userId}`,
        {},
        { headers: { Authorization: token } }
      );
      closeFriends.add(userId);
    }

    setCloseFriends(new Set(closeFriends));
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className="text-xl font-semibold mb-4">⭐ Close Friends</h2>

      {followers.map((u) => (
        <div
          key={u._id}
          className="flex justify-between items-center py-3 border-b border-gray-700"
        >
          <span>{u.name}</span>

          <button
            onClick={() => toggleCloseFriend(u._id)}
            className={`px-3 py-1 text-sm rounded ${
              closeFriends.has(u._id)
                ? "bg-green-500"
                : "bg-gray-700"
            }`}
          >
            {closeFriends.has(u._id) ? "Close Friend" : "Add"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default CloseFriends;
