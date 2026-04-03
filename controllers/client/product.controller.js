const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const createTreeHelper = require("../../helpers/createTree");
//[GET] / product
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });

  const newProducts = products.map((item) => {
    item.priceNew = (
      (item.price * (100 - item.discountPercentage)) /
      100
    ).toFixed(0);
    return item;
  });

  const productCategory = await ProductCategory.find({
    deleted: false
  });
  const newProductCategory = createTreeHelper.createTree(productCategory);

  res.render("client/pages/products/index", {
    products: newProducts,
    pageTitle: "Danh Sách Sản Phẩm",
    layoutProductCategory: newProductCategory
  });
};

//[GET] / product/:slug
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slug,
      status: "active",
    };

    const product = await Product.findOne(find);

    if(product) {
      product.priceNew = (
        (product.price * (100 - product.discountPercentage)) /
        100
      ).toFixed(0);
    }

    const productCategory = await ProductCategory.find({
      deleted: false
    });
    const newProductCategory = createTreeHelper.createTree(productCategory);

    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product,
      layoutProductCategory: newProductCategory
    });
  } catch (error) {
    res.redirect("/products");
  }
};
