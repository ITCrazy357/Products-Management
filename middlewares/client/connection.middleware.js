const User = require("../../models/user.model");

// Biến toàn cục đếm số lượng kết nối (số tab đang mở) của mỗi user
if (!global.userConnections) {
  global.userConnections = {};
}

// Middleware xác thực
module.exports.connect = async (req, res, next) => {
  _io.once("connection", async (socket) => {
    if (res.locals.user) {
      const userId = res.locals.user.id;

      // Tăng biến đếm khi user mở thêm 1 tab/kết nối
      if (!global.userConnections[userId]) {
        global.userConnections[userId] = 0;
      }
      global.userConnections[userId]++;

      await User.updateOne({ _id: userId }, { statusOnline: "online" });
      _io.emit("SERVER_RETURN_USER_STATUS_ONLINE", {
        userId: userId,
        status: "online",
      });

      socket.on("disconnect", async () => {
        // Giảm biến đếm khi user đóng 1 tab
        global.userConnections[userId]--;

        // Đợi 3 giây, nếu thực sự số lượng tab <= 0 (đã tắt hết tab) thì mới Offline
        setTimeout(async () => {
          if (global.userConnections[userId] <= 0) {
            const now = new Date();
            await User.updateOne(
              { _id: userId },
              { statusOnline: "offline", lastOnline: now },
            );
            _io.emit("SERVER_RETURN_USER_STATUS_ONLINE", {
              userId: userId,
              status: "offline",
              lastOnline: now,
            });
          }
        }, 3000);
      });
    }
  });
  next();
};
