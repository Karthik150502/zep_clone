import { Router } from "express";
import { AvatarController } from "../../../controller/Avatar";


const router = Router();


router.get("/", AvatarController.getAll);

export default router;