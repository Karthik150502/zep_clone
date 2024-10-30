import { Router } from "express";
import { AdminController } from "../../../controller/Admin";


const router = Router();


router.post("/avatar", AdminController.createAvatar);

export default router;