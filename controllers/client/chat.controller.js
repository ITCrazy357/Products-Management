//[GET] /chat/
module.exports.index = async (req, res) => {
  _io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
  });
  res.render("client/pages/chats/index", {
    pageTitle: "Chat",
  });
};
