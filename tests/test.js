/* eslint-disable no-console */
const { expect, assert } = require("chai");
const config = require("../config");
const knex = require("knex")(config.db);
const models = require("../models")(knex);
const chai = require("chai");
const chaiHttp = require("chai-http");
const setupServer = require("../controllers/recipe");
chai.use(chaiHttp);
chai.should();

const app = setupServer(models);

describe("setup", () => {
  it("able to connect to database", () => {
    knex
      .raw("select 1+1 as result")
      .catch(() => assert.fail("unable to connect to db"));
  });

  it("has run the initial migrations", () => {
    knex("recipes")
      .select()
      .catch(() => assert.fail("users table is not found."));
  });
});

describe("#Create recipes", () => {
  let params = {};
  context("when good params are given", () => {
    before(() => {
      params = {
        name: "Pork Tenderloin with Apples and Onions",
        description:
          "his is an easy, tasty main dish for the family on a weeknight. While the pork is in the oven, it's simple to steam a veggie side and prepare a quick salad",
        categories: ["Meat and Poultry", "Pork", "Tenderloin"],
        rating: 5.0,
        ingredients: [
          "2 (1 1/2 pound) pork tenderloins",
          "2 teaspoons vegetable oil, divided",
          "1 teaspoon sea salt",
          "2 tablespoons vegetable oil, divided, or more as needed",
          "3 Granny Smith apples - peeled, cored, and sliced into eighths",
          "2 medium sweet onions, sliced vertically",
          "1 tablespoon Dijon mustard",
          "1 tablespoon fresh thyme leaves, divided",
          "1/4 teaspoon ground black pepper, or to taste",
          "1 cup chicken stock",
          "1 tablespoon butter"
        ],
        prepTime: 15,
        cookTime: 45,
        totalTime: 60,
        directions: [
          "Preheat the oven to 425 degrees F (220 degrees C).",
          "Trim all silver skin from tenderloins; pat dry using paper towels. Rub 1 teaspoon vegetable oil over the surface of each tenderloin and rub with sea salt.",
          "Heat 1 tablespoon vegetable oil in a large, oven-proof skillet over medium heat until it shimmers, about 1 minute. Place tenderloins into the skillet and cook, rotating to brown all sides, about 10 minutes. Transfer pork to a large plate.",
          "Add remaining tablespoon oil to any drippings in the skillet. Cook apples and onions in the hot oil, stirring occasionally, until onions begin to turn translucent, about 5 minutes, adding a bit more oil if skillet gets dry.",
          "Meanwhile, spread Dijon mustard evenly over browned tenderloins using a pastry brush. Sprinkle 2 teaspoons thyme leaves over pork. Sprinkle remaining thyme over apple mixture and add black pepper; stir gently to combine. Nestle tenderloins into the skillet with apple mixture.",
          "Roast, uncovered, in the preheated oven until an instant-read thermometer inserted into the center of the tenderloins reads at least 145 degrees F (63 degrees C), about 15 minutes.",
          "Remove skillet from the oven and place pork onto a plate. Cover with aluminum foil and let rest.",
          "Meanwhile, pour chicken stock into a saucepan and cook over medium-high heat until reduced by 1/2, 8 to 10 minutes. Add to the skillet containing apple mixture.",
          "Heat over medium-high heat until boiling, about 5 minutes; stir in butter until melted. Slice pork and serve over apple mixture."
        ],
        calories: 313.0,
        fat: 12.9,
        carbohydrates: 12.8,
        protein: 36.0,
        cholesterol: 104.0,
        sodium: 563.0,
        author: "Bibi",
        source: "https://www.allrecipes.com/recipe/275977"
      };
    });
    afterEach(() => {
      knex("recipes")
        .where("name", "Pork Tenderloin with Apples and Onions")
        .del();
    });
    it("should create a recipe", () => {
      models.recipes.create(params).then(recipe => {
        //console.log(recipe)
        expect(recipe).to.include({
          name: "Pork Tenderloin with Apples and Onions",
          prepTime: 15,
          cookTime: 45,
          totalTime: 60
        });
      });
    });
  });
});

describe("#List recipes", () => {
  let params = {};
  context("when good params are given", () => {
    before(() => {
      params = {
        page: 2,
        limit: 10
      };
    });
    it("should return a list of recipes according to the given limit and page number", () => {
      models.recipes.list(params).then(recipes => {
        expect(recipes[0]).to.include({
          name: "Taffy Apple Salad",
          calories: 406.0,
          fat: 21.4,
          carbohydrates: 49.9,
          protein: 9.0,
          cholesterol: 23.0,
          sodium: 35.0
        });
      });
    });
  });
  context("when no params are given", () => {
    it("should return the first ten recipes in the database", () => {
      models.recipes.list().then(recipes => {
        expect(recipes[0]).to.include({
          id: 1,
          name: "Eggnog Cookies II",
          calories: 198.0,
          fat: 9.1,
          carbohydrates: 27.3,
          protein: 2.3,
          cholesterol: 47.0,
          sodium: 87.0
        });
      });
    });
  });
});

