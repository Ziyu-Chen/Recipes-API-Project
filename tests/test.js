/* eslint-disable no-console */
const { expect, assert } = require("chai");
const config = require("../config");
const knex = require("knex")(config.db);
//const models = require("../models")(knex);

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
