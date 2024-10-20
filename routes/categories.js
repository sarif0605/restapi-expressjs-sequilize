const express = require("express");
const router = express.Route();
const {
  storeCategory,
  getAllCategories,
  detailCategory,
  updateCategory,
  destroyCategory,
} = require("../controller/CategoryController");
const {
  authMiddleware,
  permissionUser,
} = require("../middleware/UserMiddleware");

router.get("/", getAllCategories);
router.get("/:id", detailCategory);
router.post("/", authMiddleware, permissionUser("admin"), storeCategory);
router.put("/:id", authMiddleware, permissionUser("admin"), updateCategory);
router.delete("/:id", authMiddleware, permissionUser("admin"), destroyCategory);
module.exports = router;
