const jwt = require("jsonwebtoken");

const onlineUsers = {};
                                   
module.exports = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    try {
      const user = jwt.verify(token, "secret");
      socket.user = user;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });
     
  io.on("connection", (socket) => {
    onlineUsers[socket.user.username] = socket.id;
    abc=1

    io.emit("online_users", Object.keys(onlineUsers));

    socket.on("private_message", ({ to, message }) => {
      const targetId = onlineUsers[to];

      if (targetId) {
        io.to(targetId).emit("receive_private_message", {
          from: socket.user.username,
          message,
        });
      }
    });
     
    socket.on("disconnect", () => {
      delete onlineUsers[socket.user.username];
      io.emit("online_users", Object.keys(onlineUsers));
    });
  });
};

