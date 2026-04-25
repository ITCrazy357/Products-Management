const uploadToCloudinary = require("../../helpers/uploadToCloudinary");
const Chat = require("../../models/chat.model");

module.exports = (req, res) => {
  const userId = res.locals.userInfo.id;
  const fullName = res.locals.userInfo.fullname;
  const roomChatId = req.params.roomChatId;

  _io.once("connection", (socket) => {
    socket.join(roomChatId);

    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      let images = [];

      if (data.images) {
        for (const imageBuffer of data.images) {
          const link = await uploadToCloudinary(imageBuffer);
          images.push(link);
        }
      }

      //lưu vào db
      const chat = new Chat({
        user_id: userId,
        content: data.content,
        images: images,
        room_chat_id: roomChatId,
      });
      await chat.save();
      //Trả data về client
      _io.to(roomChatId).emit("SERVER_RETURN_MESSAGE", {
        _id: chat._id,
        user_id: userId,
        fullname: fullName,
        content: data.content,
        images: images,
      });
    });

    //typing
    socket.on("CLIENT_SEND_TYPING", async (type) => {
      socket.broadcast.to(roomChatId).emit("SERVER_RETURN_TYPING", {
        user_id: userId,
        fullname: fullName,
        type: type,
      });
    });
    //END typing

    //======XÓA MESSAGE====//
    // Xóa tin nhắn (toàn bộ)
    socket.on("CLIENT_SEND_DELETE_MESSAGE", async (messageId) => {
      const chat = await Chat.findOne({
        _id: messageId,
      });
      if (chat && chat.user_id == userId) {
        await Chat.deleteOne({
          _id: messageId,
        });
        _io.emit("SERVER_RETURN_DELETE_MESSAGE", messageId);
      }
    });

    // XÓA TỪNG ẢNH
    socket.on("CLIENT_SEND_DELETE_IMAGE", async (data) => {
      const chat = await Chat.findOne({
        _id: data._id,
      });
      if (chat && chat.user_id == userId) {
        await Chat.updateOne(
          {
            _id: data._id,
          },
          {
            $pull: { images: data.image },
          },
        );
        _io.emit("SERVER_RETURN_DELETE_IMAGE", {
          _id: data._id,
          image: data.image,
        });

        // Nếu tin nhắn không còn text và cũng bị xóa sạch ảnh thì xóa hẳn block tin nhắn đó
        const updateChat = await Chat.findOne({
          _id: data._id,
        });
        if (
          updateChat &&
          !updateChat.content &&
          updateChat.images.length === 0
        ) {
          await Chat.deleteOne({
            _id: data._id,
          });
          _io.emit("SERVER_RETURN_DELETE_MESSAGE", data._id);
        }
      }
    });
  });
};
