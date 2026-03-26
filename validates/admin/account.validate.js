module.exports.createPost = (req, res, next) => {
  if (!req.body.fullname) {
    req.flash("error", "Vui lòng nhập họ tên");
    res.redirect(req.get("Referrer") || "/admin/accounts/create");
    return;
  }
  
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

  if (!req.body.phone) {
    req.flash("error", "Vui lòng nhập số điện thoại");
    res.redirect(req.get("Referrer") || "/admin/accounts/create");
    return;
  }
  next();
};
