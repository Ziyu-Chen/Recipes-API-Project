# Recipes-API-Project
This was created during my time as a student at Code Chrysalis. 

This is a recipe API. You can easily get recipes by ID, name, categories. You can also update or delete any recipe in the database. You can even create your own recipe. Enjoy!

# Modules in use
knex, postgresql and graphql.

# First steps
1. yarn install (to install all the modules)
2. (in psql terminal) CREATE DATABASE recipes (to create a new database)
3. yarn migrate (to create a table and insert the data from recipes.json)
4. yarn dev (to start the server)
5. go to http://localhost:3000/graphql in your browser.

# Get Recipe by Name
query{
  Recipe(name: "Eggnog Cookies III"){
    id
    name
    categories
    description
  }
}

# Get Recipe by ID
query{
  Recipe(id: 1){
    id
    name
    categories
    description
  }
}

# Get the First Recipes
query{
  Recipes{
    id
    name
    categories
    description
  }
}

# Get Recipes with page number and limit
query{
  Recipes(page: 3 limit: 20){
    id
    name
    categories
    description
  }
}

# Get Recipes by Category
query{
  Recipes(category: "Spice Cookies"){
    id
    name
    categories
    description
  }
}

# Create a Recipe with Specified Input
mutation {
  createRecipe(input: <input>) {
    id
    name
    categories
    description
  }
}

It also returns the newly created recipe.

# Update a Recipe
mutation {
  updateRecipe(name: "Eggnog Cookies III" input: input){
    id
    name
    categories
    description
  }
}

It also returns the updated recipe.

# Delete a Recipe by Name
mutation {
  deleteRecipe(name: "Eggnog Cookies III") {
    id
    name
    categories
    description
  }
}

It also returns the entire list of recipes in the database after deletion.
