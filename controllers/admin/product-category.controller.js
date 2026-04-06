const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const createTreeHelper = require("../../helpers/createTree");
// [GET] /admin/products-category
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);

  let find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  // Search
  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  // Sort
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }

  const records = await ProductCategory.find(find).sort(sort);

  const newRecords = createTreeHelper.createTree(records);

  // Làm phẳng cây để phân trang (chuyển cấu trúc cây thành mảng 1 chiều theo thứ tự)
  const flatRecords = [];
  const createTree = (arr, level = 0) => {
    arr.forEach((item) => {
      item.level = level;
      flatRecords.push(item);
      if (item.children && item.children.length > 0) {
        createTree(item.children, level + 1);
      }
    });
  };
  createTree(newRecords);

  // Pagination
  const count = flatRecords.length;
  let objectPagination = paginationHelper(
    { currentPage: 1, limitItems: 4 },
    req.query,
    count,
  );

  const paginatedRecords = flatRecords.slice(
    objectPagination.skip,
    objectPagination.skip + objectPagination.limitItems,
  );

  res.render("admin/pages/product-category/index", {
    pageTitle: "Danh mục sản phẩm",
    records: paginatedRecords,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await ProductCategory.find(find);

  const newRecords = createTreeHelper.createTree(records);

  res.render("admin/pages/product-category/create", {
    pageTitle: "Tạo danh mục sản phẩm",
    records: newRecords,
  });
};

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  const permession = res.locals.permession;
  if (permession.includes("product-category_create")) {
    if (req.body.position === "") {
      const count = await ProductCategory.countDocuments({ deleted: false });
      req.body.position = count + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    const record = new ProductCategory(req.body);
    await record.save();
    res.redirect(`${systemConfig.prefixAdmin}/product-category`);
  } else {
    return;
  }
};

// [PATCH] /admin/product-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  try {
    await ProductCategory.updateOne({ _id: id }, { status: status });
    req.flash("success", "Cập nhật trạng thái thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật trạng thái thất bại!");
  }
  res.redirect(
    req.get("Referrer") || `${systemConfig.prefixAdmin}/product-category`,
  );
};

// [PATCH] /admin/product-category/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch (type) {
    case "active":
      await ProductCategory.updateMany(
        { _id: { $in: ids } },
        { status: "active" },
      );
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} danh mục!`,
      );
      break;

    case "inactive":
      await ProductCategory.updateMany(
        { _id: { $in: ids } },
        { status: "inactive" },
      );
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} danh mục!`,
      );
      break;

    case "delete-all":
      await ProductCategory.updateMany(
        { _id: { $in: ids } },
        { deleted: true, deletedAt: new Date() },
      );
      const remainingItems = await ProductCategory.find({
        deleted: false,
      }).sort({ position: "asc" });
      for (let i = 0; i < remainingItems.length; i++) {
        await ProductCategory.updateOne(
          { _id: remainingItems[i]._id },
          { position: i + 1 },
        );
      }
      req.flash("success", `Xóa thành công ${ids.length} danh mục!`);
      break;

    case "restore-all":
      let currentCount = await ProductCategory.countDocuments({
        deleted: false,
      });
      for (const itemId of ids) {
        currentCount++;
        await ProductCategory.updateOne(
          { _id: itemId },
          {
            deleted: false,
            deletedAt: null,
            position: currentCount,
          },
        );
      }
      req.flash("success", `Khôi phục thành công ${ids.length} danh mục!`);
      break;

    case "delete-permanent":
      await ProductCategory.deleteMany({ _id: { $in: ids } });
      req.flash("success", `Xóa vĩnh viễn thành công ${ids.length} danh mục!`);
      break;

    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await ProductCategory.updateOne({ _id: id }, { position: position });
        req.flash(
          "success",
          `Cập nhật vị trí thành công ${ids.length} danh mục!`,
        );
      }
      break;

    default:
      break;
  }

  res.redirect(
    req.get("Referrer") || `${systemConfig.prefixAdmin}/product-category`,
  );
};

// [DELETE] /admin/product-category/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  const item = await ProductCategory.findOne({ _id: id });

  await ProductCategory.updateOne(
    { _id: id },
    { deleted: true, deletedAt: new Date() },
  );

  if (item) {
    await ProductCategory.updateMany(
      {
        deleted: false,
        position: { $gt: item.position },
      },
      { $inc: { position: -1 } },
    );
  }

  req.flash("success", `Xóa danh mục thành công!`);
  res.redirect(
    req.get("Referrer") || `${systemConfig.prefixAdmin}/product-category`,
  );
};

// [GET] /admin/product-category/trash
module.exports.trash = async (req, res) => {
  
  let find = { deleted: true };

  const countCategory = await ProductCategory.countDocuments(find);
  let objectPagination = paginationHelper(
    { currentPage: 1, limitItems: 4 },
    req.query,
    countCategory,
  );

  const records = await ProductCategory.find(find)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  res.render("admin/pages/product-category/trash", {
    pageTitle: "Danh mục đã xóa",
    records: records,
    pagination: objectPagination,
  });
};

// [PATCH] /admin/product-category/restore/:id
module.exports.restoreItem = async (req, res) => {
  const id = req.params.id;
  const count = await ProductCategory.countDocuments({ deleted: false });

  await ProductCategory.updateOne(
    { _id: id },
    {
      deleted: false,
      deletedAt: null,
      position: count + 1,
    },
  );
  req.flash("success", `Khôi phục danh mục thành công!`);
  res.redirect(
    req.get("Referrer") || `${systemConfig.prefixAdmin}/product-category/trash`,
  );
};

// [GET] /admin/product-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const find = await ProductCategory.findOne({
      deleted: false,
      _id: id,
    });
    const product = await ProductCategory.findOne(find);
    const records = await ProductCategory.find({ deleted: false });

    const newRecords = createTreeHelper.createTree(records);

    res.render("admin/pages/product-category/edit", {
      pageTitle: "Chỉnh sửa danh mục sản phẩm",
      product: product,
      records: newRecords,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/product-category`);
  }
};

// [PATCH] /admin/product-category/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  req.body.position = parseInt(req.body.position);

  try {
    await ProductCategory.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật danh mục sản phẩm thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật danh mục sản phẩm thất bại!");
  }
  res.redirect(`${systemConfig.prefixAdmin}/product-category`);
};

// [GET] /admin/product-category/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = { deleted: false, _id: req.params.id };
    const product = await ProductCategory.findOne(find);
    res.render("admin/pages/product-category/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/product-category`);
  }
};
