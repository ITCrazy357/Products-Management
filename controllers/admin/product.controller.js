const Product = require("../../models/product.model");
const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const createTreeHelper = require("../../helpers/createTree");
const ProductCategory = require("../../models/product-category.model");

// [GET] /admin/products
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);
  let find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }
  // Tìm kiếm
  const objectSearch = searchHelper(req.query);

  // console.log(objectSearch);

  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  //Pagination
  const countProduct = await Product.countDocuments(find);
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4,
    },
    req.query,
    countProduct,
  );

  //sort
  let sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  //END sort

  const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  for (const product of products) {
    //Lấy ra tên người tạo
    if (product.createdBy && product.createdBy.account_id) {
      const user = await Account.findOne({
        _id: product.createdBy.account_id,
      });
      if (user) {
        product.creatorFullName = user.fullname;
      }
    }
    //Lấy ra tên người cập nhật cuối cùng
    if (product.updatedBy && product.updatedBy.length > 0) {
      const updatedBy = product.updatedBy[product.updatedBy.length - 1];
      const userUpdated = await Account.findOne({
        _id: updatedBy.account_id,
      });
      if (userUpdated) {
        product.updaterFullName = userUpdated.fullname;
      }
    }
  }

  res.render("admin/pages/products/index", {
    pageTitle: "Danh Sách Sản Phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  const updateBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };

  await Product.updateOne({ _id: id }, { status: status, $push: { updatedBy: updateBy } });
  req.flash("success", "Cập nhật trạng thái thành công!");
  res.redirect(req.get("Referrer") || "/admin/products");
};

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  const updateBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };

  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active", $push: { updatedBy: updateBy } });
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`,
      );
      break;

    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive", $push: { updatedBy: updateBy } });
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`,
      );
      break;

    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        { deleted: true, deletedAt: new Date(), $push: { updatedBy: updateBy } },
      );
      const remainingProducts = await Product.find({ deleted: false }).sort({
        position: "asc",
      });
      for (let i = 0; i < remainingProducts.length; i++) {
        await Product.updateOne(
          { _id: remainingProducts[i]._id },
          { position: i + 1 },
        );
      }
      req.flash("success", `Xóa thành công ${ids.length} sản phẩm!`);
      break;

    case "restore-all":
      let currentProductCount = await Product.countDocuments({
        deleted: false,
      });
      for (const itemId of ids) {
        currentProductCount++;
        await Product.updateOne(
          { _id: itemId },
          {
            deleted: false,
            deletedAt: null,
            position: currentProductCount,
          },
        );
      }
      req.flash("success", `Khôi phục thành công ${ids.length} sản phẩm!`);
      break;

    case "delete-permanent":
      await Product.deleteMany({ _id: { $in: ids } });
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`,
      );
      break;

    case "change-position":
      // console.log(ids);
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        // console.log(id)
        // console.log(position)
        await Product.updateOne({ _id: id }, { position: position });
        req.flash(
          "success",
          `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`,
        );
      }
      break;

    default:
      break;
  }

  res.redirect(req.get("Referrer") || "/admin/products/trash");
};

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  const item = await Product.findOne({ _id: id });

  await Product.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedAt: new Date(),
      deletedBy: {
        account_id: res.locals.user.id,
        deletedAt: new Date(),
      },
    },
  );

  if (item) {
    await Product.updateMany(
      {
        deleted: false,
        position: { $gt: item.position },
      },
      { $inc: { position: -1 } },
    );
  }

  res.redirect(req.get("Referrer") || "/admin/products");
};

// [GET] /admin/products/trash
module.exports.trash = async (req, res) => {
  let find = {
    deleted: true,
  };

  const countProduct = await Product.countDocuments(find);

  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4,
    },
    req.query,
    countProduct,
  );

  const products = await Product.find(find)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);
  for (const product of products) {
    const user = await Account.findOne({
      _id: product.deletedBy.account_id,
    });
    if (user) {
      product.accountFullName = user.fullname;
    }
  }

  res.render("admin/pages/products/trash", {
    pageTitle: "Sản phẩm đã xóa",
    products: products,
    pagination: objectPagination,
  });
};

// [PATCH] /admin/products/restore/:id
module.exports.restoreItem = async (req, res) => {
  const id = req.params.id;
  const count = await Product.countDocuments({ deleted: false });

  await Product.updateOne(
    { _id: id },
    {
      deleted: false,
      deletedAt: null,
      position: count + 1,
    },
  );

  res.redirect(req.get("Referrer") || "/admin/products/trash");
};

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const category = await ProductCategory.find(find);
  const newCategory = createTreeHelper.createTree(category);

  res.render("admin/pages/products/create", {
    pageTitle: "Thêm mới sản phẩm",
    category: newCategory,
  });
};

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if (req.body.position == "") {
    const countProducts = await Product.countDocuments({ deleted: false });
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  req.body.createdBy = {
    account_id: res.locals.user.id,
  };

  const product = new Product(req.body);
  await product.save();

  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const find = {
      deleted: false,
      _id: id,
    };
    const product = await Product.findOne(find);

    const category = await ProductCategory.find({ deleted: false });
    const newCategory = createTreeHelper.createTree(category);

    res.render("admin/pages/products/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product,
      category: newCategory,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  req.body.product_category_id = req.body.product_category_id || "";
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);


  try {
    const updateBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };

    await Product.updateOne(
      { _id: req.params.id },
      {
        ...req.body,
        $push: { updatedBy: updateBy},
      },
    );
    req.flash("success", "Cập nhật sản phẩm thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật sản phẩm thất bại!");
  }
  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const product = await Product.findOne(find);

    res.render("admin/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};
