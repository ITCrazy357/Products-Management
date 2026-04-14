const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

//[GET] /chat/
module.exports.index = async (req, res) => {
  const userId = res.locals.userInfo.id;
  const fullName = res.locals.userInfo.fullname;

  //socketIO
  _io.once("connection", (socket) => {
    socket.on("CLIENT_SEND_MESSAGE", async (content) => {
      //lưu vào db
      const chat = new Chat({
        user_id: userId,
        content: content,
      });
      await chat.save();

      //Trả data về client
      _io.emit("SERVER_RETURN_MESSAGE", {
        user_id: userId,
        fullname: fullName,
        content: content,
      });
    });

    //typing
    socket.on("CLIENT_SEND_TYPING", async (type) => {
      socket.broadcast.emit("SERVER_RETURN_TYPING", {
        user_id: userId,
        fullname: fullName,
        type: type,
      });
    });
    //END typing
  });

  //Lấy data từ db
  const chats = await Chat.find({
    deleted: false,
  }).limit(10);
  for (const chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.user_id,
    }).select("fullname");
    chat.infoUser = infoUser;
  }

  res.render("client/pages/chats/index", {
    pageTitle: "Chat",
    chats: chats,
  });
};
