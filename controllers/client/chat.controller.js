module.exports.index = async (req, res) => {
  res.render("client/pages/chats/index", {
    pageTitle: "Chat",
  });
};
