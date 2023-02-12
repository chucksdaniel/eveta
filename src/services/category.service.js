const Category = require("../models/Category");
const Event = require("../models/Event");
const eventService = require("../services/event.service");

exports.getAllCategories = async () => {
	const categories = await Category.find().lean();
	let ans = [];

	for (let i = 0; i < categories.length; i++) {
		// console.log(categories[i].name);
		const events = await Event.find({
			category: categories[i]._id,
			"location.eventEndDate": { $gte: new Date() },
		});

		let obj = {
			_id: categories[i]._id,
			name: categories[i].name,
			imgUrl: categories[i].imgUrl,
			noOfAllEvents: categories[i].noOfEvent,
			noOfEvent: events.length,
			// event: events,
			createdAt: categories[i].createdAt,
			updatedAt: categories[i].updatedAt,
		};
		ans.push(obj);
	}
	// console.log(ans);
	return ans;
};

exports.getCategoryById = async (id) => {
	const category = await Category.findOne({ _id: id }).lean();
	return category;
};

exports.updateNumberOfEventInACat = async (id) => {
	const category = await Category.findOneAndUpdate(
		{ _id: id },
		{ $inc: { noOfEvent: 1 } }
	).lean();
	return category;
};

exports.createCategory = async (data) => {
	const category = new Category(data);

	await category.save();

	return category;
};

exports.updateCategory = async (categoryId, data) => {
	const updatedCategory = await Category.findByIdAndUpdate(categoryId, data, {
		new: true,
	});
	// await eventExist.save();
	return updatedCategory;
};

exports.deleteCategory = async (id) => {
	const category = await Category.findByIdAndDelete({ _id: id });
	return category;
};

exports.getCategoryByName = async (data) => {
	const category = await Category.findOne({ name: data }).lean();
	return category;
};

exports.getCategoryId = async (name) => {
	const category = await Category.findOne({ name: name.toLowerCase() }).lean();
	return category;
};
