module.exports.loginPost = (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", "Vui lòng nhập email");
    res.redirect(req.get("Referrer") || "/admin/accounts/create");
    return;
  }

  if (!req.body.password) {
    req.flash("error", "Vui lòng nhập mât khẩu");
    res.redirect(req.get("Referrer") || "/admin/accounts/create");
    return;
  }

  next();
};
