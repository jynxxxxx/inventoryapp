const Category = require("../models/category");
const Item = require("../models/item")
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all Categories.
exports.category_index = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();

  res.render("categorylist", {
    title: "Categories",
    categorylist: allCategories
  })
});

// Display detail page for a specific Category.
exports.category_details = asyncHandler(async (req, res, next) => {
  const [category, allItemsinCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, "name description")
      .sort({ name: 1 })
      .populate("anime")
      .exec(),
  ]);

  if (category === null) {
    // No results.
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("categorydetails", {
    title: "Search by Category",
    category: category,
    category_items: allItemsinCategory,
  });
});

// Display Category create form on GET.
exports.category_create_get = (req, res, next) => {
  res.render("category_form", {title: "Add Category"})
};

// Handle Category create on POST.
exports.category_create_post = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name is required."),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create Category object with escaped and trimmed data
    const category = new Category({
      name: req.body.name,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("category_form", {
        title: "Add Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      const categoryExists = await Category.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (categoryExists) {
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        res.redirect(category.url);
      }
    }
  }),
];


// Display Category delete form on GET.
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, allItems] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, "name description").exec(),
  ]);

  if (category === null) {
    res.redirect("/categories")
  }

  res.render("category_delete",{
    title: "Delete Item",
    category: category,
    allItems: allItems,
  })
});


// Handle Category delete on POST.
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [category, allItems] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, "name description").exec(),
  ]);

  if (allItems.length > 0) {
    res.render("category_delete",{
      title: "Delete Item",
      category: category,
      allItems: allItems,
    })
    return;
  } else {
    await Category.findOneAndDelete({_id: req.body.categoryid})
    res.redirect("/categories")
  }
});


// Display Category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec()

  if (category === null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_form", {
    title: "Update Category",
    category: category,
  })
});
  

// Handle Category update on POST.
exports.category_update_post  = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name is required."),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create Category object with escaped and trimmed data
    const category = new Category({
      name: req.body.name,
      _id: req.params.id
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("category_form", {
        title: "Update Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      const categoryExists = await Category.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (categoryExists) {
        res.redirect(categoryExists.url);
      } else {
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, category, {});
        res.redirect(updatedCategory.url);
      }
    }
  }),
];

