const User = require("../../models/user.model");
const md5 = require("md5");
const generate = require("../../helpers/generate");
const ForgotPassword = require("../../models/forgot-password.model");
const sendMailHelper = require("../../helpers/sendMail");
const Cart = require("../../models/cart.model");

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

  // Tìm giỏ hàng cũ của user đã lưu trong DB
  const cartUser = await Cart.findOne({
    user_id: user.id,
  });

  if (cartUser) {
    // Nếu đã có giỏ hàng từ trước -> Gắn lại ID giỏ hàng đó vào Cookie
    res.cookie("cartId", cartUser.id);

    // Xóa giỏ hàng vãng lai rác sinh ra lúc chưa đăng nhập
    if (req.cookies.cartId && req.cookies.cartId !== cartUser.id) {
      await Cart.deleteOne({ _id: req.cookies.cartId });
    }
  } else {
    // Nếu chưa có -> Gán giỏ hàng vãng lai hiện tại cho user này
    await Cart.updateOne({ _id: req.cookies.cartId }, { user_id: user.id });
  }

  res.redirect("/");
};

//[GET] /user/logout
module.exports.logout = (req, res) => {
  res.clearCookie("tokenUser");
  res.clearCookie("cartId");
  req.flash("success", "Đăng xuất thành công");
  res.redirect("/");
};

//[GET] /user/password/forgot
module.exports.forgotPassword = (req, res) => {
  res.render("client/pages/user/forgot-password", {
    pageTitle: "Quên mật khẩu",
  });
};

//[POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({
    email: email,
    deleted: false,
    status: "active",
  });

  if (!user) {
    req.flash("error", "Email không tồn tại");
    res.redirect(req.get("Referrer") || "/user/password/forgot");
    return;
  }

  if (user.status !== "active") {
    req.flash("error", "Tài khoản đã bị khóa");
    res.redirect(req.get("Referrer") || "/user/password/forgot");
    return;
  }

  //Lưu thông tin vào DB
  const otp = generate.generateRandomNumber(6);
  const objectForgotPassword = {
    email: email,
    otp: otp,
    expiresAt: new Date(Date.now() + 1 * 60 * 1000),
  };
  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();

  //Nếu tồn tại thì gửi otp qua email
  const subject = "Mã OTP xác thực đặt lại mật khẩu";
  const html = `
    Mã OTP để lấy lại mật khẩu là: <b>${otp}</b>. Thời hạn OTP là 1 phút.
  `;

  sendMailHelper.sendMail(email, subject, html);

  res.redirect("/user/password/otp?email=" + email);
};

//[GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;
  // const otp = req.query.otp;

  res.render("client/pages/user/otp-password", {
    pageTitle: "Xác thực OTP",
    email: email,
    // otp: otp,
  });
};

//[POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });

  if (!result) {
    req.flash("error", "OTP không đúng");
    res.redirect(req.get("Referrer") || "/user/password/otp");
    return;
  }

  const user = await User.findOne({
    email: email,
  });

  res.cookie("tokenUser", user.tokenUser);

  res.redirect("/user/password/reset");
};

//[GET] /user/password/reset
module.exports.resetPassword = (req, res) => {
  res.render("client/pages/user/reset-password", {
    pageTitle: "Đặt lại mật khẩu",
  });
};

// [POST] / user / password / reset;
module.exports.resetPasswordPost = async (req, res) => {
  const password = req.body.password;
  const tokenUser = req.cookies.tokenUser;

  await User.updateOne(
    {
      tokenUser: tokenUser,
    },
    {
      password: md5(password),
    },
  );

  res.clearCookie("tokenUser");
  req.flash("success", "Đặt lại mật khẩu thành công");
  res.redirect("/user/login");
};

//[GET] /user/info
module.exports.info = async (req, res) => {
  res.render("client/pages/user/info", {
    pageTitle: "Thông tin cá nhân",
  });
};

//[PATCH] /user/info
module.exports.infoPatch = async (req, res) => {
  try {
    await User.updateOne({ _id: res.locals.user.id }, req.body);
    req.flash("success", "Cập nhật thông tin thành công");
  } catch (error) {
    req.flash("error", "Cập nhật thông tin thất bại");
  }
  res.redirect("/user/info");
};

//[POST] /user/info
