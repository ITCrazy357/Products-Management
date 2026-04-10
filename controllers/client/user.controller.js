const User = require("../../models/user.model");
const md5 = require("md5");

//[GET] /user/register
module.exports.register = (req, res) => {
  res.render("client/pages/user/auth", {
    pageTitle: "Đăng Ký",
    activeTab: "register",
  });
};

//[POST] /user/register
module.exports.registerPost = async (req, res) => {
  const exitsEmail = await User.findOne({
    email: req.body.email,
  });

  if (exitsEmail) {
    req.flash("error", "Email đã tồn tại");
    res.redirect(req.get("Referrer") || "/user/register");
    return;
  } else {
    req.body.password = md5(req.body.password);
    const user = new User(req.body);
    await user.save();
    res.cookie("tokenUser", user.tokenUser);
    req.flash("success", "Đăng ký thành công");
    res.redirect("/");
  }
};

//[GET] /user/login
module.exports.login = (req, res) => {
  res.render("client/pages/user/auth", {
    pageTitle: "Đăng nhập",
    activeTab: "login",
  });
};

//[POST] /user/loginPost
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = md5(req.body.password);

  const user = await User.findOne({
    email: email,
    deleted: false,
    status: "active",
  });

  if (!user) {
    req.flash("error", "Email không tồn tại");
    res.redirect(req.get("Referrer") || "/user/login");
    return;
  }

  if (user.password !== password) {
    req.flash("error", "Mật khẩu không đúng");
    res.redirect(req.get("Referrer") || "/user/login");
    return;
  }

  if (user.status !== "active") {
    req.flash("error", "Tài khoản đã bị khóa");
    res.redirect(req.get("Referrer") || "/user/login");
    return;
  }

  res.cookie("tokenUser", user.tokenUser);
  req.flash("success", "Đăng nhập thành công");
  res.redirect("/");
};

//[GET] /user/logout
module.exports.logout = (req, res) => {
  res.clearCookie("tokenUser");
  req.flash("success", "Đăng xuất thành công");
  res.redirect("/");
};
