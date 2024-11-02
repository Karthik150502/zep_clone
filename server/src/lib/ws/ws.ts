import WebSocket from "ws";
import { SPACES } from "../../store/spaces";
import AuthWsMiddleWare from "../socket/auth";






export async function handleClientReq(ws: WebSocket, wss: WebSocket.Server, payload: any, isBinary: boolean) {


    const data = JSON.parse(payload)


    console.log(data)

    switch (data.type) {
        case "join": {
            const spaceId = data.payload.spaceId;
            const userId = data.payload.userId;
            const token = data.payload.token;
            const avatar = data.payload.avatar;
            const name = data.payload.name;


            let auth = AuthWsMiddleWare(token);
            if (!auth) {
                ws.send(JSON.stringify({ type: "unauthenticated", space: spaceId, message: `${userId} not igned in.` }));
                return;
            }

            if (!SPACES.has(spaceId)) {
                SPACES.set(spaceId, {
                    connections: new Set(),
                    users: {},
                });
            }
            const spaces = SPACES.get(spaceId)!.connections;
            const users = SPACES.get(spaceId)!.users;

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
                }
                users[userId] = user;
            }
            let user = users[userId]
            broadcastExceptSender(spaces, ws, JSON.stringify({
                type: "space-join", payload: {
                    space: spaceId, user: user
                }
            }), isBinary)
            break;
        }

        case "leave": {
            let spaceId = data.payload.spaceId;
            let userId = data.payload.userId;
            // Deleting the user in the WebSocket connection pool and from the users pool.
            delete SPACES.get(spaceId)!.users[userId];
            SPACES.get(spaceId)!.connections.delete(ws);
            // Getting the spaces to broadcast the left user to other players.
            const spaces = SPACES.get(spaceId)!.connections;
            broadcastExceptSender(spaces, ws, JSON.stringify({
                type: "user-leave", payload: {
                    space: spaceId, user: userId, message: `The user as left ${userId}`
                }
            }), isBinary);
            break;
        }

        case "move": {
            console.log(data)
            let spaceId = data.payload.spaceId;
            let userId = data.payload.userId;
            let position = data.payload.position;
            const spaces = SPACES.get(spaceId)!.connections;
            broadcastExceptSender(spaces, ws, JSON.stringify({
                type: "movement", payload: {
                    space: spaceId, user: userId, position: position
                }
            }), isBinary)
            const user = SPACES.get(spaceId)!.users[userId];
            user.position = {
                x: position[0],
                y: position[1]
            }
            break;
        }
        default:
            break;
    }
}

function broadcastExceptSender(clients: Set<WebSocket>, ws: WebSocket, data: string, isBinary: boolean) {
    clients.forEach((client) => {
        //To send the message to everyone else.
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(data, { binary: isBinary });
        }
    })
}
function broadcastToAll(clients: Set<WebSocket>, ws: WebSocket, data: string, isBinary: boolean) {
    clients.forEach((client) => {
        //To send the message to everyone else.
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(data, { binary: isBinary });
        }
    })
}