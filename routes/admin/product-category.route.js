const express = require("express");
const router = express.Router();
const multer = require("multer");
const controller = require("../../controllers/admin/product-category.controller");
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const validate = require("../../validates/admin/product-category.validate");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
    "/create",
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
)

module.exports = router;
