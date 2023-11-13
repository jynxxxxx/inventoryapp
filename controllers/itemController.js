const Item = require("../models/item");
const Anime = require("../models/anime")
const Category = require("../models/category")
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all Categories.
exports.item_list = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find().sort({ name: 1 }).exec();

  res.render("itemlist", {
    title: "All Items",
    itemlist: allItems
  })
});

// Display detail page for a specific Item.
exports.item_details = asyncHandler(async (req, res, next) => {
  const [item, allItems] = await Promise.all([
    Item.findById(req.params.id)
      .sort({ name: 1 })
      .populate("anime")
      .populate("category")
      .exec(),
  ]);

  if (item === null) {
    // No results.
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }

  res.render("itemdetails", {
    title: item.name,
    item: item,
    allItems: allItems
  });
});

// Display Item create form on GET.
exports.item_create_get = asyncHandler(async (req, res, next) => {
  const [allAnimes, allCategories] = await Promise.all ([
    Anime.find().exec(),
    Category.find().exec(),
  ])

  res.render("item_form", {
    title: "Add Item",
    animes: allAnimes,
    categories: allCategories,
  })
});

// Handle Item create on POST.
exports.item_create_post = [
  // Validate and sanitize fields.
  body("name")
  .trim()
  .isLength({ min: 1 })
  .escape()
  .withMessage("Name is required."),
  body("description")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Description is Required."),
  body("price")
    .trim()
    .isLength({ min: 1 })
    .isNumeric()
    .escape()
    .withMessage("Price is Required."),
  body("inventory")
    .trim()
    .isLength({ min: 1 })
    .isNumeric()
    .escape()
    .withMessage("Inventory Stock is Required."),
  body("anime").escape(),
  body("category").escape(),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create Item object with escaped and trimmed data
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      inventory: req.body.inventory,
      anime: req.body.anime,
      category: req.body.category,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      
      const [allAnimes, allCategories] = await Promise.all ([
        Anime.find().exec(),
        Category.find().exec(),
      ])

      for (const anime of allAnimes) {
        if (item.anime.includes(anime._id)) {
          anime.checked = true
        }
      }

      for (const category of allCategories) {
        if (item.category.includes(category._id)) {
          category.checked = true
        }
      }
      
      res.render("item_form", {
        title: "Add Item",
        item: item,
        animes: allAnimes,
        categories: allCategories,
        errors: errors.array(),
      });
      return;
    } else {
      await item.save();
      res.redirect(item.url);
    }
  }),
];

// Display Item delete form on GET.
exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).exec()

  if(item === null) {
    res.redirect("/items")
  }

  res.render("item_delete",{
    title: "Delete Item",
    item: item,
  })
});

// Handle Item delete on POST.
exports.item_delete_post = asyncHandler(async (req, res, next) => {
  await Item.findOneAndDelete({ _id: req.body.itemid });
  res.redirect("/items");
});

// Display Item update form on GET.
exports.item_update_get = asyncHandler(async (req, res, next) => {
  const [item, allAnimes, allCategories] = await Promise.all ([
    Item.findById(req.params.id).populate('anime').populate('category').exec(),
    Anime.find().exec(),
    Category.find().exec(),
  ])

  if (item === null) {
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }

  for (const anime of allAnimes) {
    if (anime._id.toString() === item.anime._id.toString()) {
      anime.checked = true;
    }
  }

  // Iterate through allCategories and set the checked property for the matching category
  for (const category of allCategories) {
    if (category._id.toString() === item.category[0]._id.toString()) {
      category.checked = true;
    }
  }
  

  res.render("item_form", {
    title: "Update Item",
    item: item,
    animes: allAnimes,
    categories: allCategories,
  })
});

// Handle Item update on POST.
exports.item_update_post = [
  // Validate and sanitize fields.
  body("name")
  .trim()
  .isLength({ min: 1 })
  .escape()
  .withMessage("Name is required."),
  body("description")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Description is Required."),
  body("price")
    .trim()
    .isLength({ min: 1 })
    .isNumeric()
    .escape()
    .withMessage("Price is Required."),
  body("inventory")
    .trim()
    .isLength({ min: 1 })
    .isNumeric()
    .escape()
    .withMessage("Inventory Stock is Required."),
  body("anime").escape(),
  body("category").escape(),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create Item object with escaped and trimmed data
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      inventory: req.body.inventory,
      anime: req.body.anime,
      category: req.body.category,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      
      const [allAnimes, allCategories] = await Promise.all ([
        Anime.find().exec(),
        Category.find().exec(),
      ])

      for (const anime of allAnimes) {
        if (item.anime.indexOf(anime._id) > -1){
          anime.checked = true
        }
      }

      for (const category of allCategories) {
        if (item.category.indexOf(category._id) > -1) {
          category.checked = true
        }
      }
      
      res.render("item_form", {
        title: "Update Item",
        item: item,
        animes: allAnimes,
        categories: allCategories,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedItem = await Item.findByIdAndUpdate(req.params.id, item, {});
      res.redirect(updatedItem.url);
    }
  }),
];
