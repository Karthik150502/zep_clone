import { Router } from "express";
import { UserController } from "../../../controller/UserController";


const router = Router();


router.post("/metadata", UserController.postMetadata)

export default router;