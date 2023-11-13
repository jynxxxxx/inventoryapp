const express = require("express");
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Require controller modules.
const category_controller = require("../controllers/categoryController");
const item_controller = require("../controllers/itemController");
const anime_controller = require("../controllers/animeController")

/// CATEGORY ROUTES ///

// GET Category List.
router.get("/categories", category_controller.category_index);

// GET request for creating Category. NOTE This must come before route for id (i.e. display category).
router.get("/category/create", category_controller.category_create_get);

// POST request for creating Category.
router.post("/category/create", category_controller.category_create_post);

// GET request to delete Category.
router.get("/category/:id/delete", category_controller.category_delete_get);

// POST request to delete Category.
router.post("/category/:id/delete", category_controller.category_delete_post);

// GET request to update Category.
router.get("/category/:id/update", category_controller.category_update_get);

// POST request to update Category.
router.post("/category/:id/update", category_controller.category_update_post);

// GET request for one Category.
router.get("/category/:id", category_controller.category_details);



/// ANIME ROUTES ///

// GET Anime List.
router.get("/animes", anime_controller.anime_index);

// GET request for creating Anime. NOTE This must come before route for id (i.e. display anime).
router.get("/anime/create", anime_controller.anime_create_get);

// POST request for creating Anime.
router.post("/anime/create", anime_controller.anime_create_post);

// GET request to delete Anime.
router.get("/anime/:id/delete", anime_controller.anime_delete_get);

// POST request to delete Anime.
router.post("/anime/:id/delete", anime_controller.anime_delete_post);

// GET request to update Anime.
router.get("/anime/:id/update", anime_controller.anime_update_get);

// POST request to update Anime.
router.post("/anime/:id/update", anime_controller.anime_update_post);

// GET request for one Anime.
router.get("/anime/:id", anime_controller.anime_details);



/// BOOK ROUTES ///

// GET request for creating a Item. NOTE This must come before routes that display Item (uses id).
router.get("/item/create", item_controller.item_create_get);

// POST request for creating Item.
router.post("/item/create", item_controller.item_create_post);

// GET request to delete Item.
router.get("/item/:id/delete", item_controller.item_delete_get);

// POST request to delete Item.
router.post("/item/:id/delete", item_controller.item_delete_post);

// GET request to update Item.
router.get("/item/:id/update", item_controller.item_update_get);

// POST request to update Item.
router.post("/item/:id/update", item_controller.item_update_post);

// GET request for one Item.
router.get("/item/:id", item_controller.item_details);

// GET request for list of all Item items.
router.get("/items", item_controller.item_list);

module.exports = router;