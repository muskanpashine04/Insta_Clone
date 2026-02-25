const { Server } = require("socket.io");
const Message = require("./Message");

const onlineUsers = new Map();


// {id-> 1 , name:2}
// onlineUsers.get(id)

module.exports = function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // 🔹 SAME EVENT NAME AS FRONTEND
    socket.on("join", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log("Online users:", onlineUsers);
    });

    socket.on("sendMessage", async ({ sender, receiver, text }) => {
      if (!sender || !receiver || !text) return;

      const msg = await Message.create({
        sender,
        receiver,
        text,
      });

      const receiverSocketId = onlineUsers.get(receiver);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", msg);
      }
    });
    // {
    //   id:1,idx:2
    // }

    socket.on("disconnect", () => {

      for(let  data of onlineUsers){
        
        let userId=data[0];
        let sId=data[1];
           if (sId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }

      }

      // for (let [userId, sId] of onlineUsers) {
      //   if (sId === socket.id) {
      //     onlineUsers.delete(userId);
      //     break;
      //   }
      // }
      console.log("Socket disconnected:", socket.id);
    });
  });
};

                          
           //10pm                    ("hii")                    10.50pm
    // A(anu didi)  ----->>  (server)+db  // 200km      <---- B(rimi)
                                //("byee")

                                //60*60*24=3600*24=86400 no of req in one day
                                //100*86400



// let online= {
//   id:1,
//   name:"heheh"
// }
// {id,name}=online