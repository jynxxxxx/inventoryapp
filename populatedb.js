#! /usr/bin/env node

console.log(
  'This script populates some test data'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Anime = require("./models/anime");
const Category = require("./models/category");
const Item = require("./models/item");


const animes = [];
const categories = [];
const items = [];


const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createAnimes();
  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function animeCreate(index, name, summary) {
  const animeDetail = { 
    name: name,
    summary: summary
  };

  const anime = new Anime(animeDetail);

  await anime.save();
  animes[index] = anime;
  console.log(`Added anime: ${name}`);
}

async function categoryCreate(index, name) {
  const categoryDetail = {
    name: name,
  }
  const category = new Category(categoryDetail);

  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function itemCreate(index, name, description, price, inventory, anime, category) {
  const itemDetail = ({ 
    name: name,
    description: description,
    price: price,
    inventory: inventory,
    anime: anime,
    category: [category]
  });

  // if (category != false) itemDetail.category = category;

  const item = new Item(itemDetail)

  await item.save();
  items[index] = item;
  console.log(`Added item: ${name}`);
}

const OnePieceDescrip = "One Piece is a Japanese manga series that follows the adventures of Monkey D. Luffy and his crew, the Straw Hat Pirates, where he explores the Grand Line in search of the mythical treasure known as the 'One Piece' in order to become the next King of the Pirates."
const JuKaiDescrip = "Jujutsu Kaisen follows high school student Yuji Itadori as he joins a secret organization of Jujutsu Sorcerers to eliminate a powerful Curse named Ryomen Sukuna, of whom Yuji becomes the host"
const SpyDescrip = "Spy x Family follows a spy who has to build a cover family to execute a mission, not realizing that the girl he adopts as his daughter is a telepath, and the woman he agrees to be in a marriage with is a skilled assassin."



async function createAnimes() {
  console.log("Adding Animes")
  await Promise.all([
    animeCreate(0, "One Piece", OnePieceDescrip),
    animeCreate(1, "Jujutsu Kaisen", JuKaiDescrip),
    animeCreate(2, "Spy x Family", SpyDescrip),
  ])
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(0, "Cases"),
    categoryCreate(1, "Figurines"),
    categoryCreate(2, "Clothes"),
  ]);
}

async function createItems() {
  console.log("Adding Items");
  console.log(animes[0])
  await Promise.all([
    itemCreate(0, 
      "16cm Roronoa Zoro Action Figure",
      "Zoro is the first mate and swordsman of the Straw Hat Pirates and one of the main protagonists of the One Piece series.  Materials: Prime quality PVC",
      69.00,
      12,
      animes[0],
      categories[1],
    ),
    itemCreate(1,
      "One Piece Hoodie Luffy Cute Pullover Oversized Hoodie",
      "Comfy oversized sweater that comes in a variety of colors",
      49.95,
      10,
      animes[0],
      categories[2]
      ),
    itemCreate(2,
      "One Piece Socks",
      "One Piece Socks: Black Socks One Piece Logo",
      18.00,
      19,
      animes[0],
      categories[2],
      ),
    itemCreate(3,
      "One Piece Luffy Gear 5th Figure",
      "First Edition One Piece Luffy Gear 5th Figure, 20 cm high quality with box",
      99.00,
      5,
      animes[0],
      categories[1],
      ),
    itemCreate(4,
      "Chopper AirPod Pro Case",
      "Smiling Chopper official merch",
      35.99,
      5,
      animes[0],
      categories[0],
      ),
    itemCreate(5,
      "Luffy AirPod Pro Case",
      "Smiling Luffy official merch",
      35.99,
      13,
      animes[0],
      categories[0],
      ),
    itemCreate(6,
      "Gojo Satoru Action Figure",
      "ACG Character: Gojo Satoru about 17- 20cm",
      57.65,
      6,
      animes[1],
      categories[1],
      ),
    itemCreate(7,
      "Jujutsu Kaisen Hoodie",
      "Jujutsu Kaisen Hoodie - Gojo Satoru",
      49.90,
      19,
      animes[1],
      categories[2],
      ),
    itemCreate(8,
      "Gojo Satoru T-shirt",
      "A fashionable and colorful item of clothing honoring Gojo Satoru",
      49.00,
      14,
      animes[1],
      categories[2],
      ),
    itemCreate(9,
      "Anya Meme Colorful Long Sleeve Pullover Hoodie",
      "Heavyweight 8.25 oz. (~280 gsm) cotton-rich fleece",
      40.99,
      9,
      animes[2],
      categories[2],
      ),
    itemCreate(10,
      "Demon Anya Forger Peanut Breathing T-Shirt",
      "The usual, conventional t-shirt for everyday wear. Traditional boxy fit.",
      25.00,
      19,
      animes[2],
      categories[2],
      ),
    itemCreate(11,
      "Anya Forger Heh Heh Spy Family Cute Soft Case",
      "Sturdy versatile case that grips across the edges of your cellphone. Shock absorbent TPU case with anti-fingerprint end",
      16.00,
      23,
      animes[2],
      categories[2],
      ),
  ]);
}

