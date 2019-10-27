const express = require("express");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");

module.exports = models => {
  const schema = buildSchema(`
    type Recipe {
      id: Int!
      name: String!
      description: String
      categories: [String]
      rating: Float
      ingredients: [String]
      prepTime: Int
      cookTime: Int
      totalTime: Int
      directions: [String]
      calories: Float
      fat: Float
      carbohydrates: Float
      protein: Float
      cholesterol: Float
      sodium: Float
      author: String
      source: String
    }
    input RecipeInput {
      name: String!
      description: String
      categories: [String]
      rating: Float
      ingredients: [String]
      prepTime: Int
      cookTime: Int
      totalTime: Int
      directions: [String]
      calories: Float
      fat: Float
      carbohydrates: Float
      protein: Float
      cholesterol: Float
      sodium: Float
      author: String
      source: String
    }
    type Query {
      Recipes(page: Int limit: Int): [Recipe]
    }
    type Mutation {
      createRecipe(input: RecipeInput): Recipe 
    }
  `);

  const root = {
    Recipes: request => {
      return models.recipes.list(request);
    },
    createRecipe: request => {
      return models.recipes.create(request.input);
    }
  };

  // Start your express server!
  const app = express();

  /*
  The only endpoint for your server is `/graphql`- if you are fetching a resource, 
  you will need to POST your query to that endpoint. Suggestion: check out Apollo-Fetch
  or Apollo-Client. Note below where the schema and resolvers are connected. Setting graphiql
  to 'true' gives you an in-browser explorer to test your queries.
*/
  app.use(
    "/graphql",
    graphqlHTTP({
      schema,
      rootValue: root,
      graphiql: true
    })
  );
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Running a GraphQL API server at localhost:${PORT}/graphql`);
  });

  return app;
};
