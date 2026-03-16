const express = require("express");
const router = express.Router();
const multer = require("multer");
const controller = require("../../controllers/admin/product.controller");
const validate = require("../../validates/admin/product.validate");
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

router.get("/", controller.index);

// 🔥 ĐẶT TRASH LÊN TRÊN
router.get("/trash", controller.trash);
router.patch("/restore/:id", controller.restoreItem);

router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
//Xóa
router.delete("/delete/:id", controller.deleteItem);
//Tạo mới
router.get("/create", controller.create);
router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost,
);

//Chỉnh sửa
router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.editPatch,
);

//Chi tiết
router.get("/detail/:id", controller.detail);


module.exports = router;
