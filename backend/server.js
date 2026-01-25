const dotenv = require("dotenv");
dotenv.config();

const http = require("http");
const { Server } = require("socket.io");

// import app
const app = require("./src/app");

const PORT = process.env.PORT || 5000;

const httpserver = http.createServer(app);

const io = new Server(httpserver, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});

global.io = io;

io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join_board", (boardId) => {
        socket.join(boardId);
        console.log(`joined board ${boardId}`);
    });

    socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
    });
});

httpserver.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
