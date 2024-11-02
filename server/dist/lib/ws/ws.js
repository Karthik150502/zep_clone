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
exports.handleClientReq = handleClientReq;
const ws_1 = __importDefault(require("ws"));
const spaces_1 = require("../../store/spaces");
const auth_1 = __importDefault(require("../socket/auth"));
function handleClientReq(ws, wss, payload, isBinary) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = JSON.parse(payload);
        console.log(data);
        switch (data.type) {
            case "join": {
                const spaceId = data.payload.spaceId;
                const userId = data.payload.userId;
                const token = data.payload.token;
                const avatar = data.payload.avatar;
                const name = data.payload.name;
                let auth = (0, auth_1.default)(token);
                if (!auth) {
                    ws.send(JSON.stringify({ type: "unauthenticated", space: spaceId, message: `${userId} not igned in.` }));
                    return;
                }
                if (!spaces_1.SPACES.has(spaceId)) {
                    spaces_1.SPACES.set(spaceId, {
                        connections: new Set(),
                        users: {},
                    });
                }
                const spaces = spaces_1.SPACES.get(spaceId).connections;
                const users = spaces_1.SPACES.get(spaceId).users;
                if (!spaces.has(ws)) {
                    spaces.add(ws);
                }
                ws.send(JSON.stringify({
                    type: "user-join", payload: {
                        space: spaceId, existingUsers: users, message: `Joined room ${spaceId}`
                    }
                }));
                if (!users[userId]) {
                    let user = {
                        id: userId,
                        avatar: avatar,
                        name: name,
                        position: {
                            x: 0.5,
                            y: 0.5,
                        }
                    };
                    users[userId] = user;
                }
                let user = users[userId];
                broadcastExceptSender(spaces, ws, JSON.stringify({
                    type: "space-join", payload: {
                        space: spaceId, user: user
                    }
                }), isBinary);
                break;
            }
            case "leave": {
                let spaceId = data.payload.spaceId;
                let userId = data.payload.userId;
                // Deleting the user in the WebSocket connection pool and from the users pool.
                delete spaces_1.SPACES.get(spaceId).users[userId];
                spaces_1.SPACES.get(spaceId).connections.delete(ws);
                // Getting the spaces to broadcast the left user to other players.
                const spaces = spaces_1.SPACES.get(spaceId).connections;
                broadcastExceptSender(spaces, ws, JSON.stringify({
                    type: "user-leave", payload: {
                        space: spaceId, user: userId, message: `The user as left ${userId}`
                    }
                }), isBinary);
                break;
            }
            case "move": {
                console.log(data);
                let spaceId = data.payload.spaceId;
                let userId = data.payload.userId;
                let position = data.payload.position;
                const spaces = spaces_1.SPACES.get(spaceId).connections;
                broadcastExceptSender(spaces, ws, JSON.stringify({
                    type: "movement", payload: {
                        space: spaceId, user: userId, position: position
                    }
                }), isBinary);
                const user = spaces_1.SPACES.get(spaceId).users[userId];
                user.position = {
                    x: position[0],
                    y: position[1]
                };
                break;
            }
            default:
                break;
        }
    });
}
function broadcastExceptSender(clients, ws, data, isBinary) {
    clients.forEach((client) => {
        //To send the message to everyone else.
        if (client !== ws && client.readyState === ws_1.default.OPEN) {
            client.send(data, { binary: isBinary });
        }
    });
}
function broadcastToAll(clients, ws, data, isBinary) {
    clients.forEach((client) => {
        //To send the message to everyone else.
        if (client !== ws && client.readyState === ws_1.default.OPEN) {
            client.send(data, { binary: isBinary });
        }
    });
}
