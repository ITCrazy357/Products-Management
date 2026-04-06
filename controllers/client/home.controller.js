const Product = require("../../models/product.model");
const productHelper = require("../../helpers/products");
//[GET] /
module.exports.index = async (req, res) => {
  //Lấy ra sản phẩm nổi bật
  const productsFeatured = await Product.find({
    featured: 1,
    deleted: false,
    status: "active",
  }).limit(6);

  const newProducts = productHelper.priceNewProduct(productsFeatured);

  res.render("client/pages/home/index", {
    pageTitle: "Trang Chủ",
    productsFeatured: newProducts,
  });
};
