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

  const newProductsFeatured = productHelper.priceNewProduct(productsFeatured);

  //Hiển thị danh sách sản phẩm mới nhất
  const productNew = await Product.find({
    deleted: false,
    status: "active",
  }).sort({position: "desc"}).limit(6);

  const newproductNew = productHelper.priceNewProduct(productNew);
  //ENd Hiển thị danh sách sản phẩm mới nhất

  res.render("client/pages/home/index", {
    pageTitle: "Trang Chủ",
    productsFeatured: newProductsFeatured,
    productNew: newproductNew,
  });
};
