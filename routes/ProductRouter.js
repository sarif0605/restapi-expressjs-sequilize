const express = require("express");
const router = express.Router();
const {
  addProduct,
  readProducts,
  detailProduct,
  updateProduct,
  destroyProduct,
} = require("../controller/ProductController");
const { uploadOptions } = require("../utils/FileUpload");

router.post("/", uploadOptions.single("image"), addProduct);
router.get("/", readProducts);
router.get("/:id", detailProduct);
router.put("/:id", uploadOptions.single("image"), updateProduct);
router.delete("/:id", destroyProduct);
module.exports = router;
