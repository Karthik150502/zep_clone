import express, { Application } from "express"
import "dotenv/config";
import cors from "cors"
import { initSocket } from "./socket/init";
import { createServer } from "http"
import { Server } from "socket.io"
import { Request, Response } from "express";
import UserRouter from "./api/v1/user/user"
import AdminRouter from "./api/v1/admin/admin"
import AvatarRouter from "./api/v1/avatar/avatar"
import AuthController from "./controller/Auth";
import SpacesRouter from "./api/v1/space/space"



const app: Application = express();
const PORT = process.env.PORT || 8001;
// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));




// Routes


app.use("/api/v1/user", UserRouter);
app.use("/api/v1/admin", AdminRouter);
app.use("/api/v1/avatars", AvatarRouter);
app.use("/api/v1/space", SpacesRouter);



app.post("/api/v1/sign-in", AuthController.login)
app.post("/api/v1/sign-up", AuthController.signup)

const server = createServer(app);
const io = new Server(server, {
    cors: {
        // origin: "*",
        // Origins to allow, to allow incoming traffic and to allow Socket interaction monitoring
        origin: process.env.APP_URL as string,
        credentials: true
    },
});


initSocket(io);
export { io };






app.get("/", (req: Request, res: Response) => {
    res.send("It's working 🙌");
    return;
});

server.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
