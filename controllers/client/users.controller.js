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
  const friendList = myUser.friendList.map((item) => item.user_id);

  const user = await User.find({
    $and: [
      {
        _id: { $ne: userId },
      },
      { _id: { $nin: requestFriends } },
      { _id: { $nin: acceptFriends } },
      { _id: { $nin: friendList } },
    ],
    status: "active",
    deleted: false,
  }).select("id avatar fullname");

  res.render("client/pages/users/not-friend", {
    pageTitle: "Danh sách người dùng",
    users: user,
  });
};

// [GET] /users/request
module.exports.request = async (req, res) => {
  userSocket(res);
  const userId = res.locals.user.id;

  const myUser = await User.findOne({
    _id: userId,
  });

  const requestFriends = myUser.requestFriends;
  const acceptFriends = myUser.acceptFriends;

  const user = await User.find({
    _id: { $in: requestFriends },
    status: "active",
    deleted: false,
  }).select("id avatar fullname");

  res.render("client/pages/users/request-friend", {
    pageTitle: "Danh sách người dùng",
    users: user,
  });
};

//[GET] /users/accept
module.exports.accept = async (req, res) => {
  userSocket(res);
  const userId = res.locals.user.id;

  const myUser = await User.findOne({
    _id: userId,
  });

  const acceptFriends = myUser.acceptFriends;

  const user = await User.find({
    _id: { $in: acceptFriends },
    status: "active",
    deleted: false,
  }).select("id avatar fullname");

  res.render("client/pages/users/accept-friend", {
    pageTitle: "Danh sách người dùng",
    users: user,
  });
};

//[GET] /users/friends
module.exports.friend = async (req, res) => {
  userSocket(res);

  const userId = res.locals.user.id;

  const myUser = await User.findOne({
    _id: userId,
  });

  const friendList = myUser.friendList;
  const friendListId = friendList.map((item) => item.user_id);

  const user = await User.find({
    _id: { $in: friendListId },
    status: "active",
    deleted: false,
  }).select("id avatar fullname statusOnline lastOnline");

  res.render("client/pages/users/friends", {
    pageTitle: "Danh sách bạn bè",
    users: user,
  });
};
