import { Server, Socket } from "socket.io";
import { WS_EVENTS } from "../config/ws-events";
import AuthWsMiddleWare from "../lib/socket/auth";
import prisma from "../config/config.db";
import { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { SPACE_EVENTS_OUT, SPACE_EVENTS_INC } from "../events/space";

interface CustomSocket extends Socket {
    space?: string
}



type Character = {
    id: number
    name: string
    position: number[]
    avatar: string,
    message?: string
}

const UsersInSpace: { [id: string]: Character } = {}



export function initSocket(io: Server) {


    io.on("connection", (socket: CustomSocket) => {


        console.log("The socket connection has been initialized = ", socket.id);



        socket.on("message", async (data) => {
            console.log("Message from client = ", data);
        })



        socket.on("metaverse-evt", async (data) => {
            console.log("From Client", data);
            switch (data.type) {
                case SPACE_EVENTS_INC.JOIN: {
                    if (!data.payload.token) {
                        socket.emit("metaverse-evt", {
                            type: SPACE_EVENTS_OUT.UNAUTHENTICATED,
                        })
                        return;
                    }



                    let res = AuthWsMiddleWare(data.payload.token);
                    if (!res) {
                        socket.emit("metaverse-evt", {
                            type: SPACE_EVENTS_OUT.UNAUTHENTICATED,
                        })
                        return;
                    };

   

                    let findUser = await prisma.user.findUnique({
                        where: {
                            id: (res as JwtPayload).id
                        },
                        select: {
                            id: true,
                            username: true,
                            avatarId: true,
                            image: true
                        }
                    })
                    await socket.join(data.payload.spaceId);
    
                    let chr = {
                        id: data.payload.id,
                        name: data.payload.name,
                        avatar: "null",
                        position: [0.5, 0.5],
                    }


                    socket.emit("metaverse-evt", {
                        type: SPACE_EVENTS_OUT.USER_JOIN,
                        payload: {
                            users: UsersInSpace,
                            userid: findUser!.id,
                            x: 0.5,
                            y: 0.5
                        }
                    });

                    UsersInSpace[chr.id] = chr;

                    socket.to(data.payload.spaceId as string).emit("metaverse-evt", {
                        type: SPACE_EVENTS_OUT.SPACE_JOINED,
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

        
                case SPACE_EVENTS_INC.MOVE: {
                    socket.to(data.payload.spaceId as string).emit("metaverse-evt", {
                        type: SPACE_EVENTS_OUT.MOVEMENT,
                        position: data.payload.position,
                        userId: data.payload.user,
                        spaceId: data.payload.spaceId
                    });
                }
                case SPACE_EVENTS_INC.LEAVE: {

                    socket.leave(data.payload.spaceId as string);
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




