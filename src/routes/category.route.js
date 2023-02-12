const express = require("express");
const router = express.Router();

const { userAuthentication, isAdmin, isVendor } = require("../utils/auth");

const {
	createCategory,
	getAllCategories,
	getCategoryById,
	updateCategory,
	deleteCategory,
	getCategoryOfEvent,
} = require("../controllers/category.controller");

const { categoryValidator } = require("../validators/category.validator");

router.get("/", getAllCategories);
router.post(
	"/",
	categoryValidator,
	userAuthentication,
	isAdmin,
	createCategory
);
router.get("/:categoryId", userAuthentication, getCategoryById);
// router.get("/event/:eventId", userAuthentication, getCategoryOfEvent);
router.patch(
	"/:categoryId",
	categoryValidator,
	userAuthentication,
	isAdmin,
	updateCategory
);
router.delete("/:categoryId", userAuthentication, isAdmin, deleteCategory);

module.exports = router;
