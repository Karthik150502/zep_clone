import { Router } from "express";
import { SpaceController } from "../../../controller/Spaces";


const router = Router();


router.post("/", SpaceController.create)
router.get("/:spaceId", SpaceController.getSpace)

export default router;