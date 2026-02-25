

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:4000");

// const ChatWindow = ({ selectedUser }) => {
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");

//   const token = localStorage.getItem("token");
//   const me = JSON.parse(atob(token.split(".")[1])); // jwt payload

//   // join socket
//   useEffect(() => {
//     socket.emit("join", me._id);
//   }, []);

//   // load old messages
//   useEffect(() => {
//     const loadMessages = async () => {
//       const res = await axios.get(
//         `http://localhost:4000/chat/${selectedUser._id}`,
//         { headers: { Authorization: token } }
//       );
//       setMessages(res.data);
//     };
//     loadMessages();
//   }, [selectedUser]);

//   // receive realtime
//   useEffect(() => {
//     socket.on("receiveMessage", (msg) => {
//       setMessages((prev) => [...prev, msg]);
//     });
//     return () => socket.off("receiveMessage");
//   }, []);

//   // send message
//   const sendMessage = () => {
//     if (!message.trim()) return;

//     socket.emit("sendMessage", {
//       sender: me._id,
//       receiver: selectedUser._id,
//       text: message,
//     });

//     setMessage("");
//   };

//   return (
//     <div className="h-full flex flex-col">

//       {/* HEADER */}
//       <div className="h-[60px] border-b border-zinc-800 flex items-center gap-3 px-4">
//         <img
//           src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${selectedUser.name}`}
//           className="w-9 h-9 rounded-full"
//         />
//         <p className="font-semibold">{selectedUser.name}</p>
//       </div>

//       {/* MESSAGES */}
//       <div className="flex-1 p-4 overflow-y-auto space-y-2">

//         {messages.map((msg, i) => {
//           const isMe = msg.sender._id === me._id || msg.sender === me._id;

//           return (
//             <div
//               key={i}
//               className={`flex ${isMe ? "justify-end" : "justify-start"}`}
//             >
//               {!isMe && (
//                 <img
//                   src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${msg.sender.name}`}
//                   className="w-7 h-7 rounded-full mr-2 mt-1"
//                 />
//               )}

//               <div
//                 className={`max-w-[65%] px-4 py-2 rounded-2xl text-sm
//                   ${
//                     isMe
//                       ? "bg-blue-500 text-white rounded-br-none"
//                       : "bg-zinc-800 text-white rounded-bl-none"
//                   }
//                 `}
//               >
//                 {!isMe && (
//                   <p className="text-xs text-gray-400 mb-1">
//                     {msg.sender.name}
//                   </p>
//                 )}
//                 {msg.text}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* INPUT */}
//       <div className="h-[60px] border-t border-zinc-800 flex items-center px-4 gap-2">
//         <input
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Message..."
//           className="flex-1 bg-zinc-900 rounded-full px-4 py-2 text-sm outline-none"
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//         />
//         <button onClick={sendMessage} className="text-blue-500 font-semibold">
//           Send
//         </button>
//       </div>

//     </div>
//   );
// };

// export default ChatWindow;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

/* 🕒 TIME FORMATTER */
const formatTime = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ChatWindow = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const me = JSON.parse(atob(token.split(".")[1])); // jwt payload

  // 🔹 join socket
  useEffect(() => {
    socket.emit("join", me._id);
  }, []);

  // 🔹 load old messages
  useEffect(() => {
    const loadMessages = async () => {
      const res = await axios.get(
        `http://localhost:4000/chat/${selectedUser._id}`,
        { headers: { Authorization: token } }
      );
      setMessages(res.data);
    };
    loadMessages();
  }, [selectedUser]);

  // 🔹 receive realtime message
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  // 🔹 send message
  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("sendMessage", {
      sender: me._id,
      receiver: selectedUser._id,
      text: message,
    });

    // optimistic UI
    setMessages((prev) => [
      ...prev,
      {
        sender: me._id,
        text: message,
        createdAt: new Date(),
      },
    ]);

    setMessage("");
  };

  return (
    <div className="h-full flex flex-col bg-black">

      {/* HEADER */}
      <div className="h-[60px] border-b border-zinc-800 flex items-center gap-3 px-4">
        <img
          src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${selectedUser.name}`}
          className="w-9 h-9 rounded-full"
          alt=""
        />
        <p className="font-semibold">{selectedUser.name}</p>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.map((msg, i) => {
          const isMe =
            msg.sender === me._id || msg.sender?._id === me._id;
            
          return (
            <div
              key={i}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              {/* LEFT AVATAR */}
              {!isMe && (
                <img
                  src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${msg.sender?.name || "user"}`}
                  className="w-7 h-7 rounded-full mr-2 mt-1"
                  alt=""
                />
              )}

              {/* MESSAGE BUBBLE */}
              <div
                className={`max-w-[65%] px-4 py-2 rounded-2xl text-sm
                  ${
                    isMe
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-zinc-800 text-white rounded-bl-none"
                  }
                `}
              >
                {/* NAME (ONLY LEFT SIDE) */}
                {!isMe && msg.sender?.name && (
                  <p className="text-xs text-gray-400 mb-1">
                    {msg.sender.name}
                  </p>
                )}

                <p>{msg.text}</p>

                {/* TIME */}
                <p
                  className={`text-[10px] mt-1 text-right opacity-70 ${
                    isMe ? "text-white" : "text-gray-300"
                  }`}
                >
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* INPUT */}
      <div className="h-[60px] border-t border-zinc-800 flex items-center px-4 gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message..."
          className="flex-1 bg-zinc-900 rounded-full px-4 py-2 text-sm outline-none"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="text-blue-500 font-semibold"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;


// Frontend
//    |
//    | io("localhost:4000")
//    |
// Server connected
//    |
//    | emit("join", userId)
//    |
// User online registered
//    |
// User sends message
//    |
// emit("sendMessage")
//    |
// Server saves + checks online
//    |
// emit("receiveMessage")
//    |
// Frontend listens & shows msg
