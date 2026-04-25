const RoomChat = require("../../models/rooms-chat.model");

module.exports.isAccess = async (req, res, next) => {
  const roomChatId = req.params.roomChatId;
  const userId = res.locals.userInfo.id;

  const existUserInRoomChat = await RoomChat.findOne({
    _id: roomChatId,
    "users.user_id": userId,
    delete: false,
  });

  if (!existUserInRoomChat) {
    res.redirect("/");
  } else {
    next();
  }
};
