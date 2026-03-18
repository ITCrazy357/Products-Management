const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
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
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }

  const records = await ProductCategory.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  res.render("admin/pages/product-category/index", {
    pageTitle: "Danh mục sản phẩm",
    records: records,
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

  function createTree(arr, parentId = ""){
    const tree = [];
    arr.forEach((item) => {
      if (item.parent_id === parentId) {
        const newItem = item.toObject();
        const children = createTree(arr, item.id);
        if (children.length > 0) {
          newItem.children = children;
        }
        tree.push(newItem);
      }
    });
    return tree;
  }

  

  const records = await ProductCategory.find(find);

  const newRecords = createTree(records);


  res.render("admin/pages/product-category/create", {
    pageTitle: "Tạo danh mục sản phẩm",
    records: newRecords,
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
  res.redirect(`${systemConfig.prefixAdmin}/product-category`);
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
      req.flash("success", `Xóa thành công ${ids.length} danh mục!`);
      break;

    case "restore-all":
      await ProductCategory.updateMany(
        { _id: { $in: ids } },
        {
          deleted: false,
          deletedAt: null,
        },
      );
      req.flash("success", `Khôi phục thành công ${ids.length} danh mục!`);
      break;

    case "delete-permanent":
      await ProductCategory.deleteMany({ _id: { $in: ids } });
      req.flash("success", `Xóa vĩnh viễn thành công ${ids.length} danh mục!`);
      break;

    case "change-position":
      // console.log(ids);
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        // console.log(id)
        // console.log(position)
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
  await ProductCategory.updateOne(
    { _id: id },
    { deleted: true, deletedAt: new Date() },
  );
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
  await ProductCategory.updateOne(
    { _id: id },
    { deleted: false, deletedAt: null },
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
    const find = { deleted: false, _id: id };
    const product = await ProductCategory.findOne(find);

    const records = await ProductCategory.find({ deleted: false });

    function createTree(arr, parentId = "") {
      const tree = [];
      arr.forEach((item) => {
        if (item.parent_id === parentId) {
          const newItem = item.toObject();
          const children = createTree(arr, item.id);
          if (children.length > 0) {
            newItem.children = children;
          }
          tree.push(newItem);
        }
      });
      return tree;
    }

    res.render("admin/pages/product-category/edit", {
      pageTitle: "Chỉnh sửa danh mục sản phẩm",
      product: product,
      records: createTree(records),
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/product-category`);
  }
};

// [PATCH] /admin/product-category/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  req.body.position = parseInt(req.body.position);
  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }
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
