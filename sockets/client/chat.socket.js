const uploadToCloudinary = require("../../helpers/uploadToCloudinary");
const Chat = require("../../models/chat.model");

module.exports = (res) => {
  const userId = res.locals.userInfo.id;
  const fullName = res.locals.userInfo.fullname;

  _io.once("connection", (socket) => {
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
      });
      await chat.save();
      //Trả data về client
      _io.emit("SERVER_RETURN_MESSAGE", {
        user_id: userId,
        fullname: fullName,
        content: data.content,
        images: images,
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
};
