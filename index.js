/**
 ********************************DEPENDENCIES********************************
 ****************************************************************************
 */

/*
Instead of hard-coding configs for your app whenever you need them, I think
its polite to have them all in one place. Think of config.js as the global
control panel for your app.
*/
const config = require("./config");

/*
Database and other external 'services'. In general, when interfacing
with an external API it can be helpful to separate your code into
isolated modules that have a single responsibility.

In this case, I've made a database 'service', which will contain bundles
of handy functions for interacting with our database. There's also a
'logger' service, that just formats the logs in a way that makes them
easier to debug.

Notice that any configs required by the services are explicitly injected
here. In principle, you could cut out any of these services and paste it
into another project, and assuming your business logic is pretty similar,
all you would have to change is the injected config.
*/

// initialize a connection to the database, and pass this
// to the various submodules within
const knex = require("knex")(config.db);
const models = require("./models")(knex);

/*
Routes for the server. Note that these are explicitly injected the
initialized 'services', including the database methods and logger.
We use this kind of 'dependency injection' to prevent arbitrarily
'require'-ing code everywhere. You'll appreciate this when writing tests
in this repo. Another benefit, if you use dependency injection its much
harder to end up with circular dependencies =)
*/
const setupServer = require("./controllers/recipe");
const morgan = require("morgan"); // a popular library for logging your requests
const bodyParser = require("body-parser"); // a middleware plugin to enable express to parse JSON
// and of course, an express server =)
const app = setupServer(models);

// Set the headers for incoming requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,OPTIONS,PATCH"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, authorization"
  );
  next();
});

// Parse request bodies as json
app.use(bodyParser.json({ type: "application/json", limit: "50mb" }));
