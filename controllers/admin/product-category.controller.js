const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
// [GET] /admin/products-category
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);

  let find = {
     deleted: false
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  // Search
  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  // Pagination
  const count = await ProductCategory.countDocuments(find);
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4,
    },
    req.query,
    count,
  );

  // Sort
  let sort = {};
  if(req.query.sortKey && req.query.sortValue){
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }

  const records = await ProductCategory.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip);

  res.render("admin/pages/product-category/index", {
    pageTitle: "Danh mục sản phẩm",
    records: records,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination
  });
};

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/product-category/create", {
    pageTitle: "Tạo danh mục sản phẩm",
  });
};

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  if (req.body.position === "") {
    const count = await ProductCategory.countDocuments();
    req.body.position = count + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  const record = new ProductCategory(req.body);
  await record.save();
  res.redirect(`${systemConfig.prefixAdmin}/product-category`)
};
