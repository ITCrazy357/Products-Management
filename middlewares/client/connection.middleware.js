const User = require("../../models/user.model");

// Biến toàn cục lưu trữ các bộ đếm thời gian
if (!global.userTimeouts) {
  global.userTimeouts = {};
}

// Middleware xác thực
module.exports.connect = async (req, res, next) => {
  _io.once("connection", async (socket) => {
    if (res.locals.user) {
      const userId = res.locals.user.id;

      // Nếu người dùng kết nối lại nhanh, hủy lệnh offline cũ
      if (global.userTimeouts[userId]) {
        clearTimeout(global.userTimeouts[userId]);
        delete global.userTimeouts[userId];
      }

      await User.updateOne({ _id: userId }, { statusOnline: "online" });
      _io.emit("SERVER_RETURN_USER_STATUS_ONLINE", {
        userId: userId,
        status: "online",
      });
    }
    socket.on("disconnect", async () => {
      if (res.locals.user) {
        const userId = res.locals.user.id;

        // Đợi 3 giây mới đánh dấu offline, tránh nhấp nháy khi f5/chuyển trang
        global.userTimeouts[userId] = setTimeout(async () => {
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
        }, 3000);
      }
    });
  });
  next();
};
