const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const express = require("express");
const cookieParser = require("cookie-parser");
const corsOptions = require("../config/cors");

module.exports = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.use(helmet());

    app.use(cors(corsOptions));

    if (process.env.NODE_ENV === "development") {
        app.use(morgan("dev"));
    }

    app.use(compression());
};
