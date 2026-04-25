const User = require("../../models/user.model");
const RoomChat = require("../../models/rooms-chat.model");

module.exports = (res) => {
  _io.once("connection", (socket) => {
    //Chức năng gửi yêu cầu kết bạn
    socket.on("CLIENT_ADD_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;
      // Thêm id của A vào acceptFriends của B
      const existIdAinB = await User.findOne({
        _id: userId,
        acceptFriends: myUserId,
      });
      if (!existIdAinB) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $push: { acceptFriends: myUserId },
          },
        );
      }
      // Thêm id của B vào requestFriends của A
      const existIdBinA = await User.findOne({
        _id: myUserId,
        requestFriends: userId,
      });
      if (!existIdBinA) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $push: { requestFriends: userId },
          },
        );
      }

      //Lấy ra độ dài acceptFriends của B và trả về cho B
      const infoUserB = await User.findOne({
        _id: userId,
      });
      const lengthAcceptFriends = infoUserB.acceptFriends.length;
      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        lengthAcceptFriends: lengthAcceptFriends,
        userId: userId,
      });

      //Lấy info của A và trả về cho B
      const infoUserA = await User.findOne({
        _id: myUserId,
      }).select("id fullname avatar");
      socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
        userId: userId,
        infoUserA: infoUserA,
      });

      //Lấy ra độ dài requestFriends của A và trả về cho A
      const infoUserA_length = await User.findOne({
        _id: myUserId,
      });
      const lengthRequestFriends = infoUserA_length.requestFriends.length;
      socket.emit("SERVER_RETURN_LENGTH_REQUEST_FRIEND", {
        lengthRequestFriends: lengthRequestFriends,
        userId: myUserId,
      });
    });
    //END Chức năng gửi yêu cầu kết bạn

    //=============================================================//

    //Chức năng hủy yêu cầu kết bạn
    socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;
      // Xóa id của A trong acceptFriends của B
      const existIdAinB = await User.findOne({
        _id: userId,
        acceptFriends: myUserId,
      });
      if (existIdAinB) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $pull: { acceptFriends: myUserId },
          },
        );
      }
      // Xóa id của B trong requestFriends của A
      const existIdBinA = await User.findOne({
        _id: myUserId,
        requestFriends: userId,
      });
      if (existIdBinA) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $pull: { requestFriends: userId },
          },
        );
      }
      //Lấy ra độ dài acceptFriends của B và trả về cho B
      const infoUserB = await User.findOne({
        _id: userId,
      });
      const lengthAcceptFriends = infoUserB.acceptFriends.length;
      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        lengthAcceptFriends: lengthAcceptFriends,
        userId: userId,
      });

      //Lấy info của A và trả về cho B
      const infoUserA = await User.findOne({
        _id: myUserId,
      }).select("id fullname avatar");

      socket.broadcast.emit("SERVER_RETURN_INFO_CANCEL_FRIEND", {
        userIdB: userId,
        userIdA: myUserId,
        infoUserA: infoUserA,
      });

      // Lấy ra độ dài requestFriends của A và trả về cho A
      const infoUserA_length = await User.findOne({
        _id: myUserId,
      });
      const lengthRequestFriends = infoUserA_length.requestFriends.length;
      socket.emit("SERVER_RETURN_LENGTH_REQUEST_FRIEND", {
        lengthRequestFriends: lengthRequestFriends,
        userId: myUserId,
      });
    });
    //END Chức năng hủy yêu cầu kết bạn

    //================================================================//

    //Lời mời kết bạn - Chức năng xóa
    socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;
      // Xóa id của A trong acceptFriends của B
      const existIdAinB = await User.findOne({
        _id: myUserId,
        acceptFriends: userId,
      });
      if (existIdAinB) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $pull: { acceptFriends: userId },
          },
        );
      }
      // Xóa id của B trong requestFriends của A
      const existIdBinA = await User.findOne({
        _id: userId,
        requestFriends: myUserId,
      });
      if (existIdBinA) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $pull: { requestFriends: myUserId },
          },
        );
      }

      // Lấy ra độ dài acceptFriends của B và trả về
      const infoUserB = await User.findOne({
        _id: myUserId,
      });
      const lengthAcceptFriends = infoUserB.acceptFriends.length;
      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        lengthAcceptFriends: lengthAcceptFriends,
        userId: myUserId,
      });

      // Trả về cho A để realtime danh sách lời mời đã gửi
      socket.broadcast.emit("SERVER_RETURN_REFUSE_FRIEND", {
        userIdA: userId,
        userIdB: myUserId,
        infoUserB: {
          _id: infoUserB._id,
          fullname: infoUserB.fullname,
          avatar: infoUserB.avatar,
        },
      });

      // Lấy ra độ dài requestFriends của A và trả về cho A
      const infoUserA_length = await User.findOne({
        _id: userId,
      });
      const lengthRequestFriends = infoUserA_length.requestFriends.length;
      socket.broadcast.emit("SERVER_RETURN_LENGTH_REQUEST_FRIEND", {
        lengthRequestFriends: lengthRequestFriends,
        userId: userId,
      });
    });
    //END Lời mời kết bạn - Chức năng xóa

    //================================================================//

    //Lời mời kết bạn - Chức năng chấp nhận
    socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      //Check
      const existIdAinB = await User.findOne({
        _id: myUserId,
        acceptFriends: userId,
      });

      const existIdBinA = await User.findOne({
        _id: userId,
        requestFriends: myUserId,
      });
      //END Check
      let roomChat;
      //Tạo phòng chat chung
      const dataRoom = {
        typeRoom: "friend",
        users: [
          {
            user_id: userId,
            role: "superAdmin",
          },
          {
            user_id: myUserId,
            role: "superAdmin",
          },
        ],
      };
      roomChat = new RoomChat(dataRoom);
      await roomChat.save();
      //END Tạo phòng chat chung

      // Xóa A khỏi accept của B và thêm vào friendList
      if (existIdAinB) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $pull: { acceptFriends: userId },
            $push: {
              friendList: { user_id: userId, room_chat_id: roomChat._id },
            },
          },
        );
      }

      // Xóa id của B trong requestFriends của A và thêm B vào listFriend
      if (existIdBinA) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $pull: { requestFriends: myUserId },
            $push: {
              friendList: { user_id: myUserId, room_chat_id: roomChat._id },
            },
          },
        );
      }

      // Lấy ra độ dài acceptFriends của B và trả về
      const infoUserB = await User.findOne({
        _id: myUserId,
      });
      const lengthAcceptFriends = infoUserB.acceptFriends.length;
      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        lengthAcceptFriends: lengthAcceptFriends,
        userId: myUserId,
      });

      // Trả về cho A để realtime danh sách lời mời đã gửi
      socket.broadcast.emit("SERVER_RETURN_ACCEPT_FRIEND", {
        userIdA: userId,
        userIdB: myUserId,
      });

      // Lấy ra độ dài requestFriends của A và trả về cho A
      const infoUserA_length = await User.findOne({
        _id: userId,
      });
      const lengthRequestFriends = infoUserA_length.requestFriends.length;
      socket.broadcast.emit("SERVER_RETURN_LENGTH_REQUEST_FRIEND", {
        lengthRequestFriends: lengthRequestFriends,
        userId: userId,
      });
    });
    //END Lời mời kết bạn - Chức năng chấp nhận
  });
};