describe("#Server", () => {
  let request;
  beforeEach(() => {
    request = chai.request(app);
  });
  describe("Recipes", () => {
    it("should return a list of recipes", async () => {
      const body = {
        query: `
        query{
          Recipes (page: 2 limit: 10){
						id
            name
						calories
						fat
						carbohydrates
						protein
						cholesterol
						sodium
          }
        }`
      };
      const res = await request.post("/graphql").send(body);
      JSON.parse(res.text).data.Recipes[0].should.deep.equal({
        id: 11,
        name: "Taffy Apple Salad",
        calories: 406.0,
        fat: 21.4,
        carbohydrates: 49.9,
        protein: 9.0,
        cholesterol: 23.0,
        sodium: 35.0
      });
    });
  });
  describe("createRecipe", () => {
    afterEach(() => {
      knex("recipes")
        .where("name", "Pork Tenderloin with Apples and Onions")
        .del();
    });
    it("should create a recipe in the database and return it", async () => {
      const body = {
        query: `
        mutation{
          createRecipe (input: {name: "Pork Tenderloin with Apples and Onions"
					description: "his is an easy, tasty main dish for the family on a weeknight. While the pork is in the oven, it's simple to steam a veggie side and prepare a quick salad"
					categories: ["Meat and Poultry", "Pork", "Tenderloin"]
					rating: 5.0
					ingredients: ["2 (1 1/2 pound) pork tenderloins",
						"2 teaspoons vegetable oil, divided",
						"1 teaspoon sea salt",
						"2 tablespoons vegetable oil, divided, or more as needed",
						"3 Granny Smith apples - peeled, cored, and sliced into eighths",
						"2 medium sweet onions, sliced vertically",
						"1 tablespoon Dijon mustard",
						"1 tablespoon fresh thyme leaves, divided",
						"1/4 teaspoon ground black pepper, or to taste",
						"1 cup chicken stock",
						"1 tablespoon butter"],
					prepTime: 15
					cookTime: 45
					totalTime: 60
					directions: ["Preheat the oven to 425 degrees F (220 degrees C).",
					"Trim all silver skin from tenderloins; pat dry using paper towels. Rub 1 teaspoon vegetable oil over the surface of each tenderloin and rub with sea salt.",
					"Heat 1 tablespoon vegetable oil in a large, oven-proof skillet over medium heat until it shimmers, about 1 minute. Place tenderloins into the skillet and cook, rotating to brown all sides, about 10 minutes. Transfer pork to a large plate.",
					"Add remaining tablespoon oil to any drippings in the skillet. Cook apples and onions in the hot oil, stirring occasionally, until onions begin to turn translucent, about 5 minutes, adding a bit more oil if skillet gets dry.",
					"Meanwhile, spread Dijon mustard evenly over browned tenderloins using a pastry brush. Sprinkle 2 teaspoons thyme leaves over pork. Sprinkle remaining thyme over apple mixture and add black pepper; stir gently to combine. Nestle tenderloins into the skillet with apple mixture.",
					"Roast, uncovered, in the preheated oven until an instant-read thermometer inserted into the center of the tenderloins reads at least 145 degrees F (63 degrees C), about 15 minutes.",
					"Remove skillet from the oven and place pork onto a plate. Cover with aluminum foil and let rest.",
					"Meanwhile, pour chicken stock into a saucepan and cook over medium-high heat until reduced by 1/2, 8 to 10 minutes. Add to the skillet containing apple mixture.",
					"Heat over medium-high heat until boiling, about 5 minutes; stir in butter until melted. Slice pork and serve over apple mixture."],
					calories: 313.0
					fat: 12.9
					carbohydrates: 12.8
					protein: 36.0
					cholesterol: 104.0
					sodium: 563.0
					author: "Bibi"
					source: "https://www.allrecipes.com/recipe/275977"}){
            name
						prepTime
						cookTime
						totalTime
          }
				}`
      };
      const res = await request.post("/graphql").send(body);
      JSON.parse(res.text).data.createRecipe.should.include({
        name: "Pork Tenderloin with Apples and Onions",
        prepTime: 15,
        cookTime: 45,
        totalTime: 60
      });
    });
  });
});
