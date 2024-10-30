"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Spaces_1 = require("../../../controller/Spaces");
const router = (0, express_1.Router)();
router.post("/", Spaces_1.SpaceController.create);
router.get("/:spaceId", Spaces_1.SpaceController.getSpace);
exports.default = router;
