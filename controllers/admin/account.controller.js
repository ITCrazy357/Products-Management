const md5 = require("md5");
const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");
const Role = require("../../models/role.model");

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await Account.find(find).select("-password -token");
  for (const record of records) {
    const role = await Role.findOne({
      _id: record.role_id,
      deleted: false,
    });
    record.role = role;
  }
  res.render("admin/pages/accounts/index", {
    title: "Quản lý tài khoản",
    records: records,
  });
};

//[GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false,
  });
  res.render("admin/pages/accounts/create", {
    title: "Tạo mới tài khoản",
    roles: roles,
  });
};

//[POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  const emailExist = await Account.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (emailExist) {
    req.flash("error", "Email đã tồn tại!");
    const roles = await Role.find({
      deleted: false,
    });
    res.render("admin/pages/accounts/create", {
      title: "Tạo mới tài khoản",
      roles: roles,
      data: req.body,
    });
    return;
  } else {
    req.flash("success", "Tạo tài khoản thành công!");
    req.body.password = md5(req.body.password);
    
    // Bổ sung: Tạo token chuỗi ngẫu nhiên duy nhất cho mỗi tài khoản
    const crypto = require("crypto");
    req.body.token = crypto.randomBytes(20).toString("hex");

    const record = new Account(req.body);
    await record.save();
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

//[GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  let find = {
    _id: req.params.id,
    deleted: false,
  };

  try {
    const data = await Account.findOne(find);

    const roles = await Role.find({
      deleted: false,
    });

    res.render("admin/pages/accounts/edit", {
      title: "Chỉnh sửa tài khoản",
      data: data,
      roles: roles,
    });
  } catch (error) {
    console.log("Lỗi khi load trang edit:", error); // Bổ sung log để biết lỗi gì
    res.redirect(`${systemConfig.prefixAdmin}/accounts`); // Nếu lỗi thì quay lại trang danh sách
  }
};

//[PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  
  const emailExit = await Account.findOne({
    _id: { $ne: id },
    email: req.body.email,
    deleted: false,
  })

  if(emailExit){
    req.flash("error", `Email ${req.body.email} đã tồn tại!`);
    res.redirect(`${systemConfig.prefixAdmin}/accounts/edit/${id}`);
  }else{
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    }else{
      delete req.body.password;
    }
    await Account.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật tài khoản thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
}
