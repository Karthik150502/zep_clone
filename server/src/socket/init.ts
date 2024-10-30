import { Server, Socket } from "socket.io";
import { WS_EVENTS } from "../config/ws-events";
import AuthWsMiddleWare from "../lib/socket/auth";


interface CustomSocket extends Socket {
    space?: string
}



export function initSocket(io: Server) {


    io.use((socket: CustomSocket, next) => {
        const space = socket.handshake.auth.space || socket.handshake.headers.space;
        if (!space) {
            return next(new Error("Invalid Space Id."))
        }
        socket.space = space;
        next();
    })


    io.on("connection", (socket: CustomSocket) => {

        // Joining the room
        // socket.join(socket.room);


        console.log("The socket connection has been initialized = ", socket.id);



        socket.on("message", async (data) => {
            console.log("Message from client = ", data);
        })



        socket.on("metaverse-evt", async (data) => {
            console.log("From Client", data);
            switch (data.type) {
                case "join": {
                    if (!data.payload.token) {
                        socket.emit("metaverse-evt", {
                            type: "unauthenticated",
                        })
                        return;
                    }
                    if (!AuthWsMiddleWare(data.payload.token)) {
                        socket.emit("metaverse-evt", {
                            type: "unauthenticated",
                        })
                        return;
                    };

                    socket.to(socket.space as string).emit("metaverse-evt", {
                        type: "user-joined",
                        data
                    });
                    break;
                }

                case "move": {
                    socket.to(socket.space as string).emit("metaverse-evt", {
                        type: "user-moved",
                        data
                    });
                }
                default:
                    break;
            }



        })



        socket.on("disconnect", () => {
            console.log("The socket has been disconnected.....", socket.id)
        })
    })
}