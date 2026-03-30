const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");

// Middleware xác thực
module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.token) {
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  } else {
    const user = await Account.findOne({ token: req.cookies.token });
    if (!user) {
      res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    } else {
      const role = await Role.findOne({
        _id: user.role_id,
      }).select("title permissions");

      res.locals.user = user; // Đưa thông tin user vào res.locals để có thể sử dụng trong các pug khác
      res.locals.role = role; // Đưa thông tin role vào res.locals để có thể sử dụng trong các pug khác
      next();
    }
  }
};
