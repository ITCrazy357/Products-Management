const User = require("../../models/user.model");
const userSocket = require("../../sockets/client/users.socket");

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
  userSocket(res);

  const userId = res.locals.user.id;

  const myUser = await User.findOne({
    _id: userId,
  });

  const requestFriends = myUser.requestFriends;
  const acceptFriends = myUser.acceptFriends;

  const user = await User.find({
    $and: [
      {
        _id: { $ne: userId },
      },
      { _id: { $nin: requestFriends } },
      { _id: { $nin: acceptFriends } },
    ],
    status: "active",
    deleted: false,
  }).select("id avatar fullname");

  res.render("client/pages/users/not-friend", {
    pageTitle: "Danh sách người dùng",
    users: user,
  });
};
