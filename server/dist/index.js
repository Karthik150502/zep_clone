"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const init_1 = require("./socket/init");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const user_1 = __importDefault(require("./api/v1/user/user"));
const admin_1 = __importDefault(require("./api/v1/admin/admin"));
const avatar_1 = __importDefault(require("./api/v1/avatar/avatar"));
const Auth_1 = __importDefault(require("./controller/Auth"));
const space_1 = __importDefault(require("./api/v1/space/space"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8001;
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// Routes
app.use("/api/v1/user", user_1.default);
app.use("/api/v1/admin", admin_1.default);
app.use("/api/v1/avatars", avatar_1.default);
app.use("/api/v1/space", space_1.default);
app.post("/api/v1/sign-in", Auth_1.default.login);
app.post("/api/v1/sign-up", Auth_1.default.signup);
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        // origin: "*",
        // Origins to allow, to allow incoming traffic and to allow Socket interaction monitoring
        origin: process.env.APP_URL,
        credentials: true
    },
});
exports.io = io;
(0, init_1.initSocket)(io);
app.get("/", (req, res) => {
    res.send("It's working 🙌");
    return;
});
server.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
