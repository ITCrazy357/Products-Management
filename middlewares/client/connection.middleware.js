const User = require("../../models/user.model");

// Middleware xác thực
module.exports.connect = async (req, res, next) => {
  _io.once("connection", async (socket) => {
    if (res.locals.user) {
      await User.updateOne(
        { _id: res.locals.user.id },
        { statusOnline: "online" },
      );
      _io.emit("SERVER_RETURN_USER_STATUS_ONLINE", {
        userId: res.locals.user.id,
        status: "online",
      });
    }
    socket.on("disconnect", async () => {
      if (res.locals.user) {
        await User.updateOne(
          { _id: res.locals.user.id },
          { statusOnline: "offline" },
        );
        _io.emit("SERVER_RETURN_USER_STATUS_ONLINE", {
          userId: res.locals.user.id,
          status: "offline",
        });
      }
    });
  });
  next();
};
