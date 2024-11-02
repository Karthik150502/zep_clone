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
const config_db_1 = __importDefault(require("../config/config.db"));
const space_1 = require("../events/space");
const UsersInSpace = {};
function initSocket(io) {
    io.on("connection", (socket) => {
        console.log("The socket connection has been initialized = ", socket.id);
        socket.on("message", (data) => __awaiter(this, void 0, void 0, function* () {
            console.log("Message from client = ", data);
        }));
        socket.on("metaverse-evt", (data) => __awaiter(this, void 0, void 0, function* () {
            console.log("From Client", data);
            switch (data.type) {
                case space_1.SPACE_EVENTS_INC.JOIN: {
                    if (!data.payload.token) {
                        socket.emit("metaverse-evt", {
                            type: space_1.SPACE_EVENTS_OUT.UNAUTHENTICATED,
                        });
                        return;
                    }
                    let res = (0, auth_1.default)(data.payload.token);
                    if (!res) {
                        socket.emit("metaverse-evt", {
                            type: space_1.SPACE_EVENTS_OUT.UNAUTHENTICATED,
                        });
                        return;
                    }
                    ;
                    let findUser = yield config_db_1.default.user.findUnique({
                        where: {
                            id: res.id
                        },
                        select: {
                            id: true,
                            username: true,
                            avatarId: true,
                            image: true
                        }
                    });
                    yield socket.join(data.payload.spaceId);
                    let chr = {
                        id: data.payload.id,
                        name: data.payload.name,
                        avatar: "null",
                        position: [0.5, 0.5],
                    };
                    socket.emit("metaverse-evt", {
                        type: space_1.SPACE_EVENTS_OUT.USER_JOIN,
                        payload: {
                            users: UsersInSpace,
                            userid: findUser.id,
                            x: 0.5,
                            y: 0.5
                        }
                    });
                    UsersInSpace[chr.id] = chr;
                    socket.to(data.payload.spaceId).emit("metaverse-evt", {
                        type: space_1.SPACE_EVENTS_OUT.SPACE_JOINED,
                        payload: {
                            spawn: {
                                x: 0.5,
                                y: 0.5
                            },
                            user: findUser,
                        }
                    });
                    break;
                }
                case space_1.SPACE_EVENTS_INC.MOVE: {
                    socket.to(data.payload.spaceId).emit("metaverse-evt", {
                        type: space_1.SPACE_EVENTS_OUT.MOVEMENT,
                        position: data.payload.position,
                        userId: data.payload.user,
                        spaceId: data.payload.spaceId
                    });
                }
                case space_1.SPACE_EVENTS_INC.LEAVE: {
                    socket.leave(data.payload.spaceId);
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
