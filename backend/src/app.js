const express = require("express");

const connectDB = require("./config/database");
const loadExpress = require("./loaders/express");
const loadRoutes = require("./loaders/routes");
const loadErrors = require("./loaders/error");

const app = express();

connectDB();
loadExpress(app);
loadRoutes(app);
loadErrors(app);

module.exports = app;
