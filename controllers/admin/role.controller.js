const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await Role.find(find);

  res.render("admin/pages/roles/index", {
    title: "Nhóm quyền",
    records: records,
  });
};

//[GET] /admin/roles/create
module.exports.create = (req, res) => {
  res.render("admin/pages/roles/create", {
    title: "Tạo mới nhóm quyền",
  });
};

//[POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
  const record = new Role(req.body);
  await record.save();
  res.redirect(`${systemConfig.prefixAdmin}/roles`);
};

//[GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
    let find = {
        _id: id,
        deleted: false
    }
    const data = await Role.findOne(find);

    res.render("admin/pages/roles/edit",{
        title: "Chỉnh sửa nhóm quyền",
        data: data
    });
    }catch (error) {
        console.log("Lỗi khi load trang edit:", error); // Bổ sung log để biết lỗi gì
        res.redirect(`${systemConfig.prefixAdmin}/roles`); // Nếu lỗi thì quay lại trang danh sách
    }
}

//[PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;
        await Role.updateOne({_id: id}, req.body);
        req.flash('success', 'Cập nhật nhóm quyền thành công!');
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    } catch(error) {
        console.log("Lỗi cập nhật Role:", error);
        res.redirect(`${systemConfig.prefixAdmin}/roles`); // Nếu lỗi thì quay lại trang danh sách
    }
};
