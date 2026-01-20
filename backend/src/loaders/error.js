const errorHandler = require("../middlewares/errorHandler");

module.exports = (app) => {
    app.use(errorHandler);
};
