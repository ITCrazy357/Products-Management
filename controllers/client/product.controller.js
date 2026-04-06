const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const createTreeHelper = require("../../helpers/createTree");
const productHelper = require("../../helpers/products");
const productCategoryHelper = require("../../helpers/product-category");
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });

  const newProducts = productHelper.priceNewProduct(products);

  res.render("client/pages/products/index", {
    pageTitle: "Danh Sách Sản Phẩm",
    products: newProducts,
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

    if (product) {
      product.priceNew = (
        (product.price * (100 - product.discountPercentage)) /
        100
      ).toFixed(0);
    }

    const productCategory = await ProductCategory.find({
      deleted: false,
    });
    const newProductCategory = createTreeHelper.createTree(productCategory);

    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product,
      layoutProductCategory: newProductCategory,
    });
  } catch (error) {
    res.redirect("/products");
  }
};

//[GET] / product/:slugCategoty
module.exports.category = async (req, res) => {
  try {
    const category = await ProductCategory.findOne({
      slug: req.params.slugCategoty,
      deleted: false,
    });

    const listSubCategory = await getSubCategory(category.id);

    const listSubCategoryId = listSubCategory.map((item) => item.id);

    const products = await Product.find({
      product_category_id: { $in: [category.id, ...listSubCategoryId] },
      deleted: false,
      status: "active",
    }).sort({ position: "desc" });

    const newProducts = productHelper.priceNewProduct(products);
    res.render("client/pages/products/index", {
      pageTitle: category.title,
      products: newProducts,
    });
  } catch (error) {
    res.redirect("/products");
  }
};
