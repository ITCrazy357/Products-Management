const User = require("../../models/user.model");

// Middleware xác thực
module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.tokenUser) {
    res.redirect(`/user/login`);
  } else {
    const userInfo = await User.findOne({
      tokenUser: req.cookies.tokenUser,
    }).select("-password");
    if (!userInfo) {
      res.redirect(`/user/login`);
    } else {
      res.locals.userInfo = userInfo;
      next();
    }
  }
};
