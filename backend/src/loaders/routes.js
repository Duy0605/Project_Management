const authRoutes = require("../routes/auth");
const userRoutes = require("../routes/user");
const boardRoutes = require("../routes/board");
const columnRoutes = require("../routes/column");
const taskRoutes = require("../routes/task");
const activityRoutes = require("../routes/activity");

module.exports = (app) => {
    app.use("/api/auth", authRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/boards", boardRoutes);
    app.use("/api/columns", columnRoutes);
    app.use("/api/tasks", taskRoutes);
    app.use("/api/activities", activityRoutes);
};
