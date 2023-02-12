const categoryService = require("../services/category.service");

exports.createCategory = async (req, res, next) => {
	try {
		const body = req.body;
		const exist = await categoryService.getCategoryByName(
			body.name.toLowerCase()
		);
		if (exist) {
			return res.status(400).json({
				status: "Failed",
				message: "Category already exist! Please select the category",
			});
		}
		body.name = body.name.toLowerCase();
		console.log(body);
		const category = await categoryService.createCategory(body);
		res.status(201).json({
			status: "Success",
			data: category,
			message: `${body.name} Category created`,
		});
	} catch (error) {
		next(error);
	}
};

exports.getAllCategories = async (req, res, next) => {
	try {
		const categories = await categoryService.getAllCategories();
		res.status(200).json({
			status: "Succcess",
			count: categories.length,
			data: categories,
			message: "Category fetched successfully",
		});
	} catch (error) {
		next(error);
	}
};

exports.getCategoryById = async (req, res, next) => {
	try {
		const { categoryId } = req.params;
		console.log(categoryId);
		const category = await categoryService.getCategoryById(categoryId);

		if (!category) {
			return res.status(400).json({
				message: "Oops! category not found!",
			});
		}
		res.status(200).json({ status: "Success", data: category });
	} catch (error) {
		next(error);
	}
};

exports.updateCategory = async (req, res, next) => {
	try {
		const { categoryId } = req.params;
		const data = req.body;
		if (!categoryId) {
			return res.status(400).json({
				status: "Failed",
				message: "Provide the ID of the category",
			});
		}

		const categoryExist = await categoryService.getCategoryById(categoryId);
		if (!categoryExist) {
			return res.status(400).json({
				status: "Failed",
				message: `Category with the categoryId ${categoryId} not found`,
			});
		}

		data.name = data.name.toLowerCase();
		const duplicate = await categoryService.getCategoryByName(data.name);
		//allow update to the original category

		if (duplicate && duplicate?._id.toString() !== categoryId) {
			return res.status(409).json({
				status: "Failed",
				message: "Title already exist, Duplicate Title",
			});
		}

		const updateCategory = await categoryService.updateCategory(
			categoryId,
			data
		);

		res.status(200).json({
			status: "Success",
			message: `${updateCategory.name} updated successfully`,
		});
	} catch (error) {
		next(error);
	}
};

exports.deleteCategory = async (req, res, next) => {
	try {
		const { categoryId } = req.params;
		console.log(categoryId);

		const categoryExist = await categoryService.getCategoryById(categoryId);
		if (!categoryExist) {
			return res
				.status(400)
				.json({ status: "Failed", message: "Category not found!" });
		}
		const category = await categoryService.deleteCategory(categoryId);
		res.status(200).json({
			status: "Success",
			message: `${category.name} category has been deleted`,
		});
	} catch (error) {
		next(error);
	}
};
