const Account = require("../../models/account.model");
const md5 = require("md5");
const systemConfig = require("../../config/system");

//[GET] /admin/auth/login
module.exports.requireAuth = (req, res, next) => {
  if (!req.cookies.token) {
    return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  } else {
    const user = Account.findOne({ token: req.cookies.token, deleted: false });
    if (!user) {
      return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    } else next();
  }
  
};
