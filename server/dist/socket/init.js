"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = initSocket;
const auth_1 = __importDefault(require("../lib/socket/auth"));
function initSocket(io) {
    io.use((socket, next) => {
        const space = socket.handshake.auth.space || socket.handshake.headers.space;
        if (!space) {
            return next(new Error("Invalid Space Id."));
        }
        socket.space = space;
        next();
    });
    io.on("connection", (socket) => {
        // Joining the room
        // socket.join(socket.room);
        console.log("The socket connection has been initialized = ", socket.id);
        socket.on("message", (data) => __awaiter(this, void 0, void 0, function* () {
            console.log("Message from client = ", data);
        }));
        socket.on("metaverse-evt", (data) => __awaiter(this, void 0, void 0, function* () {
            console.log("From Client", data);
            switch (data.type) {
                case "join": {
                    if (!(0, auth_1.default)(data.payload.token)) {
                        socket.emit("error", {
                            message: "You are not authenticated"
                        });
                        return;
                    }
                    ;
                    socket.to(socket.space).emit("metaverse-evt", {
                        type: "user-joined",
                        data
                    });
                    break;
                }
                case "move": {
                    socket.to(socket.space).emit("metaverse-evt", {
                        type: "user-moved",
                        data
                    });
                }
                default:
                    break;
            }
        }));
        socket.on("disconnect", () => {
            console.log("The socket has been disconnected.....", socket.id);
        });
    });
}
