module.exports.createPost = (req, res, next) => {
  if (!req.body.title) {
    req.flash("error", "Vui lòng nhập tiêu đề sản phẩm");
    res.redirect(req.get("Referrer") || "/admin/products/create");
    return;
  }

  if (!req.body.price) {
    req.flash("error", "Vui lòng nhập giá sản phẩm");
    res.redirect(req.get("Referrer") || "/admin/products/create");
    return;
  }

  next();
};
