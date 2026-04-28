const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const RoomChat = require("../../models/rooms-chat.model");

const chatSocket = require("../../sockets/client/chat.socket");

//[GET] /chat/:roomChatId
module.exports.index = async (req, res) => {
  const roomChatId = req.params.roomChatId;
  //socketIO
  chatSocket(req, res);
  //Lấy data từ db
  const chats = await Chat.find({
    room_chat_id: roomChatId,
    deleted: false,
  }).limit(10);
  for (const chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.user_id,
    }).select("fullname");
    chat.infoUser = infoUser;
  }

  const roomChat = await RoomChat.findOne({
    _id: roomChatId,
  });

  if (roomChat.typeRoom === "friend") {
    const friend = roomChat.users.find(
      (user) => user.user_id != res.locals.userInfo.id,
    );
    const infoUser = await User.findOne({
      _id: friend.user_id,
    }).select("fullname");
    roomChat.infoUser = infoUser;
  }

  res.render("client/pages/chats/index", {
    pageTitle: "Chat",
    chats: chats,
    roomChat: roomChat,
  });
};
